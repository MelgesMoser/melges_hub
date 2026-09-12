import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { firebaseAuth, firestore } from "./firebase.js";

// Catálogo mantido no app: não há coluna/atributo order_index no Firestore.
const categories = [
  ["Tecnologia", "Projetos de tecnologia, software e inovação"],
  ["Saúde e Bem-estar", "Projetos de saúde, qualidade de vida e bem-estar"],
  ["Educação", "Projetos educacionais, cursos e plataformas de ensino"],
  ["Negócios e Finanças", "Projetos empresariais, financeiros e comerciais"],
  ["Marketing e Comunicação", "Projetos de divulgação, publicidade e comunicação"],
  ["Beleza e Estética", "Projetos de beleza, estética e autocuidado"],
  ["Moda e Artes", "Projetos de moda, arte, cultura e criatividade"],
  ["Alimentação e Gastronomia", "Projetos de restaurantes, alimentação e gastronomia"],
  ["Engenharia e Construção", "Projetos de arquitetura, engenharia e construção"],
  ["Outros", "Outros tipos de projetos"],
].map(([name, description]) => ({ id: name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-"), name, description }));

const phases = [
  ["Em análise", "Solicitação recebida e aguardando avaliação da equipe."],
  ["Design", "Criação da identidade visual e das telas"],
  ["Desenvolvimento", "Programação e construção do projeto"],
  ["Planejamento", "Definição de objetivos, escopo e cronograma"],
  ["Pesquisa", "Levantamento de referências e informações"],
  ["Prototipagem", "Criação de protótipos e validação de ideias"],
  ["Implementação", "Aplicação das funcionalidades no projeto"],
  ["Testes", "Verificação de qualidade, erros e desempenho"],
  ["Revisão", "Ajustes finais após análise do projeto"],
  ["Documentação", "Registro técnico e orientações de uso"],
  ["Lançamento", "Publicação e disponibilização do projeto"],
  ["Manutenção", "Correções e melhorias após o lançamento"],
  ["Concluído", "Projeto finalizado e entregue"],
  ["Pausado", "Projeto temporariamente interrompido"],
  ["Cancelado", "Projeto encerrado sem conclusão"],
].map(([name, description], index) => ({ id: `phase-${index + 1}`, name, description }));
const catalog = { categories, phases };
const dateValue = (value) => value?.toDate ? value.toDate().toISOString() : value || new Date().toISOString();
const phasePosition = (phaseId) => Math.max(1, phases.findIndex((phase) => phase.id === phaseId) + 1);

async function currentAccount() {
  const user = firebaseAuth.currentUser;
  if (!user) throw new Error("Sua sessão expirou. Entre novamente.");
  // Claims administrativas podem ser alteradas no Firebase Admin; force a
  // renovação ao carregar a conta para refletir a mudança imediatamente.
  const claims = await user.getIdTokenResult(true);
  const profile = await getDoc(doc(firestore, "users", user.uid));
  const saved = profile.exists() ? profile.data() : {};
  return { id: user.uid, username: saved.username || user.displayName || user.email?.split("@")[0] || "Cliente", name: saved.name || user.displayName || "Cliente", email: user.email || "", isAdmin: saved.isAdmin === true && claims.claims.admin === true };
}

function projectFromDoc(snapshot) {
  const data = snapshot.data();
  return { id: snapshot.id, ...data, phasePosition: phasePosition(data.phaseId), createdAt: dateValue(data.createdAt), updatedAt: dateValue(data.updatedAt), owner: data.ownerName || "Cliente", ownerEmail: data.ownerEmail || "" };
}

async function userProjects(account) {
  const source = account.isAdmin ? collection(firestore, "projects") : query(collection(firestore, "projects"), where("ownerId", "==", account.id));
  const snapshot = await getDocs(source);
  return snapshot.docs.map(projectFromDoc).sort((a, b) => {
    const queuePosition = (project) => project.approvalStatus === "rejected" ? 1 : 0;
    return queuePosition(a) - queuePosition(b) || new Date(b.updatedAt) - new Date(a.updatedAt);
  });
}

async function notifications(account) {
  const snapshot = await getDocs(query(collection(firestore, "notifications"), where("recipientId", "==", account.id)));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data(), createdAt: dateValue(item.data().createdAt) })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function loadDashboard() {
  const account = await currentAccount();
  const [projects, alerts] = await Promise.all([userProjects(account), notifications(account)]);
  const accepted = projects.filter((project) => project.approvalStatus === "accepted");
  return { profile: account, projects, notifications: alerts, catalog, stats: { total: projects.length, inProgress: accepted.filter((project) => project.phasePosition < 13).length, published: accepted.filter((project) => project.phase === "Concluído").length } };
}

function selectedCategory(id) { return categories.find((item) => item.id === id) || categories.find((item) => item.name === id); }
async function notify(recipientId, projectName, message) {
  // setDoc evita que uma nova tentativa de gravação falhe se o SDK reaproveitar
  // o mesmo identificador automático após uma oscilação de conexão.
  const notificationRef = doc(collection(firestore, "notifications"));
  await setDoc(notificationRef, { recipientId, projectName, message, createdAt: serverTimestamp() });
}
async function notifyOwnerAndAdmin(adminId, project, message) {
  const recipients = project.ownerId === adminId ? [adminId] : [project.ownerId, adminId];
  await Promise.all(recipients.map((recipientId) => notify(recipientId, project.name, message)));
}

async function createProject(body) {
  const account = await currentAccount(); const category = selectedCategory(body.categoryId);
  if (!category) throw new Error("Selecione uma categoria válida.");
  const ref = await addDoc(collection(firestore, "projects"), { ownerId: account.id, ownerName: account.name, ownerEmail: account.email, name: body.name.trim(), description: body.description.trim(), features: body.features?.trim() || "", categoryId: category.id, category: category.name, phaseId: phases[0].id, phase: phases[0].name, approvalStatus: "pending", progressPercent: 0, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  // Notificações são criadas exclusivamente pela administração. O cliente já
  // vê a solicitação criada em “Meus projetos”, sem precisar escrever nela.
  return { id: ref.id };
}

function requireAdmin(account) { if (!account.isAdmin) throw new Error("Acesso restrito à administração."); }
async function adminPatch(id, action, body) {
  const account = await currentAccount(); requireAdmin(account);
  const ref = doc(firestore, "projects", id); const snapshot = await getDoc(ref); if (!snapshot.exists()) throw new Error("Projeto não encontrado.");
  const project = snapshot.data(); let changes;
  let notificationMessage;
  if (action === "approval") {
    changes = { approvalStatus: body.approvalStatus, updatedAt: serverTimestamp() };
    notificationMessage = body.approvalStatus === "accepted" ? "A solicitação foi aceita pela administração." : "A solicitação foi recusada pela administração.";
  }
  else if (action === "phase" || action === "progress") {
    const phase = phases.find((item) => item.id === (body.phaseId || project.phaseId));
    if (!phase) throw new Error("Fase inválida.");
    const progress = Math.max(0, Math.min(100, Number(body.progressPercent ?? project.progressPercent)));
    changes = { phaseId: phase.id, phase: phase.name, progressPercent: progress, updatedAt: serverTimestamp() };
    notificationMessage = `A fase foi atualizada para “${phase.name}” e o progresso para ${progress}%.`;
  }
  else {
    const category = selectedCategory(body.categoryId);
    if (!category) throw new Error("Categoria inválida.");
    changes = { name: body.name.trim(), description: body.description.trim(), features: body.features?.trim() || "", categoryId: category.id, category: category.name, updatedAt: serverTimestamp() };
    notificationMessage = "Os dados do projeto foram atualizados pela administração.";
  }
  await updateDoc(ref, changes);
  try {
    await notifyOwnerAndAdmin(account.id, { ...project, ...changes }, notificationMessage);
  } catch (notificationError) {
    console.warn("O projeto foi atualizado, mas a notificação não pôde ser salva.", notificationError);
  }
}

export async function request(path, options = {}) {
  try {
    const body = options.body ? JSON.parse(options.body) : {};
    if (path === "/dashboard") return loadDashboard();
    if (path === "/meta") return catalog;
    if (path === "/projects" && options.method === "POST") return createProject(body);
    if (path === "/projects" && !options.method) return { projects: (await loadDashboard()).projects };
    const mine = path.match(/^\/projects\/([^/]+)$/);
    if (mine && options.method === "PATCH") { const account = await currentAccount(); const ref = doc(firestore, "projects", mine[1]); const previous = await getDoc(ref); if (!previous.exists() || previous.data().ownerId !== account.id) throw new Error("Projeto não encontrado."); const category = selectedCategory(body.categoryId); if (!category) throw new Error("Categoria inválida."); await updateDoc(ref, { name: body.name.trim(), description: body.description.trim(), features: body.features?.trim() || "", categoryId: category.id, category: category.name, updatedAt: serverTimestamp() }); return null; }
    if (path === "/admin/projects" && !options.method) { const account = await currentAccount(); requireAdmin(account); return { projects: await userProjects(account), ...catalog }; }
    const admin = path.match(/^\/admin\/projects\/([^/]+)(?:\/(phase|progress|approval))?$/);
    if (admin && options.method === "PATCH") { await adminPatch(admin[1], admin[2], body); return null; }
    throw new Error("Operação não reconhecida.");
  } catch (error) { throw new Error(error?.message || "Não foi possível concluir a solicitação no Firebase."); }
}

export async function firebaseAccount() { return currentAccount(); }
