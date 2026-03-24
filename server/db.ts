import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "../shared/schema";
import path from "path";

// Use Render persistent disk path in production, local file in development
const dbPath = process.env.DB_PATH || path.join(process.cwd(), "nameverse.db");
const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });
