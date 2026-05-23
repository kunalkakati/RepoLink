"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import type { TagOption } from "@/options/TagOptions";

type TagForm = {
  value: string;
  label: string;
  color?: string;
};

const defaultForm: TagForm = {
  value: "",
  label: "",
};

const tagColorPalette = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#60a5fa",
  "#7c3aed",
  "#f43f5e",
  "#8b5cf6",
  "#14b8a6",
];

const getRandomColor = () => {
  return tagColorPalette[Math.floor(Math.random() * tagColorPalette.length)];
};

export default function TagsPage() {
  const [tags, setTags] = useState<TagOption[]>([]);
  const [form, setForm] = useState<TagForm>(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<TagForm>({
    ...defaultForm,
    color: "#2563EB",
  });
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadTags = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tags");
      const data = (await response.json()) as TagOption[];
      setTags(
        Array.isArray(data)
          ? data.map((tag) => ({
              id: tag.id,
              value: tag.value,
              label: tag.label || tag.value,
              color: tag.color || "#2563EB",
            }))
          : [],
      );
    } catch (error) {
      console.error("Failed to load tags:", error);
      setStatusMessage("Unable to load tags.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      await loadTags();
    };

    load();
  }, []);

  const showMessage = (message: string) => {
    setStatusMessage(message);
    window.setTimeout(() => setStatusMessage(""), 4000);
  };

  const handleFormChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleEditingChange = (
    key: keyof typeof editingData,
    value: string,
  ) => {
    setEditingData((prev) => ({ ...prev, [key]: value }));
  };

  const createTag = async () => {
    if (!form.value.trim() || !form.label.trim()) {
      showMessage("Please provide both value and label.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          color: getRandomColor(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.error || "Failed to create tag.");
      }

      const created = await response.json();
      setTags((prev) => [created, ...prev]);
      setForm(defaultForm);
      showMessage("Tag created successfully.");
    } catch (error) {
      console.error(error);
      showMessage("Unable to create tag.");
    } finally {
      setIsSaving(false);
    }
  };

  const startEditing = (tag: TagOption) => {
    setEditingId(tag.id ?? null);
    setEditingData({
      value: tag.value,
      label: tag.label ?? tag.value,
      color: tag.color || "#2563EB",
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingData(defaultForm);
  };

  const saveTag = async (id: string) => {
    if (!editingData.value.trim() || !editingData.label.trim()) {
      showMessage("Tag value and label cannot be empty.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/tags/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          value: editingData.value,
          label: editingData.label,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.error || "Failed to save tag.");
      }

      const updatedTag = (await response.json()) as TagOption;
      setTags((prev) =>
        prev.map((tag) => (tag.id === id ? { ...tag, ...updatedTag } : tag)),
      );
      cancelEditing();
      showMessage("Tag updated successfully.");
    } catch (error) {
      console.error(error);
      showMessage("Unable to update tag.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteTag = async (id: string) => {
    if (!window.confirm("Delete this tag?")) return;
    setIsSaving(true);
    try {
      const response = await fetch(`/api/tags/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.error || "Failed to delete tag.");
      }

      setTags((prev) => prev.filter((tag) => tag.id !== id));
      showMessage("Tag deleted successfully.");
    } catch (error) {
      console.error(error);
      showMessage("Unable to delete tag.");
    } finally {
      setIsSaving(false);
    }
  };

  const hasNoTags = tags.length === 0 && !isLoading;

  const tagCountLabel = useMemo(() => {
    if (tags.length === 0) return "No tags created yet.";
    if (tags.length === 1) return "1 tag available.";
    return `${tags.length} tags available.`;
  }, [tags.length]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            Tag Management
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Create, edit, and delete the options used by the tag dropdown in the
            link form.
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          {tagCountLabel}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card className="space-y-6 p-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Create a new tag
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Add a new tag option that will appear in the resource form
              dropdown.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tag-value">Value</Label>
              <Input
                id="tag-value"
                value={form.value}
                onChange={(event) =>
                  handleFormChange("value", event.target.value)
                }
                placeholder="e.g. productivity"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tag-label">Label</Label>
              <Input
                id="tag-label"
                value={form.label}
                onChange={(event) =>
                  handleFormChange("label", event.target.value)
                }
                placeholder="e.g. Productivity"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setForm(defaultForm)}
            >
              Reset
            </Button>
            <Button type="button" onClick={createTag} disabled={isSaving}>
              {isSaving ? "Saving..." : "Create Tag"}
            </Button>
          </div>
        </Card>

        <Card className="space-y-4 p-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Status</h2>
            <p className="mt-2 text-sm text-slate-500">
              Use this panel to review feedback after creating or updating tags.
            </p>
          </div>
          <div className="min-h-[120px] rounded-3xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
            {statusMessage ? (
              <p>{statusMessage}</p>
            ) : (
              <p>Ready to manage your tag options.</p>
            )}
          </div>
        </Card>
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-900">
            Existing tags
          </h2>
          <span className="text-sm text-slate-500">
            {isLoading
              ? "Loading tags..."
              : `${tags.length} item${tags.length === 1 ? "" : "s"}`}
          </span>
        </div>

        {hasNoTags ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
            No tag options have been created yet.
          </div>
        ) : (
          <div className="grid gap-4">
            {tags.map((tag) => {
              const tagId = tag.id;
              const isEditing = tagId !== undefined && tagId === editingId;
              return (
                <Card key={tagId ?? tag.value} className="p-4">
                  <div className="grid gap-4 lg:grid-cols-[minmax(200px,1fr)_minmax(200px,1fr)_120px]">
                    <div className="space-y-2">
                      <Label htmlFor={`value-${tag.id}`}>Value</Label>
                      <Input
                        id={`value-${tag.id}`}
                        value={isEditing ? editingData.value : tag.value}
                        disabled={!isEditing}
                        onChange={(event) =>
                          isEditing &&
                          handleEditingChange("value", event.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`label-${tag.id}`}>Label</Label>
                      <Input
                        id={`label-${tag.id}`}
                        value={
                          isEditing ? editingData.label : tag.label || tag.value
                        }
                        disabled={!isEditing}
                        onChange={(event) =>
                          isEditing &&
                          handleEditingChange("label", event.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Color</Label>
                      <div className="flex items-center gap-3">
                        <span
                          className="inline-block h-8 w-8 rounded-full border"
                          style={{ backgroundColor: tag.color || "#2563EB" }}
                        />
                        <span className="text-sm text-slate-600">
                          {tag.color || "#2563EB"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Button
                      type="button"
                      variant={isEditing ? "secondary" : "outline"}
                      onClick={() =>
                        isEditing ? cancelEditing() : startEditing(tag)
                      }
                    >
                      {isEditing ? "Cancel" : "Edit"}
                    </Button>

                    {isEditing && tagId ? (
                      <Button
                        type="button"
                        onClick={() => saveTag(tagId)}
                        disabled={isSaving}
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </Button>
                    ) : null}

                    {tagId ? (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => deleteTag(tagId)}
                        disabled={isSaving}
                      >
                        Delete
                      </Button>
                    ) : null}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
