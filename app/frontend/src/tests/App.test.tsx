import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import App from "../App"

describe("App UI", () => {

  it("renders the main title", () => {
    render(<App />)
    expect(screen.getByText(/Welcome to the Pokémon App/i)).toBeDefined()
  })

  it("renders navigation buttons", () => {
    render(<App />)  
    const createTeamBtn = screen.getByRole("button", { name: /Create Team/i })
    const compareBtn = screen.getByRole("button", { name: /Compare Pokémons/i })
    const searchBtn = screen.getByRole("button", { name: /Search a Pokeman/i })
    expect(createTeamBtn).toBeDefined()
    expect(compareBtn).toBeDefined()
    expect(searchBtn).toBeDefined()
  })

  it("renders the Search button", () => {
    render(<App />)
    const button = screen.getByRole("button", { name: /Search a Pokeman/i })
    expect(button).toBeDefined()
  })

})