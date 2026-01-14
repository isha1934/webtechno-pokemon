import express from "express";
import cors from "cors";
import pokemonRouter from "./routes/pokemon";
import teamsRouter from "./routes/teams";
import notesRouter from "./routes/notes";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/pokemon", pokemonRouter);
  app.use("/api/teams", teamsRouter);
  app.use("/api/notes", notesRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: "Route not found" });
  });

  return app;
}