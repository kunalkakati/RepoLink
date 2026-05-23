import { NextResponse } from "next/server";
import { createTag, getAllTagRows } from "@/lib/action";

export async function GET() {
  try {
    const tags = await getAllTagRows();
    return NextResponse.json(Array.isArray(tags) ? tags : [], { status: 200 });
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const value = String(body?.value || "").trim();
    const label = String(body?.label || "").trim();
    const color =
      typeof body?.color === "string" ? body.color.trim() : undefined;

    if (!value || !label) {
      return NextResponse.json(
        { error: "Tag value and label are required." },
        { status: 400 },
      );
    }

    const newTag = await createTag({ value, label, color });
    return NextResponse.json(newTag, { status: 201 });
  } catch (error) {
    console.error("Failed to create tag:", error);
    return NextResponse.json(
      { error: "Unable to create tag." },
      { status: 500 },
    );
  }
}
