import { pgTable, uuid, varchar, text, jsonb, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	password: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 255 }).default('Kunal'),
});

export const links = pgTable("links", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	href: text().notNull(),
	tag: jsonb().default([]).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});
