// app/components/VideoDetails.tsx
import { SearchResult } from "@/types/card-details.types";

interface VideoDetailsProps {
  data: SearchResult;
}

export default function VideoDetails({ data }: VideoDetailsProps) {
  return (
    <div className="flex flex-col justify-center border-t border-white/10 bg-slate-900/70 p-6 sm:p-8 lg:border-l lg:border-t-0">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
        Card details
      </p>
      <h2 className="mb-6 text-xl font-bold leading-tight text-white md:text-2xl">
        <span className="mr-2 text-cyan-300">[{data.id}]</span>
        {data.title}
      </h2>

      <div className="mb-6 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="mb-1 text-xs uppercase tracking-wider text-slate-500">Release date</p>
          <p className="font-medium text-slate-200">{data.date || "Unknown"}</p>
        </div>
        <div>
          <p className="mb-1 text-xs uppercase tracking-wider text-slate-500">Duration</p>
          <p className="font-medium text-slate-200">{data.videoLength || "Unknown"} mins</p>
        </div>
      </div>

      {data.stars && data.stars.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-xs uppercase tracking-wider text-slate-500">Stars</p>
          <div className="flex flex-wrap gap-2">
            {data.stars.map((star) => (
              <span
                key={star.id}
                className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-200"
              >
                {star.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
