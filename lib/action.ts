'use server'

// db/queries.ts
import db from "@/db/db";
import { links } from "@/db/schema";
import { NewLink } from "@/db/schema";
import { eq } from "drizzle-orm";



// Get all links
export const getAllLinks= async() => {
    'use cache'
    try {
        return await db.select().from(links);
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch links");
    }
};

// Add a new link
export async function addLink(data: NewLink) {
    try {
        const [newLink] =  await db.insert(links).values(data).returning();
        return [newLink];
    } catch (error) {
        console.log(error);
        throw new Error("Failed to add links");
    }
}

// Delete a link by id
export async function deleteLink(id: string) {
    try {
        return await db.delete(links).where(eq(links.id, id)).returning();
    } catch (error) {
         console.log(error);
        throw new Error("Failed to add links");
    }
}