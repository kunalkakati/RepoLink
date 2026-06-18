"use client";

import LinkCard from "@/components/LinkCard";
import TagSearch from "./TagSearch";
import type { Link as LinkType } from "@/db/schema";
import { useLinkStore } from "@/store/LinkStore";
import { useEffect, useMemo, useState } from "react";
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
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Saved Links
              </h2>
              <p className="text-sm text-slate-500">
                Showing {links.length} {links.length === 1 ? "link" : "links"}{" "}
                from the database.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label
                htmlFor="sortOrder"
                className="text-sm font-medium text-slate-700"
              >
                Sort by:
              </label>
              <select
                id="sortOrder"
                value={sortOrder}
                onChange={(event) => {
                  setSortOrder(
                    event.target.value as "newest" | "oldest" | "az" | "za",
                  );
                  setCurrentPage(1);
                }}
                className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-slate-500"
              >
                <option value="newest">Newest to oldest</option>
                <option value="oldest">Oldest to newest</option>
                <option value="az">Name A → Z</option>
                <option value="za">Name Z → A</option>
              </select>
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

                  <div className="mb-6">
                    <input
                      value={nameQuery}
                      onChange={(e) => {
                        setNameQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Search by name"
                      className="w-full max-w-md rounded-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-slate-500"
                    />
                  </div>

                  <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4">
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
