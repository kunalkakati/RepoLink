import React from "react";
import {
  Plus,
  Link as LinkIcon,
  ExternalLink,
  MousePointerClick,
} from "lucide-react";
import { redirect } from "next/navigation";

const NoLink = () => {
  const handleCreateFirstLink = () => {
    redirect("/form");
  };

  return (
    <div className="my-4 rounded-[28px] border border-white/10 bg-slate-900/70 p-4 shadow-[0_20px_60px_-24px_rgba(0,0,0,0.6)] backdrop-blur-xl">
      <div className="flex min-h-105 flex-col items-center justify-center rounded-[24px] border border-dashed border-white/10 bg-linear-to-br from-slate-950/70 via-slate-900/80 to-blue-950/50 px-6 py-10 text-center sm:px-10">
        <div className="relative mb-6 h-24 w-24">
          <div className="absolute inset-0 rounded-full bg-blue-500/10" />
          <div className="relative flex h-full w-full items-center justify-center rounded-full border border-dashed border-blue-400/20 bg-slate-900/70 shadow-sm">
            <LinkIcon className="h-10 w-10 text-blue-400" />
            <div className="absolute -right-1 -top-1 rounded-xl border border-white/10 bg-slate-900/70 p-1.5 shadow-sm">
              <Plus className="h-4 w-4 text-blue-400" />
            </div>
            <div className="absolute -bottom-1 -left-2 rounded-xl border border-white/10 bg-slate-900/70 p-1.5 shadow-sm">
              <ExternalLink className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>

        <h3 className="mb-2 text-xl font-bold text-slate-100">
          Your library is ready for its first link
        </h3>
        <p className="mb-8 max-w-md text-sm leading-7 text-slate-400">
          Add your current favorite URLs here so everything stays organized,
          searchable, and easy to revisit later.
        </p>

        <button
          onClick={handleCreateFirstLink}
          className="group relative inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-[1.01] hover:shadow-xl active:scale-[0.98]"
        >
          <Plus className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
          <span>Create your first link</span>
        </button>

        <div className="mt-8 flex items-center justify-center gap-2 border-t border-slate-100 pt-6 text-xs font-medium uppercase tracking-[0.24em] text-slate-400">
          <MousePointerClick className="h-3.5 w-3.5" />
          <span>Fast setup, cleaner browsing</span>
        </div>
      </div>
    </div>
  );
};

export default NoLink;
