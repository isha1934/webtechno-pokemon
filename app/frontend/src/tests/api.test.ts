import { describe, it, expect } from "vitest"
import { fetchPokemon } from "../api"

describe("fetchPokemon()", () => {
  it("has the correct API endpoint", () => {
  const name = "pikachu"
  const expectedUrl = `https://pokeapi.co/api/v2/pokemon/${name}`
  expect(expectedUrl).toContain(name)
})

  it("throws an error for invalid Pokémon", async () => {
    await expect(fetchPokemon("xyz123")).rejects.toThrow()
  })
})