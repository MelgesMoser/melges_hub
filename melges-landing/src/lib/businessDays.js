const localDate = (value = new Date()) => {
  const date = value instanceof Date ? new Date(value) : new Date(value);
  date.setHours(12, 0, 0, 0);
  return date;
};

const holidayCache = new Map();

function easterSunday(year) {
  const a = year % 19; const b = Math.floor(year / 100); const c = year % 100; const d = Math.floor(b / 4); const e = b % 4; const f = Math.floor((b + 8) / 25); const g = Math.floor((b - f + 1) / 3); const h = (19 * a + b - d - g + 15) % 30; const i = Math.floor(c / 4); const k = c % 4; const l = (32 + 2 * e + 2 * i - h - k) % 7; const m = Math.floor((a + 11 * h + 22 * l) / 451); const month = Math.floor((h + l - 7 * m + 114) / 31) - 1; const day = (h + l - 7 * m + 114) % 31 + 1;
  return new Date(year, month, day, 12);
}

export function holidayName(value) {
  const date = localDate(value); const year = date.getFullYear(); const fixed = {
    "01-01": "Confraternização Universal", "04-21": "Tiradentes", "05-01": "Dia do Trabalho", "09-07": "Independência do Brasil", "10-12": "Nossa Senhora Aparecida", "11-02": "Finados", "11-15": "Proclamação da República", "11-20": "Consciência Negra", "12-25": "Natal",
  };
  const key = `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const cacheKey = `${year}-${key}`;
  if (holidayCache.has(cacheKey)) return holidayCache.get(cacheKey);
  if (fixed[key]) { holidayCache.set(cacheKey, fixed[key]); return fixed[key]; }
  const easter = easterSunday(year); const movable = [{ offset: -2, name: "Sexta-feira Santa" }, { offset: 60, name: "Corpus Christi" }];
  const name = movable.find(({ offset }) => { const holiday = new Date(easter); holiday.setDate(easter.getDate() + offset); return dateKey(holiday) === dateKey(date); })?.name || "";
  holidayCache.set(cacheKey, name);
  return name;
}

const isBusinessDay = (date) => ![0, 6].includes(date.getDay()) && !holidayName(date);

export function deliveryDate(startDate, businessDays) {
  const date = localDate(startDate);
  // Projetos antigos podem conter um prazo inválido. Sem esse limite, um
  // número muito alto faria a tela de calendário bloquear ao percorrer dias.
  let remaining = Math.min(3650, Math.max(0, Math.floor(Number(businessDays) || 0)));
  while (remaining > 0) {
    date.setDate(date.getDate() + 1);
    if (isBusinessDay(date)) remaining -= 1;
  }
  return date;
}

export function businessDaysLeft(deadline, fromDate = new Date()) {
  const target = localDate(deadline); const cursor = localDate(fromDate);
  if (Number.isNaN(target.getTime()) || Number.isNaN(cursor.getTime())) return 0;
  if (target <= cursor) return target.getTime() === cursor.getTime() ? 0 : -1;
  let total = 0;
  while (cursor < target) {
    cursor.setDate(cursor.getDate() + 1);
    if (isBusinessDay(cursor)) total += 1;
  }
  return total;
}

export function dateKey(value) {
  const date = localDate(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function formatDate(value) {
  return localDate(value).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}
