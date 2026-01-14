import { Router } from "express";
import { saveNote, getNote, deleteNote } from "../storage/notes";

const router = Router();

// POST /api/notes/:pokemon  
router.post("/:pokemon", (req, res) => {
  const pokemon = req.params.pokemon.trim().toLowerCase();
  const note = String(req.body?.note || "").trim();

  if (!note) return res.status(400).json({ error: "Note required" });

  const saved = saveNote(pokemon, note);

  return res.json(saved);
});

// GET /api/notes/:pokemon
router.get("/:pokemon", (req, res) => {
  const pokemon = req.params.pokemon.trim().toLowerCase();
  const found = getNote(pokemon);

  if (!found) return res.status(404).json({ error: "No note found" });

  return res.json(found);
});

router.delete("/:pokemon", (req, res) => {
  const pokemon = req.params.pokemon.toLowerCase();

  const deleted = deleteNote(pokemon);
  if (!deleted) {
    return res.status(404).json({ error: "Note not found" });
  }

  res.json({ message: "Note deleted" });
});

export default router;