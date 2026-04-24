'use client'

import Link from 'next/link'
import { GridIcon, Plus } from 'lucide-react'
import LinkCard from '@/components/LinkCard'
import { useLinkStore } from '@/store/LinkStore';
import { useEffect } from 'react';
import NoLink from './NoLink';
import useAuthStore from '@/store/AuthStore'
import AuthFrom from './AuthFrom';
import IntroPage from './IntroPage';

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
  const {isAuthenticated} = useAuthStore();
  const { links,fetchLinks,isLoading } = useLinkStore();
  const demoLinks= links;
  useEffect(() => {
      fetchLinks();
  }, [fetchLinks]);
  if (isLoading) {
    return (
      <div>
        {isAuthenticated ?
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
            <SkeletonIntro />
            <section className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </section>
          </main>
          : <AuthFrom />}
      </div>
    );
  }
  
  
  return (<div>
    {isAuthenticated ? 
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
          <IntroPage />
          {(demoLinks.length===0) ? <NoLink /> : 
              <section className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4">
                {demoLinks.map((link) => (
                  <LinkCard key={link.id} id={link.id} name={link.name} href={link.href} tags={link.tag ? link.tag.split(',') : []} description={link.description} />
                ))}
              </section>
          }
      </main>
      : <AuthFrom />}
    </div>
  )
}

export default Home
