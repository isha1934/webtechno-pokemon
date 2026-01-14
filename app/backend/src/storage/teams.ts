import { randomUUID } from "crypto";
import { PokemonTeam } from "../models/teams";
import db from "../db";

export function getTeams(): PokemonTeam[] {
  const rows = db.prepare("SELECT id, name, pokemons, createdAt FROM teams ORDER BY createdAt DESC").all();
  return rows.map((r: any) => ({
    id: r.id,
    name: r.name,
    pokemons: JSON.parse(r.pokemons || "[]"),
    createdAt: r.createdAt,
  }));
}

export function findTeam(id: string): PokemonTeam | undefined {
  const row = db.prepare("SELECT id, name, pokemons, createdAt FROM teams WHERE id = ?").get(id);
  if (!row) return undefined;
  return {
    id: row.id,
    name: row.name,
    pokemons: JSON.parse(row.pokemons || "[]"),
    createdAt: row.createdAt,
  };
}

export function createTeam(name: string): PokemonTeam {
  const team: PokemonTeam = {
    id: randomUUID(),
    name,
    pokemons: [],
    createdAt: new Date().toISOString(),
  };

  db.prepare("INSERT INTO teams (id, name, pokemons, createdAt) VALUES (?, ?, ?, ?)").run(
    team.id,
    team.name,
    JSON.stringify(team.pokemons),
    team.createdAt
  );

  return team;
}

export function addPokemonToTeam(teamId: string, pokemonName: string): PokemonTeam | null {
  const team = findTeam(teamId);
  if (!team) return null;

  if (team.pokemons.includes(pokemonName)) return team;
  if (team.pokemons.length >= 6) return team;

  team.pokemons.push(pokemonName);
  db.prepare("UPDATE teams SET pokemons = ? WHERE id = ?").run(JSON.stringify(team.pokemons), team.id);
  return team;
}

export function removePokemonFromTeam(teamId: string, pokemonName: string): PokemonTeam | null {
  const team = findTeam(teamId);
  if (!team) return null;

  team.pokemons = team.pokemons.filter((p) => p !== pokemonName);
  db.prepare("UPDATE teams SET pokemons = ? WHERE id = ?").run(JSON.stringify(team.pokemons), team.id);
  return team;
}