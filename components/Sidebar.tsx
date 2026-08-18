"use client";

import { useMemo, useState } from "react";
import type { Link as LinkType } from "@/db/schema";
import { normalizeTags } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const tagColorVariants = [
  "bg-sky-600 text-sky-100",
  "bg-emerald-600 text-emerald-100",
  "bg-cyan-600 text-cyan-100",
  "bg-amber-600 text-amber-100",
  "bg-rose-600 text-rose-100",
  "bg-lime-600 text-lime-100",
  "bg-indigo-600 text-indigo-100",
  "bg-orange-600 text-orange-100",
];

const getTagVariant = (tag: string) => {
  const index = Array.from(tag || "").reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0,
  );
  return tagColorVariants[index % tagColorVariants.length];
};

interface SidebarProps {
  links: LinkType[];
  selectedTags: string[];
  onTagChange: (tags: string[]) => void;
  matchMode: "any" | "all";
  onMatchModeChange: (mode: "any" | "all") => void;
  tagQuery: string;
  onTagQueryChange: (query: string) => void;
}

export default function Sidebar({
  links,
  selectedTags,
  onTagChange,
  matchMode,
  onMatchModeChange,
  tagQuery,
  onTagQueryChange,
}: SidebarProps) {
  const [tagsExpanded, setTagsExpanded] = useState(true);

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

  const toggleSelectedTag = (tag: string) => {
    onTagChange(
      selectedTags.includes(tag)
        ? selectedTags.filter((value) => value !== tag)
        : [...selectedTags, tag],
    );
  };

  return (
    <aside className="w-full md:w-80 shrink-0 bg-slate-950/50 border-r border-white/10 overflow-y-auto no-scrollbar">
      <div className="p-4 space-y-6">
        {/* Tags Section */}
        {allTags.length > 0 && (
          <div className="rounded-lg border border-white/10 bg-slate-900/30 p-4">
            <button
              onClick={() => setTagsExpanded(!tagsExpanded)}
              className="w-full flex items-center justify-between mb-4"
            >
              <h3 className="text-sm font-semibold text-slate-200">Tags</h3>
              <ChevronDown
                size={16}
                className={`transition-transform ${tagsExpanded ? "rotate-180" : ""}`}
              />
            </button>

            {tagsExpanded && (
              <div className="space-y-3">
                {/* Tag Search */}
                <input
                  value={tagQuery}
                  onChange={(e) => onTagQueryChange(e.target.value)}
                  placeholder="Search tags"
                  className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-blue-400/40 focus:ring-1 focus:ring-blue-500/20"
                />

                {/* All Button */}
                <button
                  type="button"
                  onClick={() => onTagChange([])}
                  className={`w-full rounded-lg px-3 py-2 text-sm font-semibold transition text-left ${selectedTags.length > 0 ? "bg-slate-800/50 text-slate-100 hover:bg-slate-700/50" : "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"}`}
                >
                  All Tags
                </button>

                {/* Match Mode */}
                <div className="flex gap-2 border-t border-white/5 pt-3">
                  <button
                    type="button"
                    onClick={() => onMatchModeChange("any")}
                    className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-semibold transition ${matchMode === "any" ? "bg-blue-500 text-slate-950" : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"}`}
                  >
                    Any
                  </button>
                  <button
                    type="button"
                    onClick={() => onMatchModeChange("all")}
                    className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-semibold transition ${matchMode === "all" ? "bg-blue-500 text-slate-950" : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"}`}
                  >
                    All
                  </button>
                </div>

                {/* Tags List */}
                <div className="flex flex-wrap gap-2 max-h-96 overflow-y-auto no-scrollbar">
                  {filteredTagOptions.length > 0 ? (
                    filteredTagOptions.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleSelectedTag(tag)}
                          className={`rounded-full px-2.5 py-1 text-xs font-medium transition whitespace-nowrap ${isSelected ? "bg-blue-500 text-slate-950 shadow-blue-500/30" : `${getTagVariant(tag).replace("text-", "text-")} bg-slate-800/30 hover:bg-slate-700/50`}`}
                        >
                          {tag}
                        </button>
                      );
                    })
                  ) : (
                    <span className="text-xs text-slate-400 px-2 py-1 block">
                      No tags found
                    </span>
                  )}
                </div>

                {selectedTags.length > 0 && (
                  <p className="text-xs text-slate-400 border-t border-white/5 pt-2 mt-2">
                    {`Filtering by ${matchMode === "all" ? "all" : "any"}: ${selectedTags.join(", ")}`}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="rounded-lg border border-white/10 bg-slate-900/30 p-4 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Total Links:</span>
            <span className="font-semibold text-slate-200">{links.length}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Total Tags:</span>
            <span className="font-semibold text-slate-200">
              {allTags.length}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
