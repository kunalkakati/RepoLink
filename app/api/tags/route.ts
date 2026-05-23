import { NextResponse } from "next/server";
import { getAllTagRows } from "@/lib/action";
import { defaultTagOptions } from "@/options/TagOptions";

export async function GET() {
  try {
    const tags = await getAllTagRows();
    if (!Array.isArray(tags) || tags.length === 0) {
      return NextResponse.json(defaultTagOptions, { status: 200 });
    }
    return NextResponse.json(tags, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    return NextResponse.json(defaultTagOptions, { status: 200 });
  }
}
