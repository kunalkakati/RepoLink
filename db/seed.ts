import db from "./db";
import { links } from "./schema";
import { seedLinks } from "./dummyFata";

async function main() {
    try {
        await db.insert(links).values(seedLinks);
    } catch (error) {
        console.log(error);
        
    }
  console.log("Seeded successfully.");
}

main().catch(console.error);