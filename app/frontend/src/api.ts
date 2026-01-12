export async function fetchPokemon(name: string) {
  await new Promise(res => setTimeout(res, 1200));

  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
  );

  if (!response.ok) throw new Error("Pokémon not found");

  return response.json();
}