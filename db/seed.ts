import db from "./db";
import { links } from "./schema";
// import { seedLinks } from "./dummyFata";
// import useAuthStore from "@/store/AuthStore";
import {registerUser} from "@/lib/action";



async function main() {
    
    try {
        await registerUser("1209");
        console.log("Seeded successfully.");
    } catch (error) {
        console.log(error);
    }
}

main().catch(console.error);