"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface LinkPreviewProps {
  url: string;
  title: string;
}

type PreviewData = {
  title?: string;
  description?: string;
  domain?: string;
  canonical?: string;
  image?: string;
  metadata?: Record<string, string>;
};

export default function LinkPreview({ url, title }: LinkPreviewProps) {
  const [preview, setPreview] = useState<PreviewData>({});
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const loadPreviewCache = (url: string) => {
    if (typeof window === "undefined") return null;
    try {
      const cached = window.localStorage.getItem(`seedlink-preview-${url}`);
      if (!cached) return null;
      const parsed = JSON.parse(cached);
      if (parsed?.expiresAt && parsed?.data && Date.now() < parsed.expiresAt) {
        return parsed.data as PreviewData;
      }
    } catch {
      // ignore invalid cache
    }
    return null;
  };

  const savePreviewCache = (url: string, data: PreviewData) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      `seedlink-preview-${url}`,
      JSON.stringify({ expiresAt: Date.now() + 1000 * 60 * 30, data }),
    );
  };

  useEffect(() => {
    let cancelled = false;

    const cachedPreview = loadPreviewCache(url);
    if (cachedPreview) {
      setTimeout(() => {
        if (!cancelled) {
          setPreview(cachedPreview);
          setImageFailed(false);
        }
      }, 0);
      return;
    }

    const fetchPreview = async () => {
      setIsPreviewLoading(true);
      setPreviewError(null);

      try {
        const response = await fetch(
          `/api/metadata?url=${encodeURIComponent(url)}`,
        );
        if (!response.ok) {
          throw new Error("Failed to load metadata");
        }

        const data = await response.json();
        if (cancelled) return;

        const nextPreview = {
          title: data.title || undefined,
          description: data.description || undefined,
          domain: data.domain || undefined,
          canonical: data.canonical || undefined,
          image: data.image || undefined,
          metadata: data.metadata || {},
        };
        setPreview(nextPreview);
        setImageFailed(false);
        savePreviewCache(url, nextPreview);
      } catch {
        if (!cancelled) {
          setPreviewError("Preview unavailable");
        }
      } finally {
        if (!cancelled) {
          setIsPreviewLoading(false);
        }
      }
    };

    fetchPreview();
    return () => {
      cancelled = true;
    };
  }, [url]);

  const showImage = Boolean(preview.image && !imageFailed);
  const hasPreview =
    preview.title ||
    preview.description ||
    preview.domain ||
    preview.canonical ||
    showImage ||
    Object.keys(preview.metadata ?? {}).length > 0;

  if (isPreviewLoading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-3">
        <div className="mb-3 h-24 animate-pulse rounded-2xl bg-slate-800" />
        <div className="h-4 w-3/4 animate-pulse rounded-full bg-slate-800" />
        <div className="mt-2 h-3 w-1/2 animate-pulse rounded-full bg-slate-800" />
      </div>
    );
  }

  if (previewError) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/70 p-3 text-sm text-slate-400">
        {previewError}
      </div>
    );
  }

  if (!hasPreview) {
    return null;
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsExpanded(true)}
        className="w-full rounded-2xl border border-white/10 bg-slate-900/70 p-3 text-left shadow-sm transition hover:border-blue-400/40 hover:bg-slate-800/90"
      >
        {showImage && (
          <div className="relative mb-3 h-32 w-full overflow-hidden rounded-2xl bg-slate-100">
            <Image
              src={preview.image!}
              alt={preview.title || "Link thumbnail"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageFailed(true)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        )}

        {preview.title ? (
          <p className="line-clamp-1 text-sm font-semibold text-slate-100">
            {preview.title}
          </p>
        ) : (
          preview.domain && (
            <p className="text-sm font-semibold text-slate-100">
              {preview.domain}
            </p>
          )
        )}

        {preview.description && (
          <p className="mt-1 line-clamp-2 text-sm text-slate-400">
            {preview.description}
          </p>
        )}

        <div className="mt-2 flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.24em] text-slate-500">
          <span>{preview.domain}</span>
          <span className="text-slate-400">Open preview</span>
        </div>
      </button>

      {isExpanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setIsExpanded(false)}
        >
          <div
            className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/95 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-end border-b border-white/10 bg-slate-950/60 px-5 py-3">
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="shrink-0 rounded-full border border-white/10 bg-slate-800 px-3 py-1 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
              >
                Close
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              {showImage && (
                <div className="relative h-64 w-full overflow-hidden rounded-[24px] bg-slate-100">
                  <Image
                    src={preview.image!}
                    alt={preview.title || "Link thumbnail"}
                    fill
                    className="object-cover"
                    onError={() => setImageFailed(true)}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 70vw"
                  />
                </div>
              )}

              <div className="min-w-0">
                <p className="text-xl font-semibold text-slate-100 wrap-break-word">
                  {preview.title || title}
                </p>
                {preview.domain && (
                  <p className="mt-1 text-sm text-slate-400">
                    {preview.domain}
                  </p>
                )}
              </div>

              {preview.description && (
                <p className="text-sm text-slate-400">{preview.description}</p>
              )}

              {preview.canonical && (
                <div className="rounded-2xl bg-slate-800/80 px-3 py-2 text-sm text-slate-300">
                  <span className="font-semibold">Canonical URL:</span>{" "}
                  <span className="break-all">{preview.canonical}</span>
                </div>
              )}

              <div className="grid gap-2">
                {Object.entries(preview.metadata ?? {}).map(([key, value]) => (
                  <div
                    key={key}
                    className="rounded-xl bg-slate-800/80 px-3 py-2 text-sm"
                  >
                    <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                      {key}
                    </div>
                    <div className="mt-1 break-all text-slate-300">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
