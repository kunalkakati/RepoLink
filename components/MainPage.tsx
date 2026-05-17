"use client";

import LinkCard from "@/components/LinkCard";
import { useLinkStore } from "@/store/LinkStore";
import { useEffect, useMemo, useState } from "react";
import NoLink from "./NoLink";
import useAuthStore from "@/store/AuthStore";
import AuthFrom from "./AuthFrom";
import IntroPage from "./IntroPage";

// Skeleton components
const SkeletonCard = () => (
  <div className="h-48 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden animate-pulse">
    {/* Top accent bar skeleton */}
    <div className="h-[2px] w-full bg-slate-200"></div>

    {/* Header skeleton */}
    <div className="px-4 pt-3 pb-1.5">
      <div className="flex items-center justify-between gap-2">
        <div className="h-6 bg-slate-200 rounded flex-1"></div>
        <div className="flex items-center gap-1">
          <div className="h-6 w-6 bg-slate-200 rounded-md"></div>
          <div className="h-6 w-6 bg-slate-200 rounded-md"></div>
        </div>
      </div>
    </div>

    {/* Body skeleton */}
    <div className="px-4 py-0 flex flex-col gap-2 flex-1">
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
      </div>
      <div className="flex gap-1">
        <div className="h-5 bg-slate-200 rounded-full px-2 py-0.5 w-12"></div>
        <div className="h-5 bg-slate-200 rounded-full px-2 py-0.5 w-16"></div>
        <div className="h-5 bg-slate-200 rounded-full px-2 py-0.5 w-10"></div>
      </div>
    </div>

    {/* Footer skeleton */}
    <div className="px-4 pt-3 pb-4">
      <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
    </div>
  </div>
);

const SkeletonIntro = () => (
  <div className="space-y-6 animate-pulse">
    <div className="text-center space-y-4">
      <div className="h-8 bg-slate-200 rounded w-64 mx-auto"></div>
      <div className="h-4 bg-slate-200 rounded w-96 mx-auto"></div>
    </div>
    <div className="flex justify-center gap-4">
      <div className="h-12 bg-slate-200 rounded-lg w-32"></div>
      <div className="h-12 bg-slate-200 rounded-lg w-40"></div>
    </div>
  </div>
);

// const demoLinks = [
//   {
//     title: 'shadcn/ui documentation',
//     url: 'https://ui.shadcn.com',
//     description: 'A minimal UI toolkit built with Tailwind and Radix.',
//     tags: ['UI', 'components', 'react'],
//   },
//   {
//     title: 'Tailwind CSS',
//     url: 'https://tailwindcss.com',
//     description: 'Utility-first CSS for modern responsive design.',
//     tags: ['CSS', 'design', 'utility'],
//   },
//   {
//     title: 'Next.js Docs',
//     url: 'https://nextjs.org',
//     description: 'Production-ready React framework for hybrid rendering.',
//     tags: ['React', 'SSR', 'static'],
//   },
//   {
//     title: 'MDN Web Docs',
//     url: 'https://developer.mozilla.org',
//     description: 'Comprehensive documentation and learning resources.',
//     tags: ['reference', 'web', 'learning'],
//   },
// ]

const Home = () => {
  const { isAuthenticated } = useAuthStore();
  const { links, fetchLinks, isLoading } = useLinkStore();
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

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);
  if (isLoading) {
    return (
      <div>
        {isAuthenticated ? (
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
            <SkeletonIntro />
            <section className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </section>
          </main>
        ) : (
          <AuthFrom />
        )}
      </div>
    );
  }

  return (
    <div>
      {isAuthenticated ? (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
          <IntroPage />
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
          {filteredLinks.length === 0 ? (
            <NoLink />
          ) : (
            <section className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4">
              {filteredLinks.map((link) => (
                <LinkCard
                  key={link.id}
                  id={link.id}
                  name={link.name}
                  href={link.href}
                  tags={link.tag ? link.tag.split(",") : []}
                  description={link.description}
                  onTagClick={(tag) => setSelectedTag(tag)}
                />
              ))}
            </section>
          )}
        </main>
      ) : (
        <AuthFrom />
      )}
    </div>
  );
};

export default Home;
