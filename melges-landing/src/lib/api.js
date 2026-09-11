const API = "/api/v1";

export async function request(path, options = {}, token) {
  try {
    const response = await fetch(`${API}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
    });
    const data = response.status === 204 ? null : await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data?.error || `Não foi possível concluir a solicitação (erro ${response.status}).`);
    return data;
  } catch (error) {
    if (error instanceof TypeError) throw new Error("Não foi possível alcançar o servidor. Confirme que o comando npm run start:all está em execução.");
    throw error;
  }
}
