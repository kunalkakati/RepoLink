"use server";

// db/queries.ts
import db from "@/db/db";
import { links, User, NewUser } from "@/db/schema";
import { NewLink } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { hashPassword, comparePasswords } from "@/lib/auth-utils";

// Get all links
export const getAllLinks = async () => {
  "use cache";
  try {
    return await db.select().from(links).orderBy(desc(links.createdAt));
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch links");
  }
};

export const getAllTags = async () => {
  "use cache";
  try {
    const allLinks = await db.select().from(links);
    const tagsSet = new Set<string>();
    allLinks.forEach((link) => {
      tagsSet.add(link.tag);
    });
    return Array.from(tagsSet);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch tags");
  }
};

// Add a new link
export async function addLink(data: NewLink) {
  try {
    const [newLink] = await db.insert(links).values(data).returning();
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
// Proceed with session creation/JWT
