"use client";

import { useState } from "react";
import Link from "next/link";
import LinkPreview from "@/components/LinkPreview";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ExternalLink, Copy, Trash2, Check, Pencil } from "lucide-react";
import { useDeleteStore } from "@/store/DeleteStore";
import { useLinkStore } from "@/store/LinkStore";
import UpdateLinkModal from "@/components/UpdateLinkModal";

const tagColorVariants = [
  "from-sky-100 via-sky-200 text-sky-800",
  "from-emerald-100 via-emerald-200 text-emerald-800",
  "from-violet-100 via-violet-200 text-violet-800",
  "from-fuchsia-100 via-fuchsia-200 text-fuchsia-800",
  "from-amber-100 via-amber-200 text-amber-800",
  "from-rose-100 via-rose-200 text-rose-800",
  "from-lime-100 via-lime-200 text-lime-800",
];

const getTagClasses = (tag: string) => {
  const hash = Array.from(tag).reduce(
    (total, char) => total + char.charCodeAt(0),
    0,
  );
  return tagColorVariants[hash % tagColorVariants.length];
};

interface LinkCardProps {
  id: string;
  name: string;
  href: string;
  tags?: string[];
  onTagClick?: (tag: string) => void;
}

export default function LinkCard({
  id,
  name: title,
  href: url,
  tags = [],
  onTagClick,
}: LinkCardProps) {
  const [copied, setCopied] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { enableDelete } = useDeleteStore();
  const { deleteLink } = useLinkStore();

  const handleCopy = async () => {
    if (!navigator?.clipboard) return;
    try {
      await navigator.clipboard.writeText(title);
    } catch {}
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this link?")) {
      await deleteLink(id);
    }
  };

  return (
    <>
      <Card className="group relative flex flex-col w-full bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-visible">
        {/* Top accent bar */}
        <div className="h-0.5 w-full bg-linear-to-r from-slate-300 via-slate-400 to-slate-300 group-hover:from-blue-400 group-hover:via-indigo-500 group-hover:to-blue-400 transition-all duration-300" />

        {/* Header */}
        <CardHeader className="px-4 pt-3 pb-1.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-2xl font-bold text-slate-800 leading-snug tracking-tight line-clamp-1 flex-1 min-w-0">
              {title}
            </h3>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleCopy}
                aria-label={copied ? "Copied" : "Copy name"}
                className="h-6 w-6 flex items-center cursor-pointer justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all duration-150"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-emerald-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>

              {enableDelete && (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(true)}
                    aria-label="Edit link"
                    className="h-6 w-6 flex items-center justify-center rounded-md text-blue-500 hover:bg-blue-50 transition-all duration-150"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    aria-label="Delete link"
                    className="h-6 w-6 flex items-center justify-center rounded-md text-red-500 hover:bg-red-50 transition-all duration-150"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </>
              )}
            </div>
          </div>
        </CardHeader>

        {/* Body */}
        <CardContent className="px-4 py-0 flex flex-col gap-2 flex-1">
          <LinkPreview url={url} title={title} />

          {/* Tags */}
          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onTagClick?.(tag)}
                  className={`rounded-full bg-linear-to-r ${getTagClasses(tag)} px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] shadow-sm ring-1 ring-slate-200/70 transition-all duration-200 hover:scale-[1.03] hover:shadow-md`}
                >
                  {tag}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-slate-400 italic">No tags</p>
          )}
        </CardContent>

        {/* Footer */}
        <CardFooter className="px-4 pt-3 pb-4">
          <Link
            href={url}
            target="_blank"
            rel="noreferrer"
            className="group/btn relative inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-linear-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
          >
            <span className="relative z-10">Open Link</span>
            <ExternalLink className="h-4 w-4 relative z-10 group-hover/btn:translate-x-0.5 transition-transform duration-200" />

            {/* Button shine effect */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
          </Link>
        </CardFooter>
      </Card>

      {isEditModalOpen && (
        <UpdateLinkModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          link={{ id, name: title, href: url, tags }}
        />
      )}
    </>
  );
}
