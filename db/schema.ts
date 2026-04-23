// import { uuid } from "drizzle-orm/gel-core";
import { pgTable, uuid, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const links = pgTable("links", {
  // Primary Key
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Your Form Fields
  name: varchar("name", { length: 255 }).notNull(),
  href: text("href").notNull(),
  tag: varchar("tag", { length: 100 }).notNull(),
  description: text("description").notNull(),
  
  // Metadata (Recommended for real apps)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// TypeScript type for selecting and inserting data
export type Link = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;
export type LinkInsertType = Omit<NewLink, "id">;
export type LinkSelectType = Omit<Link, "id">;