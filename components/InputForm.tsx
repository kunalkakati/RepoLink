"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Link2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { LinkInsertType } from "@/db/schema";
import { useLinkStore } from "@/store/LinkStore";
import { normalizeTags } from "@/lib/utils";
import { defaultTagOptions, type TagOption } from "@/options/TagOptions";

// const predefinedTags = [
//   "docs",
//   "tool",
//   "library",
//   "platform",
//   "tutorial",
//   "resource",
//   "design",
//   "react",
//   "ui",
// ];
const predefinedStaticTags = defaultTagOptions;

const palette = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#60a5fa",
  "#7c3aed",
  "#f43f5e",
];

const colorFor = (tag: string, options: TagOption[]) => {
  const found = options.find(
    (t) => t.value.toLowerCase() === tag.toLowerCase(),
  );
  if (found?.color) return found.color;
  // deterministic pick from palette based on hash
  let h = 0;
  for (let i = 0; i < tag.length; i++) h = (h << 5) - h + tag.charCodeAt(i);
  const idx = Math.abs(h) % palette.length;
  return palette[idx];
};

export default function App() {
  const { addLink } = useLinkStore();
  const [formData, setFormData] = useState<Omit<LinkInsertType, "tag">>({
    name: "",
    href: "",
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [dbTagOptions, setDbTagOptions] = useState<TagOption[]>([]);
  const [tagLoading, setTagLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((value) => value !== tag)
        : [...prev, tag],
    );
  };

  const findTagOption = (value: string) =>
    dbTagOptions.find((t) => t.value.toLowerCase() === value.toLowerCase()) ||
    defaultTagOptions.find(
      (t) => t.value.toLowerCase() === value.toLowerCase(),
    );

  const optionsToShow =
    dbTagOptions.length > 0 ? dbTagOptions : predefinedStaticTags;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomTag(e.target.value);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setTagDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/tags", { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load tag options");
        return res.json();
      })
      .then((data: TagOption[]) => {
        if (Array.isArray(data)) {
          setDbTagOptions(
            data.map((tag) => ({
              id: tag.id,
              value: tag.value,
              label: tag.label || tag.value,
              color: tag.color || "",
            })),
          );
        }
      })
      .catch((error) => {
        console.error("Error loading tags:", error);
      })
      .finally(() => setTagLoading(false));

    return () => controller.abort();
  }, []);

  const addCustomTag = () => {
    const tagsToAdd = normalizeTags(customTag);
    if (tagsToAdd.length === 0) return;
    setSelectedTags((prev) => Array.from(new Set([...prev, ...tagsToAdd])));
    setCustomTag("");
  };

  const handleCustomKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustomTag();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    addLink({
      ...formData,
      tag: normalizeTags([...selectedTags, ...normalizeTags(customTag)]),
    });

    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);

    setFormData({ name: "", href: "" });
    setSelectedTags([]);
    setCustomTag("");
  };

  return (
    <div>
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <Card className="w-full max-w-lg rounded-[28px] p-6 sm:p-8">
          <div className="flex flex-col space-y-1.5 pb-6">
            <h3 className="font-semibold leading-none tracking-tight text-xl flex flex-col gap-2 sm:flex-row sm:items-center">
              <Link2 className="w-5 h-5 text-slate-500" />
              Add New Resource
            </h3>
            <p className="text-sm text-slate-500">
              Enter the details below to save a new link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="e.g., Next.js Documentation"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            {/* Href / Link Field */}
            <div className="space-y-2">
              <Label htmlFor="href">
                Link (URL) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="href"
                name="href"
                type="url"
                required
                placeholder="https://nextjs.org/docs"
                value={formData.href}
                onChange={handleInputChange}
              />
            </div>

            {/* Tag Field */}
            <div className="space-y-2">
              <Label htmlFor="tag">Tags</Label>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setTagDropdownOpen((prev) => !prev)}
                  className="flex h-12 w-full items-center justify-between rounded-2xl border border-slate-300 bg-white px-4 py-3 text-left text-sm text-slate-900 shadow-sm transition hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  aria-expanded={tagDropdownOpen}
                >
                  <span>
                    {selectedTags.length > 0
                      ? selectedTags.join(", ")
                      : "Select tags"}
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                </button>

                {tagDropdownOpen && (
                  <div className="absolute left-0 top-full z-20 mt-2 w-full overflow-visible rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/50">
                    <div className="max-h-56 overflow-y-auto p-2">
                      {optionsToShow.map((opt) => {
                        const tag = opt.value;
                        const isSelected = selectedTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleTag(tag)}
                            className={`flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left text-sm transition ${isSelected ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"}`}
                          >
                            <span className="flex items-center gap-3">
                              <span
                                className="inline-block h-3 w-3 rounded-full"
                                style={{ backgroundColor: opt.color }}
                              />
                              <span>{opt.label ?? opt.value}</span>
                            </span>
                            {isSelected && (
                              <span className="text-xs uppercase tracking-[0.24em] text-slate-300">
                                Selected
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  id="customTag"
                  name="customTag"
                  placeholder="Add a custom tag and press Enter"
                  value={customTag}
                  onChange={handleCustomTagChange}
                  onKeyDown={handleCustomKeyDown}
                />
                <Button type="button" onClick={addCustomTag}>
                  Add
                </Button>
              </div>
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1 text-sm text-slate-700 transition hover:bg-slate-100"
                    >
                      <span
                        className="inline-block h-3 w-3 rounded-full"
                        style={{
                          backgroundColor: colorFor(tag, optionsToShow),
                        }}
                      />
                      <span>{tag}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button type="submit" className="w-full">
                {isSubmitted ? "Saved Successfully!" : "Save Link"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
