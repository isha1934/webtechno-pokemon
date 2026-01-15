import { describe, it, expect } from "vitest"
import request from "supertest"
import { createApp } from "../src/app"

describe("Teams API", () => {
  const app = createApp()

  it("creates a team", async () => {
    const res = await request(app)
      .post("/api/teams")
      .send({ name: "My Team" })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty("id")
    expect(res.body.name).toBe("My Team")
  })

  it("fails without name", async () => {
    const res = await request(app).post("/api/teams").send({})

    expect(res.status).toBe(400)
  })
  it("fails when creating a team without name", async () => {
  const res = await request(app)
    .post("/api/teams")
    .send({})

  expect(res.status).toBe(400)
})
it("creates and retrieves a team", async () => {
  const create = await request(app)
    .post("/api/teams")
    .send({ name: "My Team" })

  expect(create.status).toBe(201)

  const list = await request(app).get("/api/teams")
  expect(list.status).toBe(200)
})

})