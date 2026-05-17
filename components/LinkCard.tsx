"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ExternalLink, Copy, Trash2, Check } from "lucide-react";
import { useDeleteStore } from "@/store/DeleteStore";
import { useLinkStore } from "@/store/LinkStore";
import ReadMore from "./UtilityComponents/ReadMore";

interface LinkCardProps {
  id: string;
  name: string;
  href: string;
  tags?: string[];
  description?: string;
  onTagClick?: (tag: string) => void;
}

export default function LinkCard({
  id,
  name: title,
  href: url,
  tags = [],
  description,
  onTagClick,
}: LinkCardProps) {
  const [copied, setCopied] = useState(false);
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
    <Card className="group relative flex flex-col w-full bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Top accent bar */}
      <div className="h-[2px] w-full bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300 group-hover:from-blue-400 group-hover:via-indigo-500 group-hover:to-blue-400 transition-all duration-300" />

      {/* Header */}
      <CardHeader className="px-4 pt-3 pb-1.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-2xl font-bold text-slate-800 leading-snug tracking-tight line-clamp-1 flex-1 min-w-0">
            {title}
          </h3>

          <div className="flex items-center gap-1 flex-shrink-0">
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
              <button
                type="button"
                onClick={handleDelete}
                aria-label="Delete link"
                className="h-6 w-6 flex items-center justify-center rounded-md text-red-500 hover:bg-red-50 transition-all duration-150"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Body */}
      <CardContent className="px-4 py-0 flex flex-col gap-2 flex-1">
        {/* Description */}
        {description ? (
          <ReadMore text={description} wordLimit={15} />
        ) : (
          <p className="text-xs text-slate-400 italic">No description</p>
        )}

        {/* Tags */}
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onTagClick?.(tag)}
                className="rounded-full border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 transition hover:bg-slate-200"
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
          className="group/btn relative inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
        >
          <span className="relative z-10">Open Link</span>
          <ExternalLink className="h-4 w-4 relative z-10 group-hover/btn:translate-x-0.5 transition-transform duration-200" />

          {/* Button shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
        </Link>
      </CardFooter>
    </Card>
  );
}
// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import { Badge } from "@/components/ui/badge"
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { ExternalLink, Copy, Trash2 } from "lucide-react"
// import { useDeleteStore } from "@/store/DeleteStore"
// import { useLinkStore } from "@/store/LinkStore"
// import ReadMore from './UtilityComponents/ReadMore';

// interface LinkCardProps {
//   id: string
//   name: string
//   href: string
//   tags?: string[]
//   description?: string
// }

// export default function LinkCard({ id, name: title, href: url, tags = [], description }: LinkCardProps) {
//   const [copied, setCopied] = useState(false)
//   const { enableDelete } = useDeleteStore()
//   const { deleteLink } = useLinkStore()

//   const handleCopy = async () => {
//     if (!navigator?.clipboard) return

//     try {
//       await navigator.clipboard.writeText(title)
//       setCopied(true)
//       window.setTimeout(() => setCopied(false), 1200)
//     } catch {
//       setCopied(true)
//       window.setTimeout(() => setCopied(false), 1200)
//     }
//   }

//   const handleDelete = async () => {
//     if (confirm('Are you sure you want to delete this link?')) {
//       await deleteLink(id)
//     }
//   }

//   return (
//     <Card className="group relative w-full h-56 overflow-hidden bg-gradient-to-br from-white via-white to-slate-50/50 border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-slate-200/20 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm">
//       {/* Subtle background pattern */}
//       <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//       {/* Header with modern styling */}
//       <CardHeader className="relative pb-3 flex-shrink-0">
//         <div className="flex items-start justify-between gap-3">
//           <div className="flex-1 min-w-0">
//             <CardTitle className="text-lg font-bold tracking-tight break-words line-clamp-2 min-h-[2.5rem] leading-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-600 transition-all duration-300">
//               {title}
//             </CardTitle>
//           </div>

//           {/* Action buttons with modern design */}
//           <div className="flex items-center gap-1.5 flex-shrink-0">
//             <button
//               type="button"
//               onClick={handleCopy}
//               aria-label="Copy name"
//               className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100/80 border border-slate-200/50 text-slate-600 transition-all duration-200 hover:bg-blue-100 hover:border-blue-300 hover:text-blue-700 hover:scale-105 active:scale-95 shadow-sm"
//             >
//               {copied ? (
//                 <span className="text-xs font-medium">✓</span>
//               ) : (
//                 <Copy className="h-3.5 w-3.5" />
//               )}
//             </button>
//             {enableDelete && (
//               <button
//                 type="button"
//                 onClick={handleDelete}
//                 aria-label="Delete link"
//                 className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-50 border border-red-200/50 text-red-600 transition-all duration-200 hover:bg-red-100 hover:border-red-300 hover:text-red-700 hover:scale-105 active:scale-95 shadow-sm"
//               >
//                 <Trash2 className="h-3.5 w-3.5" />
//               </button>
//             )}
//           </div>
//         </div>
//       </CardHeader>

//       {/* Content with modern spacing */}
//       <CardContent className="relative space-y-3 flex-1 overflow-hidden px-6">
//         {description ? (
//           <div className="min-h-[2.5rem]">
//             <ReadMore text={description} />
//           </div>
//         ) : (
//           <div className="min-h-[2.5rem] flex items-center">
//             <span className="text-sm text-slate-500 italic">No description available</span>
//           </div>
//         )}

//         {/* Tags with modern styling */}
//         <div className="flex flex-wrap gap-1.5 min-h-[1.5rem] items-start">
//           {tags.length > 0 ? (
//             tags.map((tag) => (
//               <Badge
//                 key={tag}
//                 variant="secondary"
//                 className="text-xs px-2.5 py-1 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border border-slate-300/50 hover:from-blue-100 hover:to-blue-200 hover:text-blue-800 transition-all duration-200 shadow-sm"
//               >
//                 {tag}
//               </Badge>
//             ))
//           ) : (
//             <span className="text-sm text-slate-500 italic">No tags</span>
//           )}
//         </div>
//       </CardContent>

//       {/* Footer with modern button */}
//       <CardFooter className="relative pt-0 flex-shrink-0 px-6 pb-4">
//         <Link
//           href={url}
//           target="_blank"
//           rel="noreferrer"
//           className="group/btn inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:from-blue-700 hover:via-blue-800 hover:to-purple-800 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
//         >
//           <span className="relative z-10">Open Link</span>
//           <ExternalLink className="h-4 w-4 relative z-10 group-hover/btn:translate-x-0.5 transition-transform duration-200" />

//           {/* Button shine effect */}
//           <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
//         </Link>
//       </CardFooter>

//       {/* Subtle border glow on hover */}
//       <div className="absolute inset-0 rounded-[inherit] ring-1 ring-slate-200/20 group-hover:ring-blue-300/30 transition-all duration-300" />
//     </Card>
//   )
// }
