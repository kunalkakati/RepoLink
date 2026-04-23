'use client'

import Link from 'next/link'
import { GridIcon, Plus } from 'lucide-react'
import LinkCard from '@/components/LinkCard'
import { useLinkStore } from '@/store/LinkStore';
import { useEffect } from 'react';
import NoLink from './NoLink';
import useAuthStore from '@/store/AuthStore'
import AuthFrom from './AuthFrom';



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
    return <div>Loading...</div>;
  }
  
  
  return (<div>
    {isAuthenticated ? 
     
  
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
      <section className="rounded-3xl border border-border bg-white/85 p-6 shadow-sm shadow-slate-200/60 backdrop-blur-sm transition hover:shadow-lg sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              <GridIcon className="h-4 w-4" /> Collections
            </div>
            <div className="max-w-2xl space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Organize your saved links with clarity.
              </h1>
              <p className="text-base leading-7 text-muted-foreground">
                Create a searchable library of resources so you can revisit the best articles, tools, and references instantly.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <Link
              href="/form"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/95"
            >
              <Plus className="h-4 w-4" /> Add new link
            </Link>
            <p className="text-sm text-muted-foreground">4 saved links · 2 collections</p>
          </div>
        </div>
      </section>
     {(demoLinks.length===0) ? <NoLink /> : 
        <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
