export async function fetchPokemon(name: string) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
  if (!response.ok) {
    throw new Error("Pokémon not found");
  }
  return response.json();
}
