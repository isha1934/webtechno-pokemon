import { useState } from "react";
import { fetchPokemon } from "./api";
import "./App.css";

function ErrorButton() {
  return (
    <button
      onClick={() => {
        throw new Error("This is your first Sentry error!");
      }}
      style={{
        padding: "10px 20px",
        backgroundColor: "red",
        color: "white",
        borderRadius: "8px",
        marginTop: "20px",
        cursor: "pointer",
      }}
    >
      Break the world
    </button>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [pokemon, setPokemon] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPokemon(null);

    try {
      const data = await fetchPokemon(query);
      setPokemon(data);
    } catch (err) {
      setError("No Pokémon found. Try another name!");
    }
  };

  return (
    <div className="app">
      <h1>Hello World – PokéAPI</h1>
      <ErrorButton />

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search Pokémon (e.g. pikachu)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {error && <p className="error">{error}</p>}

      {pokemon && (
        <div className="card">
          <h2>{pokemon.name}</h2>
          <img
            src={pokemon.sprites.other["official-artwork"].front_default}
            alt={pokemon.name}
            width={200}
          />
          <p>Height: {pokemon.height / 10} m</p>
          <p>Weight: {pokemon.weight / 10} kg</p>
          <p>
            Types:{" "}
            {pokemon.types.map((t: any) => t.type.name).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
