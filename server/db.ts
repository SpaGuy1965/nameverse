import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "../shared/schema";
import path from "path";

// Use Render persistent disk path in production, local file in development
const dbPath = process.env.DB_PATH || path.join(process.cwd(), "nameverse.db");
const sqlite = new Database(dbPath);

// Create tables if they don't exist (runs on every startup, safe to re-run)
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS biblical_names (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    pronunciation TEXT NOT NULL,
    meaning TEXT NOT NULL,
    testament TEXT NOT NULL,
    gender TEXT NOT NULL,
    pack TEXT NOT NULL,
    story TEXT NOT NULL,
    verse TEXT NOT NULL,
    verse_ref TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    name_id INTEGER NOT NULL,
    saved_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    name_id INTEGER NOT NULL,
    generated_at INTEGER NOT NULL
  );
`);

export const db = drizzle(sqlite, { schema });
