"use client";

import LinkCard from "@/components/LinkCard";
import TagSearch from "@/components/TagSearch";
import { useLinkStore } from "@/store/LinkStore";
import { useEffect } from "react";
import NoLink from "./NoLink";
import useAuthStore from "@/store/AuthStore";
import AuthFrom from "./AuthFrom";
import IntroPage from "./IntroPage";
import { MainPageSkeleton } from "./Skeleton";

const Home = () => {
  const { isAuthenticated } = useAuthStore();
  const { links, fetchLinks, isLoading } = useLinkStore();

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);
  if (isLoading) {
    return <div>{isAuthenticated ? <MainPageSkeleton /> : <AuthFrom />}</div>;
  }

  return (
    <div>
      {isAuthenticated ? (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
          <IntroPage />
          <TagSearch links={links}>
            {(filteredLinks, selectTag) =>
              filteredLinks.length === 0 ? (
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
                      onTagClick={selectTag}
                    />
                  ))}
                </section>
              )
            }
          </TagSearch>
        </main>
      ) : (
        <AuthFrom />
      )}
    </div>
  );
};

export default Home;
// temp data for development
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
