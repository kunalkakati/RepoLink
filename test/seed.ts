// import { drizzle } from "drizzle-orm/neon-http";
// import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import db from "@/db/db";
import { tags } from "@/db/schema"; // Adjust path to your schema

// Setup connection
// const sql = neon(process.env.DATABASE_URL!);
// const db = drizzle(sql);

async function seed() {
  console.log("Seeding tags...");

  const data = [
    { value: "react", label: "React", color: "#61DAFB" },
    { value: "typescript", label: "TypeScript", color: "#3178C6" },
    { value: "node", label: "Node.js", color: "#339933" },
  ];

  await db.insert(tags).values(data);

  console.log("Seeding complete!");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });
