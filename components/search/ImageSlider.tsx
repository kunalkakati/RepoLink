// app/components/ImageSlider.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ImageSliderProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

export default function ImageSlider({
  images,
  initialIndex,
  onClose,
}: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [failedImageIndex, setFailedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // Navigation handlers
  const showNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const showPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length, onClose]);

  if (!images || images.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050816]/90 p-2 backdrop-blur-sm sm:p-5"
      onClick={onClose} // Clicking outside the image closes the modal
      role="dialog"
      aria-modal="true"
      aria-label="Sample image viewer"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close image viewer"
        className="absolute right-3 top-3 z-50 flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20 sm:right-6 sm:top-6"
      >
        <X size={20} aria-hidden="true" />
      </button>

      <button
        onClick={showPrev}
        aria-label="Previous image"
        className="absolute left-2 top-1/2 z-50 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20 sm:left-6"
      >
        <ChevronLeft size={24} aria-hidden="true" />
      </button>

      {/* Main Image Container */}
      <div
        className="relative flex h-[calc(100dvh-1rem)] max-h-[820px] w-full max-w-6xl flex-col items-center justify-center rounded-2xl border border-white/10 bg-slate-900/95 p-3 shadow-2xl shadow-black/50 sm:h-[calc(100dvh-2.5rem)] sm:rounded-3xl sm:p-5"
        onClick={(e) => e.stopPropagation()} // Prevent clicks on image from closing modal
      >
        <div className="relative flex min-h-0 w-full flex-1 items-center justify-center rounded-2xl bg-[#050816]">
          {failedImageIndex === currentIndex ? (
            <p className="px-6 text-center text-sm text-slate-400">
              This image could not be loaded.
            </p>
          ) : (
            <Image
              key={images[currentIndex]}
              src={images[currentIndex]}
              alt={`Slide ${currentIndex + 1}`}
              fill
              unoptimized
              sizes="(max-width: 640px) 94vw, 90vw"
              className="rounded-2xl object-contain"
              onError={() => setFailedImageIndex(currentIndex)}
            />
          )}
        </div>

        {/* Slide Counter */}
        <div className="mt-4 flex w-full items-center justify-center gap-3 text-sm text-slate-300">
          <span className="font-medium text-white">
            {String(currentIndex + 1).padStart(2, "0")}
          </span>
          <span className="text-slate-500">
            / {String(images.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={showNext}
        aria-label="Next image"
        className="absolute right-2 top-1/2 z-50 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20 sm:right-6"
      >
        <ChevronRight size={24} aria-hidden="true" />
      </button>

      <div className="absolute bottom-5 left-1/2 flex max-w-[calc(100%-7rem)] -translate-x-1/2 gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/95 p-2 sm:bottom-8">
        {images.map((image, index) => (
          <button
            key={image + index}
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setCurrentIndex(index);
            }}
            aria-label={`Show image ${index + 1}`}
            aria-current={index === currentIndex}
            className={`relative size-12 shrink-0 overflow-hidden rounded-lg border-2 transition sm:size-14 ${index === currentIndex ? "border-cyan-300" : "border-transparent opacity-55 hover:opacity-100"}`}
          >
            <Image
              src={image}
              alt=""
              fill
              unoptimized
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
