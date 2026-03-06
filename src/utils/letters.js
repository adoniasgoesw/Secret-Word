// Normaliza letra para comparação (remove acentos e ç→c).
export function normalizeLetter(char) {
  if (!char || char.length === 0) return "";
  const c = char.toLowerCase();
  return c.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
