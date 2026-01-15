import { describe, it, expect } from "vitest"
import request from "supertest"
import { createApp } from "../src/app"

describe("Pokemon API", () => {
  const app = createApp()

  it("returns data for pikachu", async () => {
    const res = await request(app).get("/api/pokemon/pikachu")

    expect(res.status).toBe(200)
    expect(res.body.name).toBe("pikachu")
    expect(res.body).toHaveProperty("types")
  })

  it("returns 404 for unknown pokemon", async () => {
    const res = await request(app).get("/api/pokemon/xyz123")

    expect(res.status).toBe(404)
  })
  it("returns 400 when pokemon name is missing", async () => {
  const res = await request(app).get("/api/pokemon/")
  expect(res.status).toBe(404)
})
it("handles uppercase pokemon names", async () => {
  const res = await request(app).get("/api/pokemon/PIKACHU")
  expect(res.status).toBe(200)
  expect(res.body.name).toBe("pikachu")
})

})