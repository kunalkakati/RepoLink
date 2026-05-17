"use client";

import { useMemo, useState, type ReactNode } from "react";
import type { Link } from "@/db/schema";

const tagColorVariants = [
  "bg-sky-100 text-sky-800",
  "bg-emerald-100 text-emerald-800",
  "bg-violet-100 text-violet-800",
  "bg-fuchsia-100 text-fuchsia-800",
  "bg-amber-100 text-amber-800",
  "bg-rose-100 text-rose-800",
  "bg-lime-100 text-lime-800",
];

const getTagVariant = (tag: string) => {
  const index = Array.from(tag || "").reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0,
  );
  return tagColorVariants[index % tagColorVariants.length];
};

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
              className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${selectedTag ? "bg-white text-slate-700 hover:bg-slate-100" : "bg-slate-900 text-white hover:bg-slate-800"}`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`rounded-full border border-slate-200 px-3 py-1.5 text-sm font-semibold transition shadow-sm ${selectedTag === tag ? `bg-slate-900 text-white shadow-blue-200/60 hover:bg-slate-800` : `${getTagVariant(tag)} hover:scale-[1.02] hover:shadow-sm`}`}
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
