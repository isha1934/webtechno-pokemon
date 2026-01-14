import { Router } from "express";
import { getPokemonByName } from "../services/pokeapi";

const router = Router();

router.get("/:name", async (req, res) => {
  try {
    const data = await getPokemonByName(req.params.name);

    res.json({
      id: data.id,
      name: data.name,
      height: data.height,
      weight: data.weight,
      types: data.types.map((t: any) => t.type.name),
      image: data.sprites.other["official-artwork"].front_default,
      stats: data.stats.map((s: any) => ({
        name: s.stat.name,
        value: s.base_stat,
      })),
      abilities: data.abilities.map((a: any) => ({
        name: a.ability.name,
        isHidden: a.is_hidden,
      })),
      moves: data.moves.slice(0, 8).map((m: any) => m.move.name),
      baseExperience: data.base_experience,
    });
  } catch (err: any) {
    res
      .status(err.statusCode || 500)
      .json({ error: err.message || "Server error" });
  }
});

export default router;