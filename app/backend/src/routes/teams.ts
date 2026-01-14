import { Router } from "express";
import { createTeam, teams } from "../storage/teams";

const router = Router();

router.post("/", (req, res) => {
  const name = String(req.body?.name || "").trim();
  if (!name) return res.status(400).json({ error: "Team name required" });

  const team = createTeam(name);
  res.status(201).json(team);
});

router.get("/", (_req, res) => {
  res.json(teams);
});

router.post("/:id/pokemon", (req, res) => {
  const team = teams.find((t) => t.id === req.params.id);
  if (!team) return res.status(404).json({ error: "Team not found" });

  const pokemonName = String(req.body?.pokemonName || "").trim().toLowerCase();
  if (!pokemonName) return res.status(400).json({ error: "Pokemon name required" });

  if (team.pokemons.includes(pokemonName)) {
    return res.status(409).json({ error: "Pokemon already in team" });
  }

  if (team.pokemons.length >= 6) {
    return res.status(400).json({ error: "Team already has 6 Pokémon" });
  }

  team.pokemons.push(pokemonName);
  res.json(team);
});

router.delete("/:id/pokemon/:name", (req, res) => {
  const team = teams.find((t) => t.id === req.params.id);
  if (!team) return res.status(404).json({ error: "Team not found" });

  const name = req.params.name.trim().toLowerCase();
  team.pokemons = team.pokemons.filter((p) => p !== name);

  res.json(team);
});

export default router; 