import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
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
let accountCache = null;

async function currentAccount({ refresh = false } = {}) {
  const user = firebaseAuth.currentUser;
  if (!user) throw new Error("Sua sessão expirou. Entre novamente.");
  // A conta é usada por todas as telas. Reutilizá-la evita uma nova leitura do
  // perfil e uma renovação do token a cada clique na navegação lateral.
  if (!refresh && accountCache?.id === user.uid) return accountCache;
  const claims = await user.getIdTokenResult(refresh);
  const profile = await getDoc(doc(firestore, "users", user.uid));
  const saved = profile.exists() ? profile.data() : {};
  accountCache = { id: user.uid, username: saved.username || user.displayName || user.email?.split("@")[0] || "Cliente", name: saved.name || user.displayName || "Cliente", email: user.email || "", isAdmin: saved.isAdmin === true && claims.claims.admin === true };
  return accountCache;
}

function projectFromDoc(snapshot) {
  const data = snapshot.data();
  return { id: snapshot.id, ...data, phasePosition: phasePosition(data.phaseId), createdAt: dateValue(data.createdAt), updatedAt: dateValue(data.updatedAt), owner: data.ownerName || "Cliente", ownerEmail: data.ownerEmail || "" };
}

async function userProjects(account) {
  const source = account.isAdmin ? collection(firestore, "projects") : query(collection(firestore, "projects"), where("ownerId", "==", account.id));
  const snapshot = await getDocs(source);
  return projectsFromSnapshot(snapshot);
}

function projectsFromSnapshot(snapshot) {
  return snapshot.docs.map(projectFromDoc).sort((a, b) => {
    const queuePosition = (project) => project.approvalStatus === "rejected" ? 1 : 0;
    return queuePosition(a) - queuePosition(b) || new Date(b.updatedAt) - new Date(a.updatedAt);
  });
}

// O painel administrativo usa uma única inscrição em tempo real. Isso evita
// recarregar toda a coleção ao clicar entre as abas e mantém as alterações
// feitas por outro administrador imediatamente visíveis.
export function subscribeAdminProjects(onData, onError) {
  return onSnapshot(
    collection(firestore, "projects"),
    (snapshot) => onData({ projects: projectsFromSnapshot(snapshot), ...catalog }),
    onError,
  );
}

async function notifications(account) {
  const snapshot = await getDocs(query(collection(firestore, "notifications"), where("recipientId", "==", account.id)));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data(), createdAt: dateValue(item.data().createdAt) })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function notificationsFromSnapshot(snapshot) {
  return snapshot.docs
    .map((item) => ({ id: item.id, ...item.data(), createdAt: dateValue(item.data().createdAt) }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * Fonte única de dados para “Meus projetos”. Os dois listeners eliminam a
 * cascata anterior de onSnapshot -> getDocs -> nova renderização, que fazia a
 * lista desaparecer ou ficar lenta em conexões instáveis.
 */
export function subscribeProjectDashboard(account, onData, onError) {
  const projectsSource = account.isAdmin
    ? collection(firestore, "projects")
    : query(collection(firestore, "projects"), where("ownerId", "==", account.id));
  const notificationsSource = query(collection(firestore, "notifications"), where("recipientId", "==", account.id));
  let projects = null;
  let alerts = null;
  const emit = () => {
    if (projects === null || alerts === null) return;
    const accepted = projects.filter((project) => project.approvalStatus === "accepted");
    onData({
      profile: account,
      projects,
      notifications: alerts,
      catalog,
      stats: {
        total: projects.length,
        inProgress: accepted.filter((project) => project.phasePosition < 13).length,
        published: accepted.filter((project) => project.phase === "Concluído").length,
      },
    });
  };
  const unsubscribeProjects = onSnapshot(
    projectsSource,
    (snapshot) => { projects = projectsFromSnapshot(snapshot); emit(); },
    onError,
  );
  const unsubscribeNotifications = onSnapshot(
    notificationsSource,
    (snapshot) => { alerts = notificationsFromSnapshot(snapshot); emit(); },
    onError,
  );
  return () => { unsubscribeProjects(); unsubscribeNotifications(); };
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
    if (!["accepted", "rejected"].includes(body.approvalStatus)) throw new Error("Status de aprovação inválido.");
    if (body.approvalStatus === "accepted") {
      const quoteAmount = Number(body.quoteAmount);
      const deliveryDays = Number(body.deliveryDays);
      if (!Number.isFinite(quoteAmount) || quoteAmount <= 0 || quoteAmount > 10000000) throw new Error("Informe um valor válido para aceitar o projeto.");
      if (!Number.isInteger(deliveryDays) || deliveryDays < 1 || deliveryDays > 3650) throw new Error("Informe um prazo de entrega válido em dias.");
      changes = { approvalStatus: "accepted", quoteAmount, deliveryDays, acceptedAt: serverTimestamp(), updatedAt: serverTimestamp() };
      notificationMessage = `A solicitação foi aceita. Valor aprovado: ${quoteAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}; prazo estimado: ${deliveryDays} dia(s).`;
    } else {
      changes = { approvalStatus: "rejected", updatedAt: serverTimestamp() };
      notificationMessage = "A solicitação foi recusada pela administração.";
    }
  }
  else if (action === "phase" || action === "progress") {
    const phase = phases.find((item) => item.id === (body.phaseId || project.phaseId));
    if (!phase) throw new Error("Fase inválida.");
    const progress = Math.max(0, Math.min(100, Number(body.progressPercent ?? project.progressPercent)));
    const completed = phase.name === "Concluído";
    changes = {
      phaseId: phase.id,
      phase: phase.name,
      // A conclusão é o marco financeiro do projeto. Ao escolhê-la, o
      // progresso é fechado e a data é persistida para os gráficos mensais.
      progressPercent: completed ? 100 : progress,
      ...(completed ? { completedAt: serverTimestamp() } : {}),
      updatedAt: serverTimestamp(),
    };
    notificationMessage = completed
      ? "O projeto foi marcado como concluído e seu valor entrou no financeiro como receita realizada."
      : `A fase foi atualizada para “${phase.name}” e o progresso para ${progress}%.`;
  }
  else {
    const category = selectedCategory(body.categoryId);
    if (!category) throw new Error("Categoria inválida.");
    changes = { name: body.name.trim(), description: body.description.trim(), features: body.features?.trim() || "", categoryId: category.id, category: category.name, updatedAt: serverTimestamp() };
    const quoteProvided = String(body.quoteAmount ?? "").trim() !== "";
    const daysProvided = String(body.deliveryDays ?? "").trim() !== "";
    if (quoteProvided || daysProvided || project.approvalStatus === "accepted") {
      const quoteAmount = Number(body.quoteAmount ?? project.quoteAmount);
      const deliveryDays = Number(body.deliveryDays ?? project.deliveryDays);
      if (!Number.isFinite(quoteAmount) || quoteAmount <= 0 || quoteAmount > 10000000) throw new Error("Informe um valor aprovado válido.");
      if (!Number.isInteger(deliveryDays) || deliveryDays < 1 || deliveryDays > 3650) throw new Error("Informe um prazo válido em dias úteis.");
      changes = { ...changes, quoteAmount, deliveryDays };
      notificationMessage = "Os dados, o valor e o prazo do projeto foram atualizados pela administração.";
    } else notificationMessage = "Os dados do projeto foram atualizados pela administração.";
  }
  await updateDoc(ref, changes);
  try {
    await notifyOwnerAndAdmin(account.id, { ...project, ...changes }, notificationMessage);
  } catch (notificationError) {
    console.warn("O projeto foi atualizado, mas a notificação não pôde ser salva.", notificationError);
  }
}

const defaultPricingTable = {
  columns: [
    { id: "service", label: "Funcionalidade" },
    { id: "base", label: "Valor base" },
  ],
  rows: [
    { id: "institutional", label: "Site institucional", values: { base: "R$ 0,00" } },
    { id: "landing", label: "Landing page", values: { base: "R$ 0,00" } },
  ],
};
function normalizePricingTable(table) {
  const columns = Array.isArray(table?.columns) ? table.columns.slice(0, 12).map((column, index) => ({ id: String(column.id || `column-${index + 1}`).slice(0, 60), label: String(column.label || "Nova coluna").trim().slice(0, 80) })) : defaultPricingTable.columns;
  const rows = Array.isArray(table?.rows) ? table.rows.slice(0, 50).map((row, index) => ({ id: String(row.id || `row-${index + 1}`).slice(0, 60), label: String(row.label || "Nova funcionalidade").trim().slice(0, 120), values: Object.fromEntries(columns.filter((column) => column.id !== "service").map((column) => [column.id, String(row.values?.[column.id] || "").slice(0, 80)])) })) : defaultPricingTable.rows;
  if (!columns.length || !rows.every((row) => row.label)) throw new Error("A tabela precisa ter ao menos uma coluna e linhas identificadas.");
  return { columns, rows };
}
async function pricingTable() {
  const account = await currentAccount(); requireAdmin(account);
  const snapshot = await getDoc(doc(firestore, "pricing", "table"));
  return snapshot.exists() ? normalizePricingTable(snapshot.data()) : defaultPricingTable;
}
async function savePricingTable(body) {
  const account = await currentAccount(); requireAdmin(account);
  const table = normalizePricingTable(body);
  await setDoc(doc(firestore, "pricing", "table"), { ...table, updatedAt: serverTimestamp() });
  return table;
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
    if (path === "/admin/pricing" && !options.method) return pricingTable();
    if (path === "/admin/pricing" && options.method === "PUT") return savePricingTable(body);
    const admin = path.match(/^\/admin\/projects\/([^/]+)(?:\/(phase|progress|approval))?$/);
    if (admin && options.method === "PATCH") { await adminPatch(admin[1], admin[2], body); return null; }
    throw new Error("Operação não reconhecida.");
  } catch (error) { throw new Error(error?.message || "Não foi possível concluir a solicitação no Firebase."); }
}

export async function firebaseAccount(options) { return currentAccount(options); }
export function clearFirebaseAccountCache() { accountCache = null; }
