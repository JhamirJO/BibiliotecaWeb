// src/utils/formatAutor.js
export function formatAutor(autor) {
  if (!autor) return "-";

  const partes = String(autor)
    .split(";")
    .map((p) => p.trim())
    .filter(Boolean);

  if (partes.length === 0) return "-";
  if (partes.length === 1) return partes[0];

  return `${partes[0]} et al.`;
}
