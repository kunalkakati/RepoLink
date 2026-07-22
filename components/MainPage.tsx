"use client";

import LinkCard from "@/components/LinkCard";
import TagSearch from "./TagSearch";
import type { Link as LinkType } from "@/db/schema";
import { useLinkStore } from "@/store/LinkStore";
import { useEffect, useMemo, useState } from "react";
import { Search, X as XIcon } from "lucide-react";
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

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const sortedLinks = useMemo(() => {
    const copy = [...links];
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
  }, [links, sortOrder]);

  if (isLoading) {
    return <div>{isAuthenticated ? <MainPageSkeleton /> : <AuthForm />}</div>;
  }

  return (
    <div>
      {isAuthenticated ? (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
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
                    Showing {links.length}{" "}
                    {links.length === 1 ? "link" : "links"} from the database.
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
          <TagSearch
            links={sortedLinks}
            onFilterChange={() => setCurrentPage(1)}
            nameQuery={nameQuery}
            onNameQueryChange={setNameQuery}
          >
            {(filteredLinks: LinkType[], selectTag: (tag: string) => void) => {
              const totalPages = Math.ceil(
                filteredLinks.length / ITEMS_PER_PAGE,
              );
              const validPage = Math.max(
                1,
                Math.min(currentPage, totalPages > 0 ? totalPages : 1),
              );

              const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
              const paginatedLinks = filteredLinks.slice(
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

              return filteredLinks.length === 0 ? (
                <NoLink />
              ) : (
                <>
                  {totalPages > 1 && (
                    <div className="mt-8 mb-4">{paginationControls}</div>
                  )}

                  {/* name search is now in the header */}

                  <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {paginatedLinks.map((link: LinkType) => (
                      <LinkCard
                        key={link.id}
                        id={link.id}
                        name={link.name}
                        href={link.href}
                        tags={normalizeTags(link.tag)}
                        onTagClick={(tag) => {
                          selectTag(tag);
                          setCurrentPage(1);
                        }}
                      />
                    ))}
                  </section>

                  {totalPages > 1 && (
                    <div className="mt-12">{paginationControls}</div>
                  )}
                </>
              );
            }}
          </TagSearch>
        </main>
      ) : (
        <AuthForm />
      )}
    </div>
  );
};

export default Home;
