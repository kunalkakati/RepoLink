"use client";

import { useMemo, useState, type ReactNode } from "react";
import type { Link } from "@/db/schema";
import { normalizeTags } from "@/lib/utils";

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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [matchMode, setMatchMode] = useState<"any" | "all">("any");
  const [tagQuery, setTagQuery] = useState("");

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    links.forEach((link) => {
      normalizeTags(link.tag).forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
  }, [links]);

  const filteredTagOptions = useMemo(() => {
    const query = tagQuery.trim().toLowerCase();
    if (!query) return allTags;
    return allTags.filter((tag) => tag.toLowerCase().includes(query));
  }, [allTags, tagQuery]);

  const filteredLinks = useMemo(() => {
    if (selectedTags.length === 0) {
      return links;
    }

    return links.filter((link) => {
      if (!link.tag) return false;
      const tags = normalizeTags(link.tag)
        .map((tag) => tag.toLowerCase())
        .filter(Boolean);

      if (matchMode === "all") {
        return selectedTags.every((selected) =>
          tags.includes(selected.toLowerCase()),
        );
      }

      return selectedTags.some((selected) =>
        tags.includes(selected.toLowerCase()),
      );
    });
  }, [links, selectedTags, matchMode]);

  const toggleSelectedTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((value) => value !== tag)
        : [...prev, tag],
    );
  };

  return (
    <>
      {allTags.length > 0 && (
        <div className="mt-8 rounded-3xl border border-border bg-slate-50/80 p-4 shadow-sm shadow-slate-100">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-slate-700">
                Filter by tag:
              </span>
              <button
                type="button"
                onClick={() => setSelectedTags([])}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${selectedTags.length > 0 ? "bg-white text-slate-700 hover:bg-slate-100" : "bg-slate-900 text-white hover:bg-slate-800"}`}
              >
                All
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <input
                value={tagQuery}
                onChange={(e) => setTagQuery(e.target.value)}
                placeholder="Search tags"
                className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 outline-none transition focus:border-slate-500"
              />
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 shadow-sm">
                <button
                  type="button"
                  onClick={() => setMatchMode("any")}
                  className={`rounded-full px-3 py-1 transition ${matchMode === "any" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  Any
                </button>
                <button
                  type="button"
                  onClick={() => setMatchMode("all")}
                  className={`rounded-full px-3 py-1 transition ${matchMode === "all" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  All
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {filteredTagOptions.length > 0 ? (
              filteredTagOptions.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleSelectedTag(tag)}
                    className={`rounded-full border border-slate-200 px-3 py-1.5 text-sm font-semibold transition shadow-sm ${isSelected ? "bg-slate-900 text-white shadow-blue-200/60 hover:bg-slate-800" : `${getTagVariant(tag)} hover:scale-[1.02] hover:shadow-sm`}`}
                  >
                    {tag}
                  </button>
                );
              })
            ) : (
              <span className="text-sm text-slate-500">
                No tag matches for {tagQuery}.
              </span>
            )}
          </div>

          <p className="mt-3 text-sm text-slate-500">
            {selectedTags.length > 0
              ? `Showing links matching ${matchMode === "all" ? "all" : "any"} of: ${selectedTags.join(", ")}.`
              : "Showing all saved links."}
          </p>
        </div>
      )}
      {children(filteredLinks, toggleSelectedTag)}
    </>
  );
}
