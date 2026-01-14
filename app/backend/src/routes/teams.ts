import { Router } from "express";
import db from "../db";
import {
  createTeam,
  getTeams,
  findTeam,
  addPokemonToTeam,
  removePokemonFromTeam,
} from "../storage/teams";

const router = Router();

router.post("/", (req, res) => {
  const name = String(req.body?.name || "").trim();
  if (!name) return res.status(400).json({ error: "Team name required" });

  const team = createTeam(name);
  res.status(201).json(team);
});

router.get("/", (_req, res) => {
  const teams = getTeams();
  res.json(teams);
});

router.post("/:id/pokemon", (req, res) => {
  const teamId = req.params.id;
  const team = findTeam(teamId);
  if (!team) return res.status(404).json({ error: "Team not found" });

  const pokemonName = String(req.body?.pokemonName || "").trim().toLowerCase();
  if (!pokemonName) return res.status(400).json({ error: "Pokemon name required" });

  if (team.pokemons.includes(pokemonName)) {
    return res.status(409).json({ error: "Pokemon already in team" });
  }

  if (team.pokemons.length >= 6) {
    return res.status(400).json({ error: "Team already has 6 Pokémon" });
  }

  const updated = addPokemonToTeam(teamId, pokemonName);
  res.json(updated);
});

router.delete("/:id/pokemon/:name", (req, res) => {
  const teamId = req.params.id;
  const team = findTeam(teamId);
  if (!team) return res.status(404).json({ error: "Team not found" });

  const name = req.params.name.trim().toLowerCase();
  const updated = removePokemonFromTeam(teamId, name);

  res.json(updated);
});

router.delete("/:id", (req, res) => {
  const teamId = req.params.id;
  const team = findTeam(teamId);
  if (!team) return res.status(404).json({ error: "Team not found" });

  // Delete the team from the database
  const stmt = db.prepare("DELETE FROM teams WHERE id = ?");
  stmt.run(teamId);

  res.status(204).send();
});

export default router;