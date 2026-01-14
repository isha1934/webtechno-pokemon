import { Router } from "express";
import { deleteNote, notes , saveNote } from "../storage/notes";

const router = Router();

// POST /api/notes/:pokemon  
router.post("/:pokemon", (req, res) => {
  const pokemon = req.params.pokemon.trim().toLowerCase();
  const note = String(req.body?.note || "").trim();

  if (!note) return res.status(400).json({ error: "Note required" });

  notes[pokemon] = {
    pokemon,
    note,
    updatedAt: new Date().toISOString(),
  };

  return res.json(notes[pokemon]);
});

// GET /api/notes/:pokemon
router.get("/:pokemon", (req, res) => {
  const pokemon = req.params.pokemon.trim().toLowerCase();
  const found = notes[pokemon];

  if (!found) return res.status(404).json({ error: "No note found" });

  return res.json(found);
});
// GET /api/notes/:pokemon

router.delete("/:pokemon", (req, res) => {
  const pokemon = req.params.pokemon.toLowerCase();

  const deleted = deleteNote(pokemon);
  if (!deleted) {
    return res.status(404).json({ error: "Note not found" });
  }

  res.json({ message: "Note deleted" });
});

export default router;