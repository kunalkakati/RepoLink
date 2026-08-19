// app/components/SampleGallery.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Images, Maximize2 } from "lucide-react";
import { SampleImage } from "@/types/card-details.types";
import ImageSlider from "./ImageSlider";

interface SampleGalleryProps {
  samples: SampleImage[];
}

export default function SampleGallery({ samples }: SampleGalleryProps) {
  const [activeSlideIndex, setActiveSlideIndex] = useState<number | null>(null);

  // 1. Clean the data to guarantee we only have valid string URLs
  const validImageUrls = samples
    .map((sample) => sample.thumbnail || sample.image)
    .filter((url): url is string => Boolean(url));

  if (validImageUrls.length === 0) return null;

  return (
    <>
      <div className="border-t border-white/10 bg-slate-900/45 p-5 sm:p-7">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
              <Images size={15} aria-hidden="true" /> Gallery
            </div>
            <h3 className="text-xl font-semibold tracking-tight text-white">
              Sample images
            </h3>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
            {validImageUrls.length} frames
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {/* 2. Map over the cleaned URLs */}
          {validImageUrls.map((imgUrl, index) => (
            <div
              key={`thumb-${index}`}
              onClick={() => setActiveSlideIndex(index)}
              className="group relative block aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-slate-950 transition hover:-translate-y-1 hover:border-cyan-300/60 hover:shadow-xl hover:shadow-cyan-950/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              role="button"
              tabIndex={0}
              aria-label={`Open sample image ${index + 1}`}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActiveSlideIndex(index);
                }
              }}
            >
              <Image
                src={imgUrl}
                alt={`Sample Thumbnail ${index + 1}`}
                width={320}
                height={240}
                unoptimized
                className="object-cover transition duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/75 to-transparent px-3 pb-2 pt-8 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
                <span>Frame {index + 1}</span>
                <Maximize2 size={14} aria-hidden="true" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Render the slider ONLY when an index is selected */}
      {activeSlideIndex !== null && (
        <ImageSlider
          images={validImageUrls}
          initialIndex={activeSlideIndex}
          onClose={() => setActiveSlideIndex(null)}
        />
      )}
    </>
  );
}
