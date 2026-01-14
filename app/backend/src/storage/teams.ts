import { randomUUID } from "crypto";
import { PokemonTeam } from "../models/teams";


export const teams: PokemonTeam[] = [];

export function createTeam(name: string): PokemonTeam {
  const team: PokemonTeam = {
    id: randomUUID(),
    name,
    pokemons: [],
    createdAt: new Date().toISOString(),
  };

  teams.push(team);
  return team;
}