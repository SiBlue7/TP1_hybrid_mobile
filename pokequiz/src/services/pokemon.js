const BASE = "https://tyradex.app/api/v1";

export function randomIds(count = 10, min = 1, max = 1025) {
  const set = new Set();
  while (set.size < count)
    set.add(Math.floor(Math.random() * (max - min + 1)) + min);
  return [...set];
}

export async function getPokemonById(id) {
  const res = await fetch(`${BASE}/pokemon/${id}`, {
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "CordovaVueQuiz/1.0 (contact: you@example.com)",
    },
  });
  if (!res.ok) throw new Error(`Tyradex error ${res.status}`);
  const data = await res.json();

  const img =
    data?.sprites?.regular ??
    data?.image?.regular ??
    data?.sprites?.default ??
    null;

  return {
    id: data?.pokedex_id ?? id,
    nameFR: data?.name?.fr ?? data?.name ?? "",
    nameEN: data?.name?.en ?? "",
    image: img,
  };
}
