import React from 'react'
import { GridIcon, Plus } from 'lucide-react'
import Link from 'next/link'


const IntroPage = () => {
  return (
    <div>
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
    </div>
  )
}

export default IntroPage