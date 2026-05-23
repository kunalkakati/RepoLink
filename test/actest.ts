import "dotenv/config";
import { getAlltags } from "@/lib/action";

async function testGetAllTags() {
  const tag = await getAlltags();
  tag.map((t) => {
    console.log(t.value);
  });
}

testGetAllTags();
