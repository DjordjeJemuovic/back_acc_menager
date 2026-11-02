// Slova bilo kog jezika (č, ć, š...), razmak, tačka, apostrof, crtica
export function validateName(name) {
  return /^\p{L}[\p{L} .'-]{1,49}$/u.test(name);
}

// Vraća broj ili null ako unos nije ispravan. Prihvata i 12,50 i 12.50
export function parseAmount(text) {
  const clean = text.trim().replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(clean)) return null;
  const value = Number(clean);
  return value > 0 ? value : null;
}