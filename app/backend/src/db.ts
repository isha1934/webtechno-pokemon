import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DATA_DIR = path.resolve(__dirname, "../../data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const DB_PATH = path.join(DATA_DIR, "db.sqlite");

const db = new Database(DB_PATH);

// Migrations: create tables if they don't exist
db.exec(`
CREATE TABLE IF NOT EXISTS teams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  pokemons TEXT DEFAULT '[]',
  createdAt TEXT NOT NULL
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS notes (
  pokemon TEXT PRIMARY KEY,
  note TEXT,
  updatedAt TEXT
);
`);

export default db;
