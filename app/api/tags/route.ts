import { NextResponse } from "next/server";
import { getAllTagRows } from "@/lib/action";

export async function GET() {
  try {
    const tags = await getAllTagRows();
    return NextResponse.json(Array.isArray(tags) ? tags : [], { status: 200 });
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    return NextResponse.json([], { status: 200 });
  }
}
