import { describe, it, expect } from "vitest"
import request from "supertest"
import { createApp } from "../src/app"

describe("Notes API", () => {
  const app = createApp()

  it("creates a note", async () => {
    const res = await request(app)
      .post("/api/notes/pikachu")
      .send({ note: "Strong electric Pokémon" })

    expect(res.status).toBe(200)
  })

  it("updates a note", async () => {
    const res = await request(app)
      .post("/api/notes/pikachu")
      .send({ note: "Updated note" })

    expect(res.status).toBe(200)
  })
  it("returns 404 for missing note", async () => {
  const res = await request(app).get("/api/notes/mewtwo")
  expect(res.status).toBe(404)
})
})