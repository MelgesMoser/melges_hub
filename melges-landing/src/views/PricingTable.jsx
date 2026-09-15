import { useEffect, useState } from "react";
import { request } from "../lib/api.js";

const identifier = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
const cleanTable = (table) => ({ columns: table.columns || [], rows: table.rows || [] });

export default function PricingTable() {
  const [table, setTable] = useState({ columns: [], rows: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    request("/admin/pricing").then((value) => setTable(cleanTable(value))).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, []);

  const updateColumn = (id, label) => setTable((current) => ({ ...current, columns: current.columns.map((column) => column.id === id ? { ...column, label } : column) }));
  const updateRowLabel = (id, label) => setTable((current) => ({ ...current, rows: current.rows.map((row) => row.id === id ? { ...row, label } : row) }));
  const updateCell = (rowId, columnId, value) => setTable((current) => ({ ...current, rows: current.rows.map((row) => row.id === rowId ? { ...row, values: { ...row.values, [columnId]: value } } : row) }));
  const addColumn = () => setTable((current) => ({ ...current, columns: [...current.columns, { id: identifier("column"), label: "Novo plano" }] }));
  const removeColumn = (id) => setTable((current) => current.columns.length < 2 ? current : ({ ...current, columns: current.columns.filter((column) => column.id !== id), rows: current.rows.map((row) => { const values = { ...row.values }; delete values[id]; return { ...row, values }; }) }));
  const addRow = () => setTable((current) => ({ ...current, rows: [...current.rows, { id: identifier("service"), label: "Nova funcionalidade", values: {} }] }));
  const removeRow = (id) => setTable((current) => ({ ...current, rows: current.rows.filter((row) => row.id !== id) }));
  const save = async () => { setError(""); setMessage(""); setSaving(true); try { const saved = await request("/admin/pricing", { method: "PUT", body: JSON.stringify(table) }); setTable(cleanTable(saved)); setMessage("Tabela de valores salva com segurança."); } catch (err) { setError(err.message); } finally { setSaving(false); } };

  if (loading) return <section className="container-page py-12 sm:py-16"><p className="text-white/55">Carregando tabela de valores...</p></section>;
  return <section className="container-page py-12 sm:py-16">
    <span className="eyebrow">Administração · Financeiro</span>
    <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
      <div><h1 className="text-3xl font-bold sm:text-4xl">Tabela de valores</h1><p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/50">Gerencie funcionalidades, planos e valores. Apenas administradores podem alterar estes dados.</p></div>
      <button type="button" onClick={save} disabled={saving} className="btn-primary">{saving ? "Salvando..." : "Salvar tabela"}</button>
    </div>
    {error && <p className="mt-5 rounded-2xl border border-red-400/25 bg-red-400/10 p-4 text-sm text-red-200">{error}</p>}
    {message && <p className="mt-5 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 p-4 text-sm text-emerald-200">{message}</p>}
    <section className="mt-8 overflow-hidden rounded-[2rem] border border-violet/25 bg-[linear-gradient(135deg,rgba(139,62,245,.14),rgba(255,255,255,.025))]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4 sm:px-6">
        <div><h2 className="font-bold">Editor de precificação</h2><p className="mt-1 text-sm text-white/45">Edite os títulos diretamente na tabela. Você pode adicionar ou remover linhas e colunas.</p></div>
        <div className="flex flex-wrap gap-2"><button type="button" onClick={addRow} className="btn-outline px-4 py-2 text-xs">+ Linha</button><button type="button" onClick={addColumn} className="btn-outline px-4 py-2 text-xs">+ Coluna</button></div>
      </div>
      <div className="overflow-x-auto p-3 sm:p-5">
        <table className="min-w-[760px] w-full border-separate border-spacing-0 text-left"><thead><tr>
          {table.columns.map((column, index) => <th key={column.id} className="border-b border-white/10 bg-black/20 p-3 align-top"><div className="flex gap-2"><input aria-label="Título da coluna" value={column.label} onChange={(event) => updateColumn(column.id, event.target.value)} maxLength="80" className="min-w-0 flex-1 bg-transparent text-sm font-bold text-white outline-none placeholder:text-white/30 focus:text-violet-light" />{index > 0 && <button type="button" title="Remover coluna" onClick={() => removeColumn(column.id)} className="grid h-6 w-6 place-items-center rounded-md text-white/35 hover:bg-red-400/10 hover:text-red-300">×</button>}</div></th>)}
          <th className="w-12 border-b border-white/10 bg-black/20" />
        </tr></thead><tbody>
          {table.rows.map((row) => <tr key={row.id}><td className="border-b border-white/10 p-3"><input aria-label="Nome da funcionalidade" value={row.label} onChange={(event) => updateRowLabel(row.id, event.target.value)} maxLength="120" className="w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-white/30 focus:text-violet-light" /></td>{table.columns.slice(1).map((column) => <td key={column.id} className="border-b border-white/10 p-2"><input aria-label={`${row.label}: ${column.label}`} value={row.values?.[column.id] || ""} onChange={(event) => updateCell(row.id, column.id, event.target.value)} maxLength="80" placeholder="R$ 0,00" className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-violet" /></td>)}<td className="border-b border-white/10 p-2 text-center"><button type="button" title="Remover linha" onClick={() => removeRow(row.id)} className="grid h-8 w-8 place-items-center rounded-lg text-white/35 hover:bg-red-400/10 hover:text-red-300">×</button></td></tr>)}
        </tbody></table>
        {!table.rows.length && <p className="px-3 py-10 text-center text-sm text-white/45">Ainda não há funcionalidades. Use “+ Linha” para criar a primeira.</p>}
      </div>
    </section>
  </section>;
}
