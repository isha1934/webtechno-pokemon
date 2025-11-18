import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import App from "../App"

describe("App UI", () => {

  it("renders the main title", () => {
    render(<App />)
    expect(screen.getByText(/Hello World/i)).toBeDefined()
  })

  it("renders the search input", () => {
    render(<App />)
    const input = screen.getByPlaceholderText(/Search Pokémon/i)
    expect(input).toBeDefined()
  })

  it("renders the Search button", () => {
    render(<App />)
    const button = screen.getByRole("button", { name: /search/i })
    expect(button).toBeDefined()
  })

})