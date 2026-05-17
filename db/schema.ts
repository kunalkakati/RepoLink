// import { uuid } from "drizzle-orm/gel-core";
import { Password } from "@hugeicons/core-free-icons";
import { pgTable, uuid, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const links = pgTable("links", {
  // Primary Key
  id: uuid("id").primaryKey().defaultRandom(),

  // Your Form Fields
  name: varchar("name", { length: 255 }).notNull(),
  href: text("href").notNull(),
  tag: varchar("tag", { length: 100 }).notNull(),

  // Metadata (Recommended for real apps)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const User = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  Password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).default("Kunal"),
});
export type User = typeof User.$inferSelect;
export type NewUser = typeof User.$inferInsert;

// TypeScript type for selecting and inserting data
export type Link = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;
export type LinkInsertType = Omit<NewLink, "id">;
export type LinkSelectType = Omit<Link, "id">;
