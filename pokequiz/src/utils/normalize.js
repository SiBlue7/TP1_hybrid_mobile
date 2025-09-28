export function normalizeName(s) {
  return (s || "")
    .toString()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export function isCorrectAnswer(input, { nameFR, nameEN }) {
  const a = normalizeName(input);
  return a && (a === normalizeName(nameFR) || a === normalizeName(nameEN));
}
