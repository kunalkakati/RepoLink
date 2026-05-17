"use client";

import { useMemo, useState, type ReactNode } from "react";
import type { Link } from "@/db/schema";

interface TagSearchProps {
  links: Link[];
  children: (
    filteredLinks: Link[],
    selectTag: (tag: string) => void,
  ) => ReactNode;
}

export default function TagSearch({ links, children }: TagSearchProps) {
  const [selectedTag, setSelectedTag] = useState<string>("");

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    links.forEach((link) => {
      if (!link.tag) return;
      link.tag
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
  }, [links]);

  const filteredLinks = useMemo(() => {
    if (!selectedTag) {
      return links;
    }
    return links.filter((link) => {
      if (!link.tag) return false;
      return link.tag
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .includes(selectedTag.toLowerCase());
    });
  }, [links, selectedTag]);

  return (
    <>
      {allTags.length > 0 && (
        <div className="mt-8 rounded-3xl border border-border bg-slate-50/80 p-4 shadow-sm shadow-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-slate-700">
              Filter by tag:
            </span>
            <button
              type="button"
              onClick={() => setSelectedTag("")}
              className={`rounded-full border px-3 py-1 text-sm transition ${selectedTag ? "border-slate-300 bg-white text-slate-600 hover:bg-slate-100" : "border-blue-500 bg-blue-500 text-white hover:bg-blue-600"}`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`rounded-full border px-3 py-1 text-sm transition ${selectedTag === tag ? "border-blue-500 bg-blue-500 text-white hover:bg-blue-600" : "border-slate-300 bg-white text-slate-600 hover:bg-slate-100"}`}
              >
                {tag}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm text-slate-500">
            {selectedTag
              ? `Showing links tagged “${selectedTag}”.`
              : "Showing all saved links."}
          </p>
        </div>
      )}
      {children(filteredLinks, setSelectedTag)}
    </>
  );
}
