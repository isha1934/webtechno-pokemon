import { useState, useEffect } from "react";import { fetchPokemon } from "./api";
import "./App.css";
import * as Sentry from "@sentry/react";

export default function App() {
  const [query, setQuery] = useState("");
  const [pokemon, setPokemon] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

const handleSearch = async (e: React.FormEvent) => {
  e.preventDefault();

  setError("");
  setPokemon(null);
  setLoading(true);

  // Track search attempt
  Sentry.addBreadcrumb({
    category: "search",
    message: `Search Pokémon: ${query}`,
    level: "info",
  });

  try {
    const data = await fetchPokemon(query.toLowerCase());
    setPokemon(data);
  } catch (err) {
    setError("No Pokémon found. Try another name!");

    // Track error in Sentry
    Sentry.captureException(err, {
      tags: {
        feature: "search",
      },  
      extra: {
        searchedValue: query,
      },
    });
  } finally {
    setLoading(false);
  }
};

  const toggleFavorite = (pokemon: any) => {
    const exists = favorites.find(p => p.id === pokemon.id);

    let updatedFavorites;
    if (exists) {
      updatedFavorites = favorites.filter(p => p.id !== pokemon.id);
    } else {
      updatedFavorites = [...favorites, pokemon];
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="app">
      <h1>Search Pokémon – PokéAPI</h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          placeholder="Search Pokémon (e.g. pikachu)"
          onChange={(e) => setQuery(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {loading && <p style={{ color: "green" }}>LOADING… ⏳</p>}

      {error && (
        <p className="error">{error}</p>
      )}

      {pokemon && (
        <div className="card">
          <h2>{pokemon.name}</h2>
          <img
            src={pokemon.sprites.other["official-artwork"].front_default}
            alt={pokemon.name}
            width={200}
          />
          <button
            onClick={() => toggleFavorite(pokemon)}
            style={{ marginTop: "10px" }}
          >
            {favorites.find(p => p.id === pokemon.id)
              ? "★ Remove from favorites"
              : "☆ Add to favorites"}
          </button>
          <p>Height: {pokemon.height / 10} m</p>
          <p>Weight: {pokemon.weight / 10} kg</p>
          <p>Types: {pokemon.types.map((t: any) => t.type.name).join(", ")}</p>

          {favorites.length > 0 && (
            <div style={{ marginTop: "40px" }}>
              <h3>⭐ Favorites</h3>
              <ul>
                {favorites.map(p => (
                  <li key={p.id}>{p.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

      )}
    </div>
  );
}