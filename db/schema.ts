// import { uuid } from "drizzle-orm/gel-core";
// import { Password } from "@hugeicons/core-free-icons";
import {
  pgTable,
  uuid,
  text,
  jsonb,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

export const links = pgTable("links", {
  // Primary Key
  id: uuid("id").primaryKey().defaultRandom(),

  // Your Form Fields
  name: varchar("name", { length: 255 }).notNull(),
  href: text("href").notNull(),
  tag: jsonb("tag").notNull(),

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

export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  value: varchar("value", { length: 255 }).notNull(),
  label: varchar("label", { length: 255 }).notNull(),
  color: varchar("color", { length: 100 }),
});

// TypeScript types for the new table
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;

// TypeScript type for selecting and inserting data
export type Link = Omit<typeof links.$inferSelect, "tag"> & {
  tag: string[];
};
export type NewLink = typeof links.$inferInsert;
export type LinkInsertType = Omit<NewLink, "id"> & {
  tag: string | string[];
};
export type LinkSelectType = Omit<Link, "id">;
