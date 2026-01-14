import { describe, it, expect } from "vitest"
import { fetchPokemon } from "../api"

describe("fetchPokemon()", () => {
  it("is a function", () => {
    expect(typeof fetchPokemon).toBe("function")
  })

  it("throws an error for invalid Pokémon", async () => {
    await expect(fetchPokemon("xyz123")).rejects.toThrow()
  })
})