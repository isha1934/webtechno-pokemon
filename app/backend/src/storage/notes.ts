import { PokemonNote } from "../models/note";


export type Note = {
  pokemon: string;
  note: string;
  updatedAt: string;
};

export const notes: Record<string, Note> = {};

export function saveNote(pokemon: string, note: string): Note {
  const data = {
    pokemon,
    note,
    updatedAt: new Date().toISOString(),
  };

  notes[pokemon] = data;
  return data;
}

export function deleteNote(pokemon: string): boolean {
  if (!notes[pokemon]) return false;
  delete notes[pokemon];
  return true;
}