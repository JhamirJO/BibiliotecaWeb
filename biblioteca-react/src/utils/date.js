// src/utils/date.js

// Hoy en YYYY-MM-DD (zona LOCAL)
export function todayYMD() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Evita toISOString() (pasa a UTC y puede "correr" un día)
export function toLocalYMD(v) {
  if (!v) return '';
  let d;
  if (v instanceof Date) d = v;
  else if (typeof v === 'string') d = parseYMD(v);
  else return '';

  if (Number.isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Crea Date en zona LOCAL a partir de YYYY-MM-DD
export function parseYMD(ymd) {
  const [y, m, d] = (ymd || '').split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function isValidYMD(ymd) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return false;
  const d = parseYMD(ymd);
  return !Number.isNaN(d.getTime()) && toLocalYMD(d) === ymd;
}

export function addDaysYMD(ymd, days) {
  const d = parseYMD(ymd);
  d.setDate(d.getDate() + Number(days || 0));
  return toLocalYMD(d);
}
