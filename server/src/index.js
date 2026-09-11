require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const path = require("path");
const { z } = require("zod");
const db = require("./db");

const app = express();
const port = Number(process.env.PORT || 3001);
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error("JWT_SECRET precisa ter pelo menos 32 caracteres.");
app.disable("x-powered-by");

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN, methods: ["GET", "POST", "PATCH"] }));
app.use(express.json({ limit: "100kb" }));
const rateLimitOptions = { windowMs: 15 * 60 * 1000, standardHeaders: true, legacyHeaders: false, message: { error: "Muitas tentativas. Aguarde alguns minutos e tente novamente." } };
app.use("/api/v1/auth", rateLimit({ ...rateLimitOptions, max: 12 }));

const publicUser = (user) => ({ id: user.id, username: user.username, name: user.full_name, email: user.email, phone: user.phone, company: user.company, isAdmin: Boolean(user.is_admin) });
const tokenFor = (user) => jwt.sign({ sub: user.id, sv: user.session_version }, process.env.JWT_SECRET, { expiresIn: "1h", issuer: "melges-bff", audience: "melges-web" });
const auth = async (req, res, next) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return res.status(401).json({ error: "Não autenticado." });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, { issuer: "melges-bff", audience: "melges-web" });
    const [[user]] = await db.execute("SELECT id, is_admin, is_active, session_version FROM users WHERE id=?", [payload.sub]);
    if (!user || !user.is_active || user.session_version !== payload.sv) return res.status(401).json({ error: "Sessão inválida ou revogada." });
    req.user = { sub: user.id, isAdmin: Boolean(user.is_admin) };
    next();
  } catch { res.status(401).json({ error: "Sessão inválida ou expirada." }); }
};

const codeHash = (code) => crypto.createHash("sha256").update(`${code}:${process.env.JWT_SECRET}`).digest("hex");
const phonePattern = /^\+[1-9]\d{7,14}$/;
async function deliverCode(user, channel, code) {
  const recipient = channel === "email" ? user.email : user.phone;
  if (!recipient) { const error = new Error(`Não há ${channel === "email" ? "e-mail" : "telefone"} cadastrado para esta conta.`); error.status = 400; throw error; }
  if (channel === "email") {
    if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) { const error = new Error("O envio de e-mail ainda não foi configurado. Configure RESEND_API_KEY e EMAIL_FROM no servidor."); error.status = 503; throw error; }
    const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: process.env.EMAIL_FROM, to: [recipient], subject: "Seu código de acesso Melges", html: `<p>Seu código é:</p><h1 style=\"letter-spacing:8px\">${code}</h1><p>Ele expira em 10 minutos. Não compartilhe este código.</p>` }) });
    if (!response.ok) { const error = new Error("Não foi possível enviar o código para este e-mail."); error.status = 502; throw error; }
  } else {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_FROM) { const error = new Error("O envio por telefone ainda não foi configurado. Configure as credenciais do Twilio no servidor."); error.status = 503; throw error; }
    const form = new URLSearchParams({ To: recipient, From: process.env.TWILIO_PHONE_FROM, Body: `Seu código de acesso Melges é ${code}. Ele expira em 10 minutos.` });
    const basic = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64");
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, { method: "POST", headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/x-www-form-urlencoded" }, body: form });
    if (!response.ok) { const error = new Error("Não foi possível enviar o código para este telefone."); error.status = 502; throw error; }
  }
}
async function createChallenge(user, channel) {
  if (channel === "phone" && (!user.phone || !phonePattern.test(user.phone))) { const error = new Error("Cadastre um telefone válido no formato +5511999999999 para usar essa opção."); error.status = 400; throw error; }
  const code = crypto.randomInt(100000, 1000000).toString();
  const id = crypto.randomUUID();
  await db.execute("UPDATE auth_codes SET consumed_at=NOW() WHERE user_id=? AND channel=? AND consumed_at IS NULL", [user.id, channel]);
  await db.execute("INSERT INTO auth_codes (id, user_id, channel, code_hash, expires_at) VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))", [id, user.id, channel, codeHash(code)]);
  try { await deliverCode(user, channel, code); } catch (error) { await db.execute("DELETE FROM auth_codes WHERE id=?", [id]); throw error; }
  return { challengeId: id, channel, destination: channel === "email" ? user.email.replace(/(^.).*(@.*$)/, "$1***$2") : user.phone.replace(/.(?=.{4})/g, "*") };
}

const registration = z.object({ username: z.string().trim().min(3).max(50), name: z.string().trim().min(2).max(100), email: z.string().trim().email().max(150), password: z.string().min(8).max(72), phone: z.string().trim().max(30).optional(), company: z.string().trim().max(150).optional() });
app.post("/api/v1/auth/register", async (req, res, next) => {
  try {
    const input = registration.parse(req.body);
    const hash = await bcrypt.hash(input.password, 12);
    const [result] = await db.execute("INSERT INTO users (username, full_name, email, phone, company, password, is_admin) VALUES (?, ?, ?, ?, ?, ?, false)", [input.username, input.name, input.email.toLowerCase(), input.phone || null, input.company || null, hash]);
    const [[user]] = await db.execute("SELECT * FROM users WHERE id = ?", [result.insertId]);
    res.status(201).json({ token: tokenFor(user), user: publicUser(user) });
  } catch (error) { next(error); }
});

app.post("/api/v1/auth/login", async (req, res, next) => {
  try {
    const input = z.object({ email: z.string().email(), password: z.string().min(1).max(72) }).parse(req.body);
    const [[user]] = await db.execute("SELECT * FROM users WHERE email = ?", [input.email.toLowerCase()]);
    if (!user || !(await bcrypt.compare(input.password, user.password))) return res.status(401).json({ error: "E-mail ou senha incorretos." });
    res.json({ token: tokenFor(user), user: publicUser(user) });
  } catch (error) { next(error); }
});

app.get("/api/v1/auth/me", auth, async (req, res, next) => { try { const [[user]] = await db.execute("SELECT * FROM users WHERE id = ?", [req.user.sub]); res.json({ user: publicUser(user) }); } catch (error) { next(error); } });
const projectColumns = "p.id, p.name, p.description, p.features, p.approval_status AS approvalStatus, p.progress_percent AS progressPercent, p.created_at AS createdAt, p.updated_at AS updatedAt, c.id AS categoryId, c.name AS category, ph.id AS phaseId, ph.name AS phase, ph.order_index AS phaseOrder, u.full_name AS owner, u.email AS ownerEmail";
const projectQuery = `SELECT ${projectColumns} FROM projects p JOIN users u ON u.id=p.user_id JOIN categories c ON c.id=p.category_id JOIN phases ph ON ph.id=p.phase_id WHERE p.user_id=? ORDER BY p.created_at DESC`;
const acceptedProjectsQuery = `SELECT ${projectColumns} FROM projects p JOIN users u ON u.id=p.user_id JOIN categories c ON c.id=p.category_id JOIN phases ph ON ph.id=p.phase_id WHERE p.approval_status='accepted' ORDER BY p.created_at DESC`;
const addNotification = (projectId, recipientUserId, message) => db.execute("INSERT INTO project_notifications (project_id, recipient_user_id, message) VALUES (?, ?, ?)", [projectId, recipientUserId, message]);
app.get("/api/v1/meta", auth, async (_req, res, next) => { try { const [categories] = await db.query("SELECT id, name FROM categories ORDER BY name"); const [phases] = await db.query("SELECT id, name, description, order_index AS orderIndex FROM phases ORDER BY order_index"); res.json({ categories, phases }); } catch (error) { next(error); } });
app.get("/api/v1/dashboard", auth, async (req, res, next) => { try { const [[user]] = await db.execute("SELECT * FROM users WHERE id=?", [req.user.sub]); const [projects] = user.is_admin ? await db.query(acceptedProjectsQuery) : await db.execute(projectQuery, [req.user.sub]); const [categories] = await db.query("SELECT id, name FROM categories ORDER BY name"); const [phases] = await db.query("SELECT id, name, description, order_index AS orderIndex FROM phases ORDER BY order_index"); const [notifications] = await db.execute("SELECT n.id, n.message, n.created_at AS createdAt, p.name AS projectName FROM project_notifications n JOIN projects p ON p.id=n.project_id WHERE n.recipient_user_id=? ORDER BY n.created_at DESC LIMIT 50", [req.user.sub]); const accepted = projects.filter((project) => project.approvalStatus === "accepted"); res.json({ profile: publicUser(user), projects, notifications, catalog: { categories, phases }, stats: { total: projects.length, inProgress: accepted.filter((project) => project.phaseOrder < 4).length, published: accepted.filter((project) => project.phaseOrder === 4).length } }); } catch (error) { next(error); } });
app.get("/api/v1/projects", auth, async (req, res, next) => { try { const [projects] = req.user.isAdmin ? await db.query(acceptedProjectsQuery) : await db.execute(projectQuery, [req.user.sub]); res.json({ projects }); } catch (error) { next(error); } });
app.post("/api/v1/projects", auth, async (req, res, next) => { try { const input = z.object({ name: z.string().trim().min(2).max(150), description: z.string().trim().min(5), features: z.string().max(5000).optional(), categoryId: z.number().int().positive() }).parse(req.body); const [[initialPhase]] = await db.query("SELECT id FROM phases WHERE name = 'Em análise' LIMIT 1"); if (!initialPhase) return res.status(500).json({ error: "A fase inicial 'Em análise' não foi configurada no banco." }); const [result] = await db.execute("INSERT INTO projects (user_id, category_id, phase_id, name, description, features) VALUES (?, ?, ?, ?, ?, ?)", [req.user.sub, input.categoryId, initialPhase.id, input.name, input.description, input.features || null]); await addNotification(result.insertId, req.user.sub, "Sua solicitação foi enviada e está em análise."); res.status(201).json({ id: result.insertId }); } catch (error) { next(error); } });
app.patch("/api/v1/projects/:id", auth, async (req, res, next) => { try { const projectId = z.coerce.number().int().positive().parse(req.params.id); const input = z.object({ name: z.string().trim().min(2).max(150), description: z.string().trim().min(5), features: z.string().max(5000).optional(), categoryId: z.number().int().positive() }).parse(req.body); const [[previous]] = await db.execute("SELECT name, description, features, category_id AS categoryId FROM projects WHERE id=? AND user_id=?", [projectId, req.user.sub]); if (!previous) return res.status(404).json({ error: "Projeto não encontrado." }); const changed = [[previous.name !== input.name, "nome"], [previous.description !== input.description, "descrição"], [(previous.features || "") !== (input.features || ""), "funcionalidades"], [previous.categoryId !== input.categoryId, "categoria"]].filter(([didChange]) => didChange).map(([, label]) => label); await db.execute("UPDATE projects SET name=?, description=?, features=?, category_id=? WHERE id=? AND user_id=?", [input.name, input.description, input.features || null, input.categoryId, projectId, req.user.sub]); if (changed.length) await addNotification(projectId, req.user.sub, `Você alterou: ${changed.join(", ")}.`); res.status(204).end(); } catch (error) { next(error); } });
const updateProjectPhase = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ error: "Somente administradores podem alterar a fase." });
    const projectId = z.coerce.number().int().positive().parse(req.params.id);
    const { phaseId } = z.object({ phaseId: z.number().int().positive() }).parse(req.body);
    const [[project]] = await db.execute("SELECT p.user_id AS userId, ph.name AS phaseName FROM projects p JOIN phases ph ON ph.id=p.phase_id WHERE p.id=?", [projectId]);
    if (!project) return res.status(404).json({ error: "Projeto não encontrado." });
    const [[phase]] = await db.execute("SELECT id, name FROM phases WHERE id=?", [phaseId]);
    if (!phase) return res.status(400).json({ error: "A fase selecionada não existe." });
    const [result] = await db.execute("UPDATE projects SET phase_id=? WHERE id=?", [phaseId, projectId]);
    if (!result.affectedRows) return res.status(404).json({ error: "Projeto não encontrado." });
    if (project.phaseName !== phase.name) await addNotification(projectId, project.userId, `A fase de desenvolvimento foi alterada de “${project.phaseName}” para “${phase.name}”.`);
    res.json({ message: "Fase atualizada com sucesso.", phase });
  } catch (error) { next(error); }
};

// Rota administrativa usada pelo BFF. A rota abaixo é mantida para compatibilidade.
app.patch("/api/v1/admin/projects/:id/phase", auth, updateProjectPhase);
app.patch("/api/v1/projects/:id/phase", auth, updateProjectPhase);
app.get("/api/v1/admin/projects", auth, async (req, res, next) => { try { if (!req.user.isAdmin) return res.status(403).json({ error: "Acesso restrito à administração." }); const [projects] = await db.query(`SELECT ${projectColumns} FROM projects p JOIN users u ON u.id=p.user_id JOIN categories c ON c.id=p.category_id JOIN phases ph ON ph.id=p.phase_id ORDER BY p.created_at DESC`); const [phases] = await db.query("SELECT id, name, order_index AS orderIndex FROM phases ORDER BY order_index"); const [categories] = await db.query("SELECT id, name FROM categories ORDER BY name"); res.json({ projects, phases, categories }); } catch (error) { next(error); } });
app.patch("/api/v1/admin/projects/:id", auth, async (req, res, next) => { try { if (!req.user.isAdmin) return res.status(403).json({ error: "Acesso restrito à administração." }); const projectId = z.coerce.number().int().positive().parse(req.params.id); const input = z.object({ name: z.string().trim().min(2).max(150), description: z.string().trim().min(5), features: z.string().max(5000).optional(), categoryId: z.number().int().positive() }).parse(req.body); const [[project]] = await db.execute("SELECT user_id AS userId FROM projects WHERE id=?", [projectId]); if (!project) return res.status(404).json({ error: "Projeto não encontrado." }); const [[category]] = await db.execute("SELECT id FROM categories WHERE id=?", [input.categoryId]); if (!category) return res.status(400).json({ error: "A categoria selecionada não existe." }); await db.execute("UPDATE projects SET name=?, description=?, features=?, category_id=? WHERE id=?", [input.name, input.description, input.features || null, input.categoryId, projectId]); await addNotification(projectId, project.userId, "Os dados do seu projeto foram atualizados pela administração."); res.status(204).end(); } catch (error) { next(error); } });
app.patch("/api/v1/admin/projects/:id/progress", auth, async (req, res, next) => { try { if (!req.user.isAdmin) return res.status(403).json({ error: "Acesso restrito à administração." }); const projectId = z.coerce.number().int().positive().parse(req.params.id); const { progressPercent } = z.object({ progressPercent: z.number().int().min(0).max(100) }).parse(req.body); const [[project]] = await db.execute("SELECT user_id AS userId, progress_percent AS progressPercent FROM projects WHERE id=?", [projectId]); if (!project) return res.status(404).json({ error: "Projeto não encontrado." }); await db.execute("UPDATE projects SET progress_percent=? WHERE id=?", [progressPercent, projectId]); if (project.progressPercent !== progressPercent) await addNotification(projectId, project.userId, `O progresso do projeto foi atualizado para ${progressPercent}%.`); res.status(204).end(); } catch (error) { next(error); } });
app.patch("/api/v1/admin/projects/:id/approval", auth, async (req, res, next) => { try { if (!req.user.isAdmin) return res.status(403).json({ error: "Acesso restrito à administração." }); const projectId = z.coerce.number().int().positive().parse(req.params.id); const { approvalStatus } = z.object({ approvalStatus: z.enum(["accepted", "rejected"]) }).parse(req.body); const [[project]] = await db.execute("SELECT user_id AS userId, approval_status AS approvalStatus FROM projects WHERE id=?", [projectId]); if (!project) return res.status(404).json({ error: "Projeto não encontrado." }); await db.execute("UPDATE projects SET approval_status=? WHERE id=?", [approvalStatus, projectId]); if (project.approvalStatus !== approvalStatus) await addNotification(projectId, project.userId, approvalStatus === "accepted" ? "Sua solicitação foi aceita pela administração." : "Sua solicitação foi recusada pela administração."); res.status(204).end(); } catch (error) { next(error); } });
app.get("/api/v1/health", async (_req, res) => { try { await db.query("SELECT 1"); res.json({ status: "ok", service: "melges-bff" }); } catch { res.status(503).json({ status: "database_unavailable" }); } });
// Em produção, a API também entrega a versão compilada do site no mesmo domínio.
const webDist = path.join(__dirname, "..", "..", "melges-landing", "dist");
app.use(express.static(webDist, { index: false, maxAge: process.env.NODE_ENV === "production" ? "1h" : 0 }));
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api/")) return res.sendFile(path.join(webDist, "index.html"));
  next();
});
app.use((error, _req, res, _next) => {
  if (error?.status) return res.status(error.status).json({ error: error.message || "Não foi possível concluir a solicitação." });
  if (error?.type === "entity.parse.failed") return res.status(400).json({ error: "O corpo da solicitação deve ser um JSON válido." });
  if (error instanceof z.ZodError) return res.status(400).json({ error: "Dados inválidos.", fields: error.flatten() });
  if (error?.code === "ER_DUP_ENTRY") return res.status(409).json({ error: "Este e-mail ou usuário já existe." });
  console.error(error);
  res.status(500).json({ error: "Erro interno do servidor." });
});
app.listen(port, () => console.log(`API disponível em http://localhost:${port}`));
