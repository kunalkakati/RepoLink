"use server";

// db/queries.ts
import "dotenv/config";
import db from "@/db/db";
import { links, User, NewUser, tags } from "@/db/schema";
import { NewLink } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { normalizeTags } from "@/lib/utils";
import { hashPassword, comparePasswords } from "@/lib/auth-utils";

// Get all links
export const getAllLinks = async () => {
  "use cache";
  try {
    const allLinks = await db
      .select()
      .from(links)
      .orderBy(desc(links.createdAt));
    return allLinks.map((link) => ({
      ...link,
      tag: normalizeTags(link.tag),
    }));
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch links");
  }
};

// getting all tags for filter from link payloads
export const getAllTags = async () => {
  "use cache";
  try {
    const allLinks = await db.select().from(links);
    const tagsSet = new Set<string>();
    allLinks.forEach((link) => {
      normalizeTags(link.tag).forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch tags");
  }
};

// Fetch tag rows from the dedicated tags table.
export const getAllTagRows = async () => {
  "use cache";
  try {
    return await db.select().from(tags).orderBy(tags.value);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch tag options");
  }
};

// get links by tag
export const searchByTag = async (tag: string) => {
  "use cache";
  try {
    return await db
      .select()
      .from(links)
      .where(sql`tag @> ${JSON.stringify([tag])}::jsonb`);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to search links by tag");
  }
};

// Add a new link
export async function addLink(data: NewLink) {
  try {
    const [newLink] = await db.insert(links).values(data).returning();
    return [
      {
        ...newLink,
        tag: normalizeTags(newLink.tag),
      },
    ];
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

export async function registerUser(password: string) {
  // 1. Hash the password
  const hashedPassword = await hashPassword(password);
  const insert: NewUser = {
    Password: hashedPassword,
  };
  // 2. Save to database
  try {
    await db.insert(User).values(insert).returning();
  } catch (error) {
    console.log(error);
    throw new Error("Failed to register");
  }
}

export async function loginUser(key: string) {
  const user = await db
    .select()
    .from(User)
    .where(eq(User.name, "Kunal"))
    .limit(1);

  if (!user) return { error: "Invalid credentials" };

  // Compare the provided password with the stored hash
  const isMatch = await comparePasswords(key, user[0].Password);

  if (!isMatch) {
    return { error: "Invalid credentials" };
  }
  return isMatch;
}

export async function getAlltags() {
  try {
    const allTags = await db.select().from(tags);
    console.log(allTags);
    return allTags;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch tags");
  }
}
// Proceed with session creation/JWT
