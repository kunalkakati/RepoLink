import { NextResponse } from "next/server";
import { deleteTagById, updateTagById } from "@/lib/action";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const updatedTag = await updateTagById(id, {
      value: typeof body?.value === "string" ? body.value.trim() : undefined,
      label: typeof body?.label === "string" ? body.label.trim() : undefined,
      color: typeof body?.color === "string" ? body.color.trim() : undefined,
    });

    if (!updatedTag) {
      return NextResponse.json({ error: "Tag not found." }, { status: 404 });
    }

    return NextResponse.json(updatedTag, { status: 200 });
  } catch (error) {
    console.error("Failed to update tag:", error);
    return NextResponse.json(
      { error: "Unable to update tag." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    await deleteTagById(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete tag:", error);
    return NextResponse.json(
      { error: "Unable to delete tag." },
      { status: 500 },
    );
  }
}
