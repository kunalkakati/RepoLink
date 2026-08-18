"use client";

import LinkCard from "@/components/LinkCard";
import Sidebar from "./Sidebar";
import type { Link as LinkType } from "@/db/schema";
import { useLinkStore } from "@/store/LinkStore";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  X as XIcon,
  Menu,
  Grid3x3,
  Filter,
  Settings,
} from "lucide-react";
import NoLink from "./NoLink";
import useAuthStore from "@/store/AuthStore";
import AuthForm from "./AuthForm";
import IntroPage from "./IntroPage";
import { MainPageSkeleton } from "./Skeleton";
import { normalizeTags } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 30;

const Home = () => {
  const { isAuthenticated } = useAuthStore();
  const { links, fetchLinks, isLoading } = useLinkStore();
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "az" | "za">(
    "newest",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [nameQuery, setNameQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [matchMode, setMatchMode] = useState<"any" | "all">("any");
  const [tagQuery, setTagQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<"links" | "filters" | "settings">(
    "links",
  );

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const sortedAndFilteredLinks = useMemo(() => {
    // Start with all links
    let results = links;

    // Filter by selected tags
    if (selectedTags.length > 0) {
      results = results.filter((link) => {
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
    }

    // Filter by name query
    const nq = nameQuery.trim().toLowerCase();
    if (nq) {
      results = results.filter((link) =>
        String(link.name || "")
          .toLowerCase()
          .includes(nq),
      );
    }

    // Sort
    const copy = [...results];
    switch (sortOrder) {
      case "newest":
        return copy.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      case "oldest":
        return copy.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
      case "az":
        return copy.sort((a, b) => a.name.localeCompare(b.name));
      case "za":
        return copy.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return copy;
    }
  }, [links, sortOrder, selectedTags, matchMode, nameQuery]);

  // Helper functions for mobile view
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
    setSelectedTags(
      selectedTags.includes(tag)
        ? selectedTags.filter((value) => value !== tag)
        : [...selectedTags, tag],
    );
  };

  if (isLoading) {
    return (
      <div>
        {isAuthenticated ? (
          <div className="flex h-screen flex-col md:flex-row">
            <div className="w-full md:w-80 shrink-0 bg-slate-950/50 border-r border-white/10" />
            <div className="flex-1">
              <MainPageSkeleton />
            </div>
          </div>
        ) : (
          <AuthForm />
        )}
      </div>
    );
  }

  const totalPages = Math.ceil(sortedAndFilteredLinks.length / ITEMS_PER_PAGE);
  const validPage = Math.max(
    1,
    Math.min(currentPage, totalPages > 0 ? totalPages : 1),
  );

  const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
  const paginatedLinks = sortedAndFilteredLinks.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const paginationControls = totalPages > 1 && (
    <div className="flex items-center justify-center gap-4">
      <Button
        variant="outline"
        onClick={() => {
          setCurrentPage((p) => Math.max(1, p - 1));
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        disabled={validPage === 1}
      >
        Previous
      </Button>
      <span className="text-sm font-medium text-muted-foreground">
        Page {validPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        onClick={() => {
          setCurrentPage((p) => Math.min(totalPages, p + 1));
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        disabled={validPage === totalPages}
      >
        Next
      </Button>
    </div>
  );

  return (
    <div>
      {isAuthenticated ? (
        <>
          {/* Desktop Layout */}
          <div className="hidden md:flex h-screen flex-row">
            {/* Mobile Sidebar Backdrop */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 z-40 bg-black/50 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Sidebar */}
            <div
              className={`fixed inset-y-0 left-0 z-50 md:static md:inset-auto transition-transform duration-300 ${
                sidebarOpen
                  ? "translate-x-0"
                  : "-translate-x-full md:translate-x-0"
              }`}
            >
              <Sidebar
                links={links}
                selectedTags={selectedTags}
                onTagChange={(tags) => {
                  setSelectedTags(tags);
                  setSidebarOpen(false);
                }}
                matchMode={matchMode}
                onMatchModeChange={setMatchMode}
                tagQuery={tagQuery}
                onTagQueryChange={setTagQuery}
              />
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
              <div className="flex-1">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
                  <IntroPage />
                  <div className="mb-6 mt-5">
                    <div className="glass-panel p-6 sm:p-7">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="inline-flex items-center rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-300">
                            Your library
                          </div>
                          <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-50">
                            Saved Links
                          </h1>
                          <p className="mt-1 text-sm text-slate-400">
                            Showing {sortedAndFilteredLinks.length}{" "}
                            {sortedAndFilteredLinks.length === 1
                              ? "link"
                              : "links"}
                            {selectedTags.length > 0
                              ? ` matching ${selectedTags.join(", ")}`
                              : " from the database"}
                            .
                          </p>
                        </div>

                        <div className="flex flex-col gap-3 w-full md:flex-row md:items-center md:gap-3 md:w-auto">
                          <div className="relative flex-1 md:flex-none">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                              <Search size={16} />
                            </span>
                            <input
                              aria-label="Search links by name"
                              value={nameQuery}
                              onChange={(e) => {
                                setNameQuery(e.target.value);
                                setCurrentPage(1);
                              }}
                              placeholder="Search by name"
                              className="w-full rounded-full border border-white/10 bg-slate-900/70 px-10 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-blue-400/40 focus:ring-2 focus:ring-blue-500/20"
                            />
                            {nameQuery && (
                              <button
                                aria-label="Clear name search"
                                onClick={() => {
                                  setNameQuery("");
                                  setCurrentPage(1);
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-800"
                              >
                                <XIcon size={14} />
                              </button>
                            )}
                          </div>

                          <div className="flex flex-col gap-2 w-full md:flex-row md:items-center md:w-auto">
                            <label
                              htmlFor="sortOrder"
                              className="text-sm font-medium text-slate-300"
                            >
                              Sort
                            </label>
                            <select
                              id="sortOrder"
                              value={sortOrder}
                              onChange={(event) => {
                                setSortOrder(
                                  event.target.value as
                                    | "newest"
                                    | "oldest"
                                    | "az"
                                    | "za",
                                );
                                setCurrentPage(1);
                              }}
                              className="w-full rounded-full border border-white/10 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-blue-400/40 focus:ring-2 focus:ring-blue-500/20 md:w-auto"
                            >
                              <option value="newest">Newest</option>
                              <option value="oldest">Oldest</option>
                              <option value="az">Name A → Z</option>
                              <option value="za">Name Z → A</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {sortedAndFilteredLinks.length === 0 ? (
                    <NoLink />
                  ) : (
                    <>
                      {totalPages > 1 && (
                        <div className="mt-8 mb-4">{paginationControls}</div>
                      )}

                      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {paginatedLinks.map((link: LinkType) => (
                          <LinkCard
                            key={link.id}
                            id={link.id}
                            name={link.name}
                            href={link.href}
                            tags={normalizeTags(link.tag)}
                            onTagClick={(tag) => {
                              if (!selectedTags.includes(tag)) {
                                setSelectedTags([...selectedTags, tag]);
                              }
                              setCurrentPage(1);
                            }}
                          />
                        ))}
                      </section>

                      {totalPages > 1 && (
                        <div className="mt-12">{paginationControls}</div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </main>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col h-screen bg-slate-950">
            {/* Mobile Header */}
            <div className="sticky top-0 z-30 bg-linear-to-b from-slate-900 via-slate-900/95 to-slate-950/80 backdrop-blur-md border-b border-white/10 px-4 py-4 shadow-lg">
              <div className="space-y-3">
                <h1 className="text-xl font-bold text-slate-50">Saved Links</h1>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Search size={18} />
                  </span>
                  <input
                    aria-label="Search links by name"
                    value={nameQuery}
                    onChange={(e) => {
                      setNameQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search links..."
                    className="w-full rounded-2xl border border-white/10 bg-slate-800/60 px-10 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-blue-400/40 focus:ring-2 focus:ring-blue-500/20"
                  />
                  {nameQuery && (
                    <button
                      aria-label="Clear search"
                      onClick={() => {
                        setNameQuery("");
                        setCurrentPage(1);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200"
                    >
                      <XIcon size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Content Area */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
              {mobileTab === "links" && (
                <div className="px-3 py-4 space-y-3">
                  {sortedAndFilteredLinks.length === 0 ? (
                    <NoLink />
                  ) : (
                    <section className="grid gap-3 grid-cols-1">
                      {paginatedLinks.map((link: LinkType) => (
                        <LinkCard
                          key={link.id}
                          id={link.id}
                          name={link.name}
                          href={link.href}
                          tags={normalizeTags(link.tag)}
                          onTagClick={(tag) => {
                            if (!selectedTags.includes(tag)) {
                              setSelectedTags([...selectedTags, tag]);
                            }
                            setMobileTab("filters");
                            setCurrentPage(1);
                          }}
                        />
                      ))}
                    </section>
                  )}
                </div>
              )}

              {mobileTab === "filters" && (
                <div className="px-4 py-4">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-50 mb-3">
                        Filter by Tags
                      </h2>
                      <input
                        value={tagQuery}
                        onChange={(e) => setTagQuery(e.target.value)}
                        placeholder="Search tags..."
                        className="w-full rounded-2xl border border-white/10 bg-slate-800/60 px-4 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-blue-400/40 focus:ring-2 focus:ring-blue-500/20 mb-4"
                      />

                      {/* All Button */}
                      <button
                        type="button"
                        onClick={() => setSelectedTags([])}
                        className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition text-left mb-3 ${selectedTags.length > 0 ? "bg-slate-800/50 text-slate-100 hover:bg-slate-700/50" : "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"}`}
                      >
                        All Tags
                      </button>

                      {/* Match Mode */}
                      <div className="flex gap-2 border-t border-white/10 pt-3 mb-4">
                        <button
                          type="button"
                          onClick={() => setMatchMode("any")}
                          className={`flex-1 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${matchMode === "any" ? "bg-blue-500 text-slate-950" : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"}`}
                        >
                          Match Any
                        </button>
                        <button
                          type="button"
                          onClick={() => setMatchMode("all")}
                          className={`flex-1 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${matchMode === "all" ? "bg-blue-500 text-slate-950" : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"}`}
                        >
                          Match All
                        </button>
                      </div>

                      {/* Tags List */}
                      <div className="flex flex-wrap gap-2">
                        {filteredTagOptions.length > 0 ? (
                          filteredTagOptions.map((tag) => {
                            const isSelected = selectedTags.includes(tag);
                            return (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => toggleSelectedTag(tag)}
                                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${isSelected ? "bg-blue-500 text-slate-950 shadow-blue-500/30" : `${getTagVariant(tag).replace("text-", "text-")} bg-slate-800/30 hover:bg-slate-700/50`}`}
                              >
                                {tag}
                              </button>
                            );
                          })
                        ) : (
                          <span className="text-xs text-slate-400">
                            No tags found
                          </span>
                        )}
                      </div>

                      {selectedTags.length > 0 && (
                        <p className="text-xs text-slate-400 border-t border-white/10 pt-3 mt-4">
                          {`Filtering by ${matchMode === "all" ? "all" : "any"}: ${selectedTags.join(", ")}`}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {mobileTab === "settings" && (
                <div className="px-4 py-4">
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-50">
                      Sort Options
                    </h2>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: "newest" as const, label: "Newest" },
                        { value: "oldest" as const, label: "Oldest" },
                        { value: "az" as const, label: "A → Z" },
                        { value: "za" as const, label: "Z → A" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortOrder(option.value);
                            setCurrentPage(1);
                          }}
                          className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                            sortOrder === option.value
                              ? "bg-blue-500 text-slate-950 shadow-blue-500/30"
                              : "bg-slate-800/50 text-slate-200 hover:bg-slate-700/50"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-white/10 pt-4 mt-4">
                      <h3 className="text-sm font-semibold text-slate-200 mb-3">
                        Statistics
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs bg-slate-800/30 rounded-lg px-3 py-2">
                          <span className="text-slate-400">Total Links:</span>
                          <span className="font-semibold text-slate-200">
                            {links.length}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs bg-slate-800/30 rounded-lg px-3 py-2">
                          <span className="text-slate-400">Showing:</span>
                          <span className="font-semibold text-slate-200">
                            {sortedAndFilteredLinks.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Bottom Navigation - Outside Main Container */}
          <div
            className="md:hidden z-50 bg-linear-to-t from-slate-900 via-slate-900 to-slate-900/95 border-t border-white/10 backdrop-blur-md shadow-2xl"
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              top: "auto",
              width: "100%",
              height: "auto",
              display: "block",
              zIndex: 9999,
            }}
          >
            <div className="flex items-center justify-around h-20 px-2 safe-bottom">
              <button
                onClick={() => setMobileTab("links")}
                className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all ${
                  mobileTab === "links"
                    ? "bg-blue-500/20 text-blue-400"
                    : "text-slate-400 hover:text-slate-300"
                }`}
                aria-label="Links"
              >
                <Grid3x3 size={24} />
                <span className="text-xs font-medium mt-1">Links</span>
              </button>

              <button
                onClick={() => setMobileTab("filters")}
                className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all ${
                  mobileTab === "filters"
                    ? "bg-blue-500/20 text-blue-400"
                    : "text-slate-400 hover:text-slate-300"
                }`}
                aria-label="Filters"
              >
                <Filter size={24} />
                <span className="text-xs font-medium mt-1">Tags</span>
              </button>

              <button
                onClick={() => setMobileTab("settings")}
                className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all ${
                  mobileTab === "settings"
                    ? "bg-blue-500/20 text-blue-400"
                    : "text-slate-400 hover:text-slate-300"
                }`}
                aria-label="Settings"
              >
                <Settings size={24} />
                <span className="text-xs font-medium mt-1">Sort</span>
              </button>
            </div>
          </div>
        </>
      ) : (
        <AuthForm />
      )}
    </div>
  );
};

export default Home;
