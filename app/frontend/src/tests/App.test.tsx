import { describe, it, expect } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import App from "../App"
import { waitFor } from "@testing-library/react"


describe("App UI", () => {

  it("renders the main title", async () => {
    render(<App />)

    const title = await screen.findByText(/Welcome to the Pokémon App/i)
    expect(title).toBeDefined()
  })

  it("renders navigation buttons", async () => {
    render(<App />)

    const createTeamBtn = await screen.findByRole("button", { name: /Create Team/i })
    const compareBtn = await screen.findByRole("button", { name: /Compare Pokémons/i })
    const searchBtn = await screen.findByRole("button", { name: /Search a Pokeman/i })

    expect(createTeamBtn).toBeDefined()
    expect(compareBtn).toBeDefined()
    expect(searchBtn).toBeDefined()
  })

  it("renders the Search button", async () => {
    render(<App />)

    const button = await screen.findByRole("button", { name: /Search a Pokeman/i })
    expect(button).toBeDefined()
  })

  it("displays a pokemon name in Pokémon of the Day", async () => {
    render(<App />)

    const title = await screen.findByText(/Pokémon of the Day:/i)
    expect(title.textContent?.length).toBeGreaterThan(20)
  })


  it("renders the pokemon image", async () => {
    render(<App />)

    const image = await screen.findByRole("img")
    expect(image).toBeDefined()
  })


  it("renders Pokémon of the Day action buttons", async () => {
    render(<App />)

    const favBtn = await screen.findByRole("button", { name: /Add to favorites/i })
    const statsBtn = await screen.findByRole("button", { name: /View Stats/i })

    expect(favBtn).toBeDefined()
    expect(statsBtn).toBeDefined()
  })

})

describe("Create Team page", () => {

  it("renders Create Team title", async () => {
    render(<App />)

    const createBtn = await screen.findByRole("button", { name: /Create Team/i })
    fireEvent.click(createBtn)

    const title = await screen.findByText(/Create Team/i)
    expect(title).toBeDefined()
  })

  it("renders team name and pokemon inputs", async () => {
    render(<App />)

    fireEvent.click(await screen.findByRole("button", { name: /Create Team/i }))

    const teamInput = await screen.findByPlaceholderText(/Team name/i)
    const pokemonInput = await screen.findByPlaceholderText(/Add Pokémon/i)

    expect(teamInput).toBeDefined()
    expect(pokemonInput).toBeDefined()
  })

  it("renders Add button with counter", async () => {
    render(<App />)

    fireEvent.click(await screen.findByRole("button", { name: /Create Team/i }))

    const addBtn = await screen.findByRole("button", { name: /Add \(0\/6\)/i })
    expect(addBtn).toBeDefined()
  })

  it("allows typing in team name input", async () => {
    render(<App />)

    fireEvent.click(await screen.findByRole("button", { name: /Create Team/i }))

    const teamInput = await screen.findByPlaceholderText(/Team name/i)
    fireEvent.change(teamInput, { target: { value: "Fire Squad" } })

    expect((teamInput as HTMLInputElement).value).toBe("Fire Squad")
  })

  it("deletes a saved team when clicking Delete Team", async () => {
    render(<App />)

    fireEvent.click(
      await screen.findByRole("button", { name: /Create Team/i })
    )

    fireEvent.change(
      await screen.findByPlaceholderText(/Team name/i),
      { target: { value: "Fire Squad" } }
    )

    fireEvent.change(
      await screen.findByPlaceholderText(/Add Pokémon/i),
      { target: { value: "pikachu" } }
    )

    fireEvent.click(
      await screen.findByRole("button", { name: /Add/i })
    )

    fireEvent.click(
      await screen.findByRole("button", { name: /Save/i })
    )

    const deleteBtn = await screen.findByRole("button", {
      name: /Delete Team/i,
    })

    fireEvent.click(deleteBtn)


    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: /Delete Team/i })
      ).toBeNull()
    })
  })

})


describe("Compare Pokémon page", () => {

  it("renders Compare Pokémon title", async () => {
    render(<App />)

    fireEvent.click(
      await screen.findByRole("button", { name: /Compare Pokémons/i })
    )

    const title = await screen.findByText(/Compare Pokémons/i)
    expect(title).toBeDefined()
  })

  it("renders first and second pokemon inputs", async () => {
    render(<App />)

    fireEvent.click(
      await screen.findByRole("button", { name: /Compare Pokémons/i })
    )

    const firstInput = await screen.findByPlaceholderText(/e\.g\. pikachu/i)
    const secondInput = await screen.findByPlaceholderText(/e\.g\. charizard/i)

    expect(firstInput).toBeDefined()
    expect(secondInput).toBeDefined()
  })

  it("renders Compare button", async () => {
    render(<App />)

    fireEvent.click(
      await screen.findByRole("button", { name: /Compare Pokémons/i })
    )

    const compareBtn = await screen.findByRole("button", { name: /Compare/i })
    expect(compareBtn).toBeDefined()
  })

  it("allows typing pokemon names in inputs", async () => {
    render(<App />)

    fireEvent.click(
      await screen.findByRole("button", { name: /Compare Pokémons/i })
    )

    const firstInput = await screen.findByPlaceholderText(/e\.g\. pikachu/i)
    const secondInput = await screen.findByPlaceholderText(/e\.g\. charizard/i)

    fireEvent.change(firstInput, { target: { value: "pikachu" } })
    fireEvent.change(secondInput, { target: { value: "charizard" } })

    expect((firstInput as HTMLInputElement).value).toBe("pikachu")
    expect((secondInput as HTMLInputElement).value).toBe("charizard")
  })

})