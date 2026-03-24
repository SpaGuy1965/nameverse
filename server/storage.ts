import { db } from "./db";
import { biblicalNames, favorites, history } from "../shared/schema";
import { eq, and, desc } from "drizzle-orm";
import type { BiblicalName, Favorite, HistoryEntry, InsertFavorite, InsertHistory } from "../shared/schema";
import { namesData } from "./names-data";

export interface IStorage {
  // Names
  getAllNames(): BiblicalName[];
  getNameById(id: number): BiblicalName | undefined;
  getNamesByPack(pack: string): BiblicalName[];
  getRandomName(pack?: string): BiblicalName | undefined;
  seedNamesIfEmpty(): void;

  // Favorites
  getFavorites(sessionId: string): (Favorite & { name: BiblicalName })[];
  addFavorite(data: InsertFavorite): Favorite;
  removeFavorite(sessionId: string, nameId: number): void;
  isFavorite(sessionId: string, nameId: number): boolean;

  // History
  getHistory(sessionId: string): (HistoryEntry & { name: BiblicalName })[];
  addHistory(data: InsertHistory): HistoryEntry;
}

export class DatabaseStorage implements IStorage {
  seedNamesIfEmpty() {
    const existing = db.select().from(biblicalNames).get();
    if (!existing) {
      for (const name of namesData) {
        db.insert(biblicalNames).values(name).run();
      }
    }
  }

  getAllNames(): BiblicalName[] {
    return db.select().from(biblicalNames).all();
  }

  getNameById(id: number): BiblicalName | undefined {
    return db.select().from(biblicalNames).where(eq(biblicalNames.id, id)).get();
  }

  getNamesByPack(pack: string): BiblicalName[] {
    if (pack === "all") return this.getAllNames();
    return db.select().from(biblicalNames).where(eq(biblicalNames.pack, pack)).all();
  }

  getRandomName(pack?: string): BiblicalName | undefined {
    const names = pack && pack !== "all" ? this.getNamesByPack(pack) : this.getAllNames();
    if (names.length === 0) return undefined;
    return names[Math.floor(Math.random() * names.length)];
  }

  getFavorites(sessionId: string): (Favorite & { name: BiblicalName })[] {
    const favs = db.select().from(favorites).where(eq(favorites.sessionId, sessionId)).orderBy(desc(favorites.savedAt)).all();
    return favs.map(f => {
      const name = this.getNameById(f.nameId)!;
      return { ...f, name };
    });
  }

  addFavorite(data: InsertFavorite): Favorite {
    return db.insert(favorites).values(data).returning().get();
  }

  removeFavorite(sessionId: string, nameId: number): void {
    db.delete(favorites).where(and(eq(favorites.sessionId, sessionId), eq(favorites.nameId, nameId))).run();
  }

  isFavorite(sessionId: string, nameId: number): boolean {
    const fav = db.select().from(favorites).where(and(eq(favorites.sessionId, sessionId), eq(favorites.nameId, nameId))).get();
    return !!fav;
  }

  getHistory(sessionId: string): (HistoryEntry & { name: BiblicalName })[] {
    const entries = db.select().from(history).where(eq(history.sessionId, sessionId)).orderBy(desc(history.generatedAt)).all();
    return entries.slice(0, 20).map(e => {
      const name = this.getNameById(e.nameId)!;
      return { ...e, name };
    });
  }

  addHistory(data: InsertHistory): HistoryEntry {
    return db.insert(history).values(data).returning().get();
  }
}

export const storage = new DatabaseStorage();
