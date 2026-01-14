import { useState, useEffect, useRef } from "react";
import { fetchPokemon } from "./api";
import "./App.css";
import * as Sentry from "@sentry/react";

type View = "home" | "search" | "create" | "compare" | "favorites" | "pokedex";

// Stat color based on value
const getStatColor = (value: number): string => {
  if (value >= 100) return "#27ae60"; // green
  if (value >= 80) return "#f39c12"; // orange
  if (value >= 60) return "#3498db"; // blue
  return "#e74c3c"; // red
};

function PokemonStatsModal({
  pokemon,
  onClose,
}: {
  pokemon: any;
  onClose: () => void;
}) {
  if (!pokemon) return null;

  const maxStatValue = 150; // max base stat for visual scaling

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          maxWidth: "600px",
          width: "100%",
          maxHeight: "85vh",
          overflowY: "auto",
          padding: "2rem",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "#e74c3c",
            border: "none",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "1.2rem",
          }}
        >
          ✕
        </button>

        <h2 style={{ textTransform: "capitalize", marginBottom: "1.5rem" }}>
          {pokemon.name} - Stats
        </h2>

        {/* Base Stats */}
        {pokemon.stats && pokemon.stats.length > 0 && (
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ marginBottom: "1rem", color: "#2c3e50" }}>Base Stats</h3>
            {pokemon.stats.map((stat: any) => (
              <div key={stat.name} style={{ marginBottom: "0.8rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.3rem",
                    fontSize: "0.9rem",
                  }}
                >
                  <span style={{ fontWeight: "600", textTransform: "capitalize" }}>
                    {stat.name.replace("-", " ")}
                  </span>
                  <span style={{ fontWeight: "bold", color: getStatColor(stat.value) }}>
                    {stat.value}
                  </span>
                </div>
                <div
                  style={{
                    background: "#ecf0f1",
                    borderRadius: "8px",
                    height: "8px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      background: getStatColor(stat.value),
                      height: "100%",
                      width: `${(stat.value / maxStatValue) * 100}%`,
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Abilities */}
        {pokemon.abilities && pokemon.abilities.length > 0 && (
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ marginBottom: "0.8rem", color: "#2c3e50" }}>Abilities</h3>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {pokemon.abilities.map((ability: any) => (
                <span
                  key={ability.name}
                  style={{
                    background: ability.isHidden ? "#f39c12" : "#3498db",
                    color: "white",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "20px",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                  }}
                  title={ability.isHidden ? "Hidden ability" : "Normal ability"}
                >
                  {ability.name} {ability.isHidden ? "(H)" : ""}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Base Experience */}
        {pokemon.baseExperience && (
          <div style={{ marginBottom: "2rem" }}>
            <p style={{ color: "#666" }}>
              <strong>Base Experience:</strong> {pokemon.baseExperience} XP
            </p>
          </div>
        )}

        {/* Moves */}
        {pokemon.moves && pokemon.moves.length > 0 && (
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ marginBottom: "0.8rem", color: "#2c3e50" }}>Moves</h3>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {pokemon.moves.map((move: string) => (
                <span
                  key={move}
                  style={{
                    background: "#ecf0f1",
                    color: "#2c3e50",
                    padding: "0.3rem 0.7rem",
                    borderRadius: "12px",
                    fontSize: "0.8rem",
                    fontWeight: "500",
                  }}
                >
                  {move}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PokemonOfTheDay() {
  const [pokemon, setPokemon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showStats, setShowStats] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      let attempts = 0;
      const maxAttempts = 5;

      while (attempts < maxAttempts) {
        try {
          // pick a random id (1..898, but use common ones like 1-150 for reliability)
          const id = Math.floor(Math.random() * 150) + 1;
          const data = await fetchPokemon(String(id));
          if (!mounted) return;
          setPokemon(data);
          setLoading(false);
          return; // success, exit
        } catch (err: any) {
          attempts++;
          if (attempts >= maxAttempts) {
            setError("Could not load Pokémon of the day. Please refresh.");
            Sentry.captureException(err, { tags: { feature: "potd" } });
            setLoading(false);
          }
        }
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const toggleFavorite = (pokemon: any) => {
    const exists = favorites.find((p) => p.id === pokemon.id);

    let updatedFavorites;
    if (exists) {
      updatedFavorites = favorites.filter((p) => p.id !== pokemon.id);
    } else {
      updatedFavorites = [...favorites, pokemon];
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  if (loading) return <p style={{ color: "#667eea", fontWeight: "bold" }}>Loading Pokémon of the day…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!pokemon) return null;

  const desc = `A ${pokemon.types.join(", ")} type Pokémon. Height: ${pokemon.height / 10} m, Weight: ${pokemon.weight / 10} kg.`;

  return (
    <>
      <div className="potd card">
        <h2>Pokémon of the Day: {pokemon.name}</h2>
        <img src={pokemon.image} alt={pokemon.name} width={180} />
        <p>{desc}</p>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => toggleFavorite(pokemon)}>
            {favorites.find((p) => p.id === pokemon.id) ? "★ Remove from favorites" : "☆ Add to favorites"}
          </button>
          <button onClick={() => setShowStats(true)} style={{ background: "#9b59b6" }}>
            📊 View Stats
          </button>
        </div>
      </div>
      {showStats && <PokemonStatsModal pokemon={pokemon} onClose={() => setShowStats(false)} />}
    </>
  );
}

function Home({ onNavigate }: { onNavigate: (v: View) => void }) {
  return (
    <div className="home">
      <h1>Welcome to the Pokémon App</h1>

      <div style={{ margin: "20px 0" }}>
        <button onClick={() => onNavigate("create")} style={{ marginRight: 8 }}>
          Create Team
        </button>
        <button onClick={() => onNavigate("compare")} style={{ marginRight: 8 }}>
          Compare Pokémons
        </button>
        <button onClick={() => onNavigate("search")} style={{ marginRight: 8 }}>
          Search a Pokeman
        </button>
        <button onClick={() => onNavigate("pokedex")} style={{ marginRight: 8 }}>
          📚 Pokédex
        </button>
        <button onClick={() => onNavigate("favorites")}>
          ⭐ Favorites
        </button>
      </div>

      <PokemonOfTheDay />
    </div>
  );
}

function SearchView({ onBack }: { onBack: () => void }) {
  const [query, setQuery] = useState("");
  const [pokemon, setPokemon] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [showStats, setShowStats] = useState(false);

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
    const exists = favorites.find((p) => p.id === pokemon.id);

    let updatedFavorites;
    if (exists) {
      updatedFavorites = favorites.filter((p) => p.id !== pokemon.id);
    } else {
      updatedFavorites = [...favorites, pokemon];
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <>
      <div className="app">
        <button onClick={onBack} style={{ marginBottom: 12 }}>&larr; Back</button>
        <h1>Search Pokémon</h1>

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

        {error && <p className="error">{error}</p>}

        {pokemon && (
          <div className="card">
            <h2>{pokemon.name}</h2>
            <img src={pokemon.image} alt={pokemon.name} width={200} />
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => toggleFavorite(pokemon)}>
                {favorites.find((p) => p.id === pokemon.id) ? "★ Remove from favorites" : "☆ Add to favorites"}
              </button>
              <button onClick={() => setShowStats(true)} style={{ background: "#9b59b6" }}>
                📊 Stats
              </button>
            </div>
            <p>Height: {pokemon.height / 10} m</p>
            <p>Weight: {pokemon.weight / 10} kg</p>
            <p>Types: {Array.isArray(pokemon.types) ? pokemon.types.join(", ") : ""}</p>
          </div>
        )}
      </div>
      {showStats && pokemon && <PokemonStatsModal pokemon={pokemon} onClose={() => setShowStats(false)} />}
    </>
  );
}

// Component to display a single Pokémon card in a team
function PokemonTeamCard({ pokemonName }: { pokemonName: string }) {
  const [pokemon, setPokemon] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPokemon() {
      try {
        const data = await fetchPokemon(pokemonName);
        setPokemon(data);
      } catch (err) {
        console.error(`Failed to load ${pokemonName}:`, err);
      } finally {
        setLoading(false);
      }
    }
    loadPokemon();
  }, [pokemonName]);

  if (loading) {
    return (
      <div
        style={{
          background: "#f0f0f0",
          borderRadius: "8px",
          padding: "1rem",
          textAlign: "center",
          minHeight: "140px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ fontSize: "0.85rem", color: "#999" }}>Loading...</p>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div
        style={{
          background: "#fff3cd",
          borderRadius: "8px",
          padding: "1rem",
          textAlign: "center",
          minHeight: "140px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ fontSize: "0.85rem", color: "#856404" }}>{pokemonName}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#f9f9f9",
        border: "2px solid #e0e0e0",
        borderRadius: "8px",
        padding: "1rem",
        textAlign: "center",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {pokemon.image && (
        <img
          src={pokemon.image}
          alt={pokemon.name}
          style={{
            width: "80px",
            height: "80px",
            objectFit: "contain",
            marginBottom: "0.5rem",
          }}
        />
      )}
      <p style={{ margin: "0.5rem 0", fontWeight: "bold", fontSize: "0.95rem", textTransform: "capitalize" }}>
        {pokemon.name}
      </p>
    </div>
  );
}

function CreateTeamView({ onBack }: { onBack: () => void }) {
  const [teamName, setTeamName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPokemons, setSelectedPokemons] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load teams on mount
  useEffect(() => {
    async function loadTeams() {
      try {
        const data = await import("./api").then((m) => m.listTeams());
        setTeams(data || []);
      } catch (err) {
        console.error("Failed to load teams:", err);
      }
    }
    loadTeams();
  }, []);

  const handleAddPokemon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (selectedPokemons.length >= 6) {
      setError("Team is full (max 6 Pokémon)");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const pokemon = await fetchPokemon(searchQuery.toLowerCase());
      if (selectedPokemons.find((p) => p.id === pokemon.id)) {
        setError("This Pokémon is already in the team");
        return;
      }
      setSelectedPokemons([...selectedPokemons, pokemon]);
      setSearchQuery("");
    } catch (err) {
      setError("Pokémon not found");
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePokemon = (id: number) => {
    setSelectedPokemons(selectedPokemons.filter((p) => p.id !== id));
  };

  const handleSaveTeam = async () => {
    if (!teamName.trim()) {
      setError("Team name is required");
      return;
    }
    if (selectedPokemons.length === 0) {
      setError("Add at least one Pokémon");
      return;
    }

    try {
      const { createTeam, addPokemonToTeam } = await import("./api");
      const newTeam = await createTeam(teamName);
      
      // Add each pokemon to the team
      let updatedTeam = newTeam;
      for (const pokemon of selectedPokemons) {
        updatedTeam = await addPokemonToTeam(newTeam.id, pokemon.name);
      }

      setTeams([...teams, updatedTeam]);
      setTeamName("");
      setSelectedPokemons([]);
      setError("");
    } catch (err: any) {
      setError("Failed to save team");
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    try {
      const { deleteTeam } = await import("./api");
      await deleteTeam(teamId);
      setTeams(teams.filter((t) => t.id !== teamId));
    } catch (err: any) {
      setError("Failed to delete team");
    }
  };

  return (
    <div className="app">
      <button onClick={onBack} style={{ marginBottom: 12 }}>&larr; Back</button>
      <h1>Create Team</h1>

      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          style={{ marginBottom: "2rem" }}
        >
          <input
            type="text"
            placeholder="Team name (e.g. Fire Squad)"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            style={{ marginBottom: "1rem" }}
          />

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="Add Pokémon (e.g. pikachu)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ maxWidth: "300px" }}
            />
            <button type="button" onClick={handleAddPokemon} disabled={loading || selectedPokemons.length >= 6}>
              {loading ? "Adding…" : `Add (${selectedPokemons.length}/6)`}
            </button>
          </div>
        </form>

        {error && <p className="error">{error}</p>}

        {selectedPokemons.length > 0 && (
          <div className="card" style={{ marginTop: "1.5rem" }}>
            <h3>Selected Pokémon ({selectedPokemons.length}/6)</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              {selectedPokemons.map((p) => (
                <div
                  key={p.id}
                  style={{
                    animation: "slideIn 0.3s ease-out",
                    background: "#f0f0f0",
                    padding: "1rem",
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                >
                  <img src={p.image} alt={p.name} width={80} style={{ marginBottom: "0.5rem" }} />
                  <p style={{ margin: "0.5rem 0", fontWeight: "bold" }}>{p.name}</p>
                  <button
                    onClick={() => handleRemovePokemon(p.id)}
                    style={{
                      background: "#e74c3c",
                      padding: "0.5rem 1rem",
                      fontSize: "0.85rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={handleSaveTeam}
              style={{
                background: "#27ae60",
                marginTop: "1.5rem",
                padding: "1rem 2rem",
                fontSize: "1.1rem",
              }}
            >
              🔒 Save & Lock Team
            </button>
          </div>
        )}
      </div>

      {teams.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Saved Teams</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
              marginTop: "1.5rem",
            }}
          >
            {teams.map((team) => (
              <div key={team.id} className="card" style={{ padding: "1.5rem" }}>
                <h3 style={{ marginBottom: "1rem" }}>{team.name}</h3>
                <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "1rem" }}>
                  Team Size: {team.pokemons.length}/6
                </p>
                
                {/* Pokémon Grid: 3 columns */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "1rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  {team.pokemons.map((pokemonName: string) => (
                    <PokemonTeamCard key={pokemonName} pokemonName={pokemonName} />
                  ))}
                </div>

                <button
                  onClick={() => handleDeleteTeam(team.id)}
                  style={{
                    background: "#e74c3c",
                    padding: "0.7rem 1.5rem",
                    fontSize: "0.95rem",
                    width: "100%",
                    marginTop: "0.5rem",
                  }}
                >
                  🗑️ Delete Team
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FavoritesView({ onBack }: { onBack: () => void }) {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to load favorites:", err);
      }
    }
    setLoading(false);
  }, []);

  const removeFavorite = (pokemonId: number) => {
    const updated = favorites.filter((p) => p.id !== pokemonId);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const clearAllFavorites = () => {
    if (window.confirm("Are you sure you want to clear all favorites?")) {
      setFavorites([]);
      localStorage.setItem("favorites", JSON.stringify([]));
    }
  };

  if (loading) {
    return (
      <div className="app">
        <button onClick={onBack} style={{ marginBottom: 12 }}>&larr; Back</button>
        <h1>⭐ Favorites</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <button onClick={onBack} style={{ marginBottom: 12 }}>&larr; Back</button>
      <h1>⭐ Favorites</h1>

      {favorites.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
          <p style={{ fontSize: "1.1rem", color: "#999" }}>No favorites yet!</p>
          <p style={{ color: "#bbb" }}>Go to Search to add Pokémon to your favorites.</p>
        </div>
      ) : (
        <>
          <p style={{ marginBottom: "1.5rem", color: "#666" }}>
            You have {favorites.length} favorite{favorites.length !== 1 ? "s" : ""}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            {favorites.map((pokemon) => (
              <div
                key={pokemon.id}
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "1.5rem",
                  textAlign: "center",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-5px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 16px rgba(52, 152, 219, 0.2)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.08)";
                }}
              >
                {pokemon.image && (
                  <img
                    src={pokemon.image}
                    alt={pokemon.name}
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "contain",
                      marginBottom: "1rem",
                    }}
                  />
                )}
                <h3 style={{ textTransform: "capitalize", marginBottom: "0.5rem" }}>{pokemon.name}</h3>

                <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "1rem" }}>
                  {pokemon.types.map((type: string) => (
                    <span
                      key={type}
                      style={{
                        background: "#3498db",
                        color: "white",
                        padding: "0.2rem 0.6rem",
                        borderRadius: "12px",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                      }}
                    >
                      {type}
                    </span>
                  ))}
                </div>

                <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "0.5rem" }}>
                  Height: {pokemon.height / 10}m
                </p>
                <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "1rem" }}>
                  Weight: {pokemon.weight / 10}kg
                </p>

                <button
                  onClick={() => removeFavorite(pokemon.id)}
                  style={{
                    background: "#e74c3c",
                    padding: "0.6rem 1rem",
                    fontSize: "0.85rem",
                    width: "100%",
                  }}
                >
                  ✕ Remove
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={clearAllFavorites}
            style={{
              background: "#95a5a6",
              padding: "0.8rem 1.5rem",
              fontSize: "0.95rem",
              display: "block",
              margin: "1rem auto",
            }}
          >
            Clear All Favorites
          </button>
        </>
      )}
    </div>
  );
}

function PokedexView({ onBack }: { onBack: () => void }) {
  const [pokemon, setPokemon] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "height" | "weight">("name");
  const [filterType, setFilterType] = useState<string>("");
  const [showStats, setShowStats] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<any>(null);

  // All Pokémon types for filter
  const allTypes = [
    "normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison",
    "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark",
    "steel", "fairy"
  ];

  useEffect(() => {
    async function loadAllPokemon() {
      setLoading(true);
      const pokemonList: any[] = [];
      
      // Load all 150 Pokémon (IDs 1-150)
      for (let i = 1; i <= 150; i++) {
        try {
          const data = await fetchPokemon(String(i));
          pokemonList.push(data);
          // Add a small delay to avoid overwhelming the API
          if (i % 10 === 0) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        } catch (err) {
          console.error(`Failed to load Pokémon ${i}:`, err);
        }
      }
      
      setPokemon(pokemonList);
      setLoading(false);
    }

    loadAllPokemon();
  }, []);

  // Filter and sort Pokémon
  let filtered = pokemon.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "" || p.types.includes(filterType);
    return matchesSearch && matchesType;
  });

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "height":
        return b.height - a.height;
      case "weight":
        return b.weight - a.weight;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="app" style={{ position: "relative" }}>
      <button onClick={onBack} style={{ marginBottom: 12 }}>&larr; Back</button>
      <h1>📚 Pokédex</h1>

      {/* Filters and Sorting */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {/* Search */}
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
            Search by Name
          </label>
          <input
            type="text"
            placeholder="e.g. pikachu"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%", maxWidth: "none" }}
          />
        </div>

        {/* Type Filter */}
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
            Filter by Type
          </label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              width: "100%",
              maxWidth: "none",
              padding: "0.85rem 1.2rem",
              borderRadius: "8px",
              border: "2px solid #e0e0e0",
              fontSize: "1rem",
              cursor: "pointer",
              background: "white",
              color: "#333",
            }}
          >
            <option value="">All Types</option>
            {allTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
            Sort by
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{
              width: "100%",
              maxWidth: "none",
              padding: "0.85rem 1.2rem",
              borderRadius: "8px",
              border: "2px solid #e0e0e0",
              fontSize: "1rem",
              cursor: "pointer",
              background: "white",
              color: "#333",
            }}
          >
            <option value="name">Name</option>
            <option value="height">Height</option>
            <option value="weight">Weight</option>
          </select>
        </div>
      </div>

      {/* Results Counter */}
      <p style={{ marginBottom: "1rem", color: "#666", fontSize: "0.95rem" }}>
        Showing {filtered.length} of {pokemon.length} Pokémon
      </p>

      {/* Loading State */}
      {loading && (
        <p style={{ color: "#667eea", fontWeight: "bold", textAlign: "center" }}>
          Loading all Pokémon… ⏳ This may take a moment
        </p>
      )}

      {/* Pokémon Grid */}
      {!loading && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: "1rem",
            marginTop: "2rem",
          }}
        >
          {filtered.map((p) => (
            <div
              key={p.id}
              className="card"
              onClick={() => {
                setSelectedPokemon(p);
                setShowStats(true);
              }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "1rem",
                textAlign: "center",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 6px 16px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 2px 8px rgba(0, 0, 0, 0.1)";
              }}
            >
              {/* ID and Image */}
              <div style={{ fontSize: "0.85rem", color: "#999", marginBottom: "0.5rem" }}>
                #{String(p.id).padStart(3, "0")}
              </div>
              {p.image && (
                <img
                  src={p.image}
                  alt={p.name}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "contain",
                    marginBottom: "0.5rem",
                  }}
                />
              )}

              {/* Name */}
              <h3 style={{ textTransform: "capitalize", marginBottom: "0.5rem", fontSize: "0.95rem" }}>
                {p.name}
              </h3>

              {/* Types */}
              <div
                style={{
                  display: "flex",
                  gap: "0.3rem",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  marginBottom: "0.5rem",
                  fontSize: "0.75rem",
                }}
              >
                {p.types.map((type: string) => (
                  <span
                    key={type}
                    style={{
                      background: "#3498db",
                      color: "white",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {type}
                  </span>
                ))}
              </div>

              {/* Stats Summary */}
              <p style={{ fontSize: "0.8rem", color: "#666", margin: "0.3rem 0" }}>
                H: {p.height / 10}m
              </p>
              <p style={{ fontSize: "0.8rem", color: "#666", margin: "0.3rem 0" }}>
                W: {p.weight / 10}kg
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <p style={{ textAlign: "center", color: "#999", marginTop: "2rem" }}>
          No Pokémon found matching your filters.
        </p>
      )}

      {/* Stats Modal */}
      {showStats && selectedPokemon && (
        <PokemonStatsModal pokemon={selectedPokemon} onClose={() => setShowStats(false)} />
      )}
    </div>
  );
}

function ComparePokemonsView({ onBack }: { onBack: () => void }) {
  const [pokemon1Name, setPokemon1Name] = useState("");
  const [pokemon2Name, setPokemon2Name] = useState("");
  const [pokemon1, setPokemon1] = useState<any>(null);
  const [pokemon2, setPokemon2] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const compareContainerRef = useRef<HTMLDivElement>(null);

  // Attach scroll listener to app-root
  useEffect(() => {
    const appRoot = document.querySelector(".app-root") as HTMLElement;
    if (!appRoot) return;

    const handleScroll = () => {
      setShowScrollTop(appRoot.scrollTop > 300);
    };

    appRoot.addEventListener("scroll", handleScroll);
    return () => appRoot.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    const element = document.querySelector(".app-root");
    if (element) {
      element.scrollTop = 0;
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pokemon1Name.trim() || !pokemon2Name.trim()) {
      setError("Please enter names for both Pokémon");
      return;
    }

    setLoading(true);
    setError("");
    setPokemon1(null);
    setPokemon2(null);

    try {
      const [p1, p2] = await Promise.all([
        fetchPokemon(pokemon1Name.toLowerCase()),
        fetchPokemon(pokemon2Name.toLowerCase()),
      ]);
      setPokemon1(p1);
      setPokemon2(p2);
    } catch (err: any) {
      setError("One or both Pokémon not found. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const ComparisonRow = ({
    label,
    value1,
    value2,
  }: {
    label: string;
    value1: any;
    value2: any;
  }) => {
    const isBetter1 = typeof value1 === "number" && typeof value2 === "number" && value1 > value2;
    const isBetter2 = typeof value1 === "number" && typeof value2 === "number" && value2 > value1;

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "1rem",
          padding: "1rem",
          borderBottom: "1px solid #eee",
          alignItems: "center",
        }}
      >
        <div style={{ textAlign: "center", fontWeight: "600", color: "#666" }}>{label}</div>
        <div
          style={{
            textAlign: "center",
            padding: "0.5rem",
            background: isBetter1 ? "#d4edda" : "transparent",
            borderRadius: "6px",
            fontWeight: isBetter1 ? "bold" : "normal",
          }}
        >
          {value1}
        </div>
        <div
          style={{
            textAlign: "center",
            padding: "0.5rem",
            background: isBetter2 ? "#d4edda" : "transparent",
            borderRadius: "6px",
            fontWeight: isBetter2 ? "bold" : "normal",
          }}
        >
          {value2}
        </div>
      </div>
    );
  };

  return (
    <div 
      className="app" 
      style={{ 
        position: "relative"
      }}
      ref={compareContainerRef}
    >
      <button onClick={onBack} style={{ marginBottom: 12 }}>&larr; Back</button>
      <h1>Compare Pokémons</h1>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            background: "#3498db",
            color: "white",
            border: "none",
            padding: "0.8rem 1.5rem",
            borderRadius: "50px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "bold",
            boxShadow: "0 4px 12px rgba(52, 152, 219, 0.4)",
            zIndex: 100,
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.transform = "translateY(-2px)";
            (e.target as HTMLElement).style.boxShadow = "0 6px 16px rgba(52, 152, 219, 0.6)";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.transform = "translateY(0)";
            (e.target as HTMLElement).style.boxShadow = "0 4px 12px rgba(52, 152, 219, 0.4)";
          }}
        >
          ⬆️ Top
        </button>
      )}

      <form
        onSubmit={handleSearch}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr auto",
          gap: "1rem",
          marginBottom: "2rem",
          alignItems: "flex-end",
        }}
      >
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
            First Pokémon
          </label>
          <input
            type="text"
            placeholder="e.g. pikachu"
            value={pokemon1Name}
            onChange={(e) => setPokemon1Name(e.target.value)}
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
            Second Pokémon
          </label>
          <input
            type="text"
            placeholder="e.g. charizard"
            value={pokemon2Name}
            onChange={(e) => setPokemon2Name(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: "0.7rem 1.5rem" }}>
          {loading ? "Searching…" : "Compare"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {pokemon1 && pokemon2 && (
        <div style={{ marginTop: "2rem" }}>
          {/* Header with Images */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2rem",
              marginBottom: "2rem",
            }}
          >
            {/* Pokémon 1 */}
            <div
              style={{
                background: "#f9f9f9",
                borderRadius: "12px",
                padding: "2rem",
                textAlign: "center",
                border: "2px solid #3498db",
              }}
            >
              {pokemon1.image && (
                <img
                  src={pokemon1.image}
                  alt={pokemon1.name}
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "contain",
                    marginBottom: "1rem",
                  }}
                />
              )}
              <h2 style={{ textTransform: "capitalize", marginBottom: "0.5rem" }}>{pokemon1.name}</h2>
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  marginBottom: "1rem",
                }}
              >
                {pokemon1.types.map((type: string) => (
                  <span
                    key={type}
                    style={{
                      background: "#3498db",
                      color: "white",
                      padding: "0.3rem 0.8rem",
                      borderRadius: "20px",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                    }}
                  >
                    {type}
                  </span>
                ))}
              </div>
              <p style={{ color: "#666", fontSize: "0.95rem" }}>Height: {pokemon1.height}m</p>
              <p style={{ color: "#666", fontSize: "0.95rem", marginBottom: "1rem" }}>Weight: {pokemon1.weight}kg</p>
            </div>

            {/* Pokémon 2 */}
            <div
              style={{
                background: "#f9f9f9",
                borderRadius: "12px",
                padding: "2rem",
                textAlign: "center",
                border: "2px solid #e74c3c",
              }}
            >
              {pokemon2.image && (
                <img
                  src={pokemon2.image}
                  alt={pokemon2.name}
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "contain",
                    marginBottom: "1rem",
                  }}
                />
              )}
              <h2 style={{ textTransform: "capitalize", marginBottom: "0.5rem" }}>{pokemon2.name}</h2>
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  marginBottom: "1rem",
                }}
              >
                {pokemon2.types.map((type: string) => (
                  <span
                    key={type}
                    style={{
                      background: "#e74c3c",
                      color: "white",
                      padding: "0.3rem 0.8rem",
                      borderRadius: "20px",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                    }}
                  >
                    {type}
                  </span>
                ))}
              </div>
              <p style={{ color: "#666", fontSize: "0.95rem" }}>Height: {pokemon2.height}m</p>
              <p style={{ color: "#666", fontSize: "0.95rem", marginBottom: "1rem" }}>Weight: {pokemon2.weight}kg</p>
            </div>
          </div>

          {/* Comparison Table */}
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              border: "1px solid #eee",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "1rem",
                padding: "1.5rem",
                background: "#2c3e50",
                color: "white",
                fontWeight: "bold",
              }}
            >
              <div style={{ textAlign: "center" }}>Attribute</div>
              <div style={{ textAlign: "center" }}>{pokemon1.name}</div>
              <div style={{ textAlign: "center" }}>{pokemon2.name}</div>
            </div>

            <ComparisonRow label="Height (m)" value1={pokemon1.height} value2={pokemon2.height} />
            <ComparisonRow label="Weight (kg)" value1={pokemon1.weight} value2={pokemon2.weight} />
            <ComparisonRow
              label="Type Count"
              value1={pokemon1.types.length}
              value2={pokemon2.types.length}
            />

            {/* Type comparison */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "1rem",
                padding: "1rem",
                borderBottom: "1px solid #eee",
                alignItems: "center",
              }}
            >
              <div style={{ textAlign: "center", fontWeight: "600", color: "#666" }}>Types</div>
              <div style={{ textAlign: "center" }}>
                {pokemon1.types.map((t: string) => (
                  <span
                    key={t}
                    style={{
                      display: "inline-block",
                      background: "#3498db",
                      color: "white",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "12px",
                      fontSize: "0.8rem",
                      marginRight: "0.3rem",
                      marginBottom: "0.3rem",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div style={{ textAlign: "center" }}>
                {pokemon2.types.map((t: string) => (
                  <span
                    key={t}
                    style={{
                      display: "inline-block",
                      background: "#e74c3c",
                      color: "white",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "12px",
                      fontSize: "0.8rem",
                      marginRight: "0.3rem",
                      marginBottom: "0.3rem",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Base Stats Comparison */}
            {pokemon1.stats && pokemon2.stats && (
              <>
                <div style={{ padding: "1rem", background: "#f9f9f9", fontWeight: "600", color: "#2c3e50" }}>
                  Base Stats
                </div>
                {pokemon1.stats.map((stat1: any) => {
                  const stat2 = pokemon2.stats.find((s: any) => s.name === stat1.name);
                  return (
                    <ComparisonRow
                      key={stat1.name}
                      label={stat1.name.replace("-", " ")}
                      value1={stat1.value}
                      value2={stat2?.value || 0}
                    />
                  );
                })}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<View>("home");

  return (
    <div className="app-root">
      {view === "home" && <Home onNavigate={(v) => setView(v)} />}
      {view === "search" && <SearchView onBack={() => setView("home")} />}
      {view === "create" && <CreateTeamView onBack={() => setView("home")} />}
      {view === "compare" && <ComparePokemonsView onBack={() => setView("home")} />}
      {view === "favorites" && <FavoritesView onBack={() => setView("home")} />}
      {view === "pokedex" && <PokedexView onBack={() => setView("home")} />}
    </div>
  );
}