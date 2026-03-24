import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Biblical names master table (seeded, not user-created)
export const biblicalNames = sqliteTable("biblical_names", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  pronunciation: text("pronunciation").notNull(),
  meaning: text("meaning").notNull(),
  testament: text("testament").notNull(), // "OT" | "NT"
  gender: text("gender").notNull(), // "male" | "female" | "neutral"
  pack: text("pack").notNull(), // "heroes" | "women" | "kings" | "prophets" | "new_testament" | "all"
  story: text("story").notNull(),
  verse: text("verse").notNull(),
  verseRef: text("verse_ref").notNull(),
});

// User favorites
export const favorites = sqliteTable("favorites", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sessionId: text("session_id").notNull(),
  nameId: integer("name_id").notNull(),
  savedAt: integer("saved_at").notNull(), // unix timestamp
});

// Name generation history
export const history = sqliteTable("history", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sessionId: text("session_id").notNull(),
  nameId: integer("name_id").notNull(),
  generatedAt: integer("generated_at").notNull(),
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({ id: true });
export const insertHistorySchema = createInsertSchema(history).omit({ id: true });

export type BiblicalName = typeof biblicalNames.$inferSelect;
export type Favorite = typeof favorites.$inferSelect;
export type HistoryEntry = typeof history.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type InsertHistory = z.infer<typeof insertHistorySchema>;
