const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

export async function fetchPokemon(name: string) {
  const res = await fetch(`${BACKEND_URL}/api/pokemon/${name}`);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Pokémon not found");
  }

  return res.json();
}