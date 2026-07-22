import React from "react";
import { GridIcon, Plus } from "lucide-react";
import Link from "next/link";

const IntroPage = () => {
  return (
    <div>
      <section className="rounded-[28px] border border-white/10 bg-slate-900/70 p-6 shadow-[0_20px_70px_-30px_rgba(0,0,0,0.7)] backdrop-blur-2xl transition hover:shadow-[0_24px_70px_-26px_rgba(124,147,255,0.35)] sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-blue-300">
              <GridIcon className="h-4 w-4" /> Collections
            </div>
            <div className="max-w-2xl space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Organize your saved links with clarity.
              </h1>
              <p className="text-base leading-7 text-muted-foreground">
                Create a searchable library of resources so you can revisit the
                best articles, tools, and references instantly.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <Link
              href="/form"
              className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-blue-400"
            >
              <Plus className="h-4 w-4" /> Add new link
            </Link>
            <p className="text-sm text-muted-foreground">
              4 saved links · 2 collections
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IntroPage;
