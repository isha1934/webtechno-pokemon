const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

async function request(path: string, options?: RequestInit) {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    let body: any = null;
    try {
      body = await res.json();
    } catch (_) {
      /* ignore */
    }
    const message = (body && (body.error || body.message)) || res.statusText;
    throw new Error(message || `Request failed: ${res.status}`);
  }

  if (res.status === 204) return undefined;
  return res.json();
}

export type PokemonSummary = {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: string[];
  image?: string;
  stats?: Array<{ name: string; value: number }>;
  abilities?: Array<{ name: string; isHidden: boolean }>;
  moves?: string[];
  baseExperience?: number;
};

export function fetchPokemon(name: string): Promise<PokemonSummary> {
  return request(`/api/pokemon/${encodeURIComponent(name)}`) as Promise<PokemonSummary>;
}

export type Team = {
  id: string;
  name: string;
  pokemons: string[];
  createdAt: string;
};

export function createTeam(name: string): Promise<Team> {
  return request("/api/teams", {
    method: "POST",
    body: JSON.stringify({ name }),
  }) as Promise<Team>;
}

export function listTeams(): Promise<Team[]> {
  return request("/api/teams") as Promise<Team[]>;
}

export function addPokemonToTeam(teamId: string, pokemonName: string): Promise<Team> {
  return request(`/api/teams/${encodeURIComponent(teamId)}/pokemon`, {
    method: "POST",
    body: JSON.stringify({ pokemonName }),
  }) as Promise<Team>;
}

export function deleteTeam(teamId: string): Promise<void> {
  return request(`/api/teams/${encodeURIComponent(teamId)}`, { method: "DELETE" }) as Promise<void>;
}

export type Note = { pokemon: string; note: string; updatedAt: string };

export function saveNote(pokemon: string, note: string): Promise<Note> {
  return request(`/api/notes/${encodeURIComponent(pokemon)}`, {
    method: "POST",
    body: JSON.stringify({ note }),
  }) as Promise<Note>;
}

export function getNote(pokemon: string): Promise<Note> {
  return request(`/api/notes/${encodeURIComponent(pokemon)}`) as Promise<Note>;
}

export function deleteNote(pokemon: string): Promise<void> {
  return request(`/api/notes/${encodeURIComponent(pokemon)}`, { method: "DELETE" }) as Promise<void>;
}