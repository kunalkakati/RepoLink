'use server'

// db/queries.ts
import db from "@/db/db";
import { links } from "@/db/schema";
import { NewLink } from "@/db/schema";
import { eq } from "drizzle-orm";

// Get all links
export async function getAllLinks() {
    'use catch'
  return await db.select().from(links);
}

// Add a new link
export async function addLink(data: NewLink) {
  return await db.insert(links).values(data).returning();
}

// Delete a link by id
export async function deleteLink(id: string) {
  return await db.delete(links).where(eq(links.id, id)).returning();
}