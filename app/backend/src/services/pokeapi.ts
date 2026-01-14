const BASE_URL =
  process.env.POKEAPI_BASE_URL || "https://pokeapi.co/api/v2";

export async function getPokemonByName(name: string) {
  const clean = name.trim().toLowerCase();

  if (!clean) {
    const err = new Error("Missing pokemon name");
    (err as any).statusCode = 400;
    throw err;
  }

  const response = await fetch(`${BASE_URL}/pokemon/${clean}`);

  if (!response.ok) {
    const err = new Error("Pokémon not found");
    (err as any).statusCode = 404;
    throw err;
  }

  return response.json();
}