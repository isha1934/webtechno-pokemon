import { PokemonNote } from "../models/note";
import db from "../db";

export type Note = {
  pokemon: string;
  note: string;
  updatedAt: string;
};

export function getNote(pokemon: string): Note | undefined {
  const row = db.prepare("SELECT pokemon, note, updatedAt FROM notes WHERE pokemon = ?").get(pokemon);
  if (!row) return undefined;
  return { pokemon: row.pokemon, note: row.note, updatedAt: row.updatedAt };
}

export function saveNote(pokemon: string, note: string): Note {
  const updatedAt = new Date().toISOString();

  db.prepare(
    "INSERT INTO notes (pokemon, note, updatedAt) VALUES (?, ?, ?) ON CONFLICT(pokemon) DO UPDATE SET note=excluded.note, updatedAt=excluded.updatedAt"
  ).run(pokemon, note, updatedAt);

  return { pokemon, note, updatedAt };
}

export function deleteNote(pokemon: string): boolean {
  const result = db.prepare("DELETE FROM notes WHERE pokemon = ?").run(pokemon);
  return result.changes > 0;
}