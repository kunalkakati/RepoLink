"use client";

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
  metadata?: Record<string, string>;
};

export default function LinkPreview({ url, title }: LinkPreviewProps) {
  const [preview, setPreview] = useState<PreviewData>({});
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    let cancelled = false;

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

        setPreview({
          title: data.title || undefined,
          description: data.description || undefined,
          domain: data.domain || undefined,
          canonical: data.canonical || undefined,
          metadata: data.metadata || {},
        });
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

  const hasPreview =
    preview.title ||
    preview.description ||
    preview.domain ||
    preview.canonical ||
    Object.keys(preview.metadata ?? {}).length > 0;

  if (isPreviewLoading) {
    return <p className="text-sm text-slate-500">Loading preview…</p>;
  }

  if (previewError) {
    return <p className="text-sm text-slate-500">{previewError}</p>;
  }

  if (!hasPreview) {
    return null;
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsExpanded(true)}
        className="w-full rounded-2xl border border-slate-200/70 bg-slate-50 p-3 text-left transition hover:border-blue-300"
      >
        {preview.title ? (
          <p className="text-sm font-semibold text-slate-800 line-clamp-1">
            {preview.title}
          </p>
        ) : (
          preview.domain && (
            <p className="text-sm font-semibold text-slate-800">
              {preview.domain}
            </p>
          )
        )}

        {preview.description && (
          <p className="mt-1 text-sm text-slate-600 line-clamp-2">
            {preview.description}
          </p>
        )}

        <div className="mt-2 flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.24em] text-slate-400">
          <span>{preview.domain}</span>
          <span className="text-slate-500">Open preview</span>
        </div>
      </button>

      {isExpanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setIsExpanded(false)}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4">
              <div className="min-w-0">
                <p className="text-lg font-semibold text-slate-900">
                  {preview.title || title}
                </p>
                {preview.domain && (
                  <p className="mt-1 text-sm text-slate-500">
                    {preview.domain}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 px-5 py-5">
              {preview.description && (
                <p className="text-sm text-slate-600">{preview.description}</p>
              )}

              {preview.canonical && (
                <div className="rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  <span className="font-semibold">Canonical URL:</span>{" "}
                  <span className="break-all">{preview.canonical}</span>
                </div>
              )}

              <div className="grid gap-2">
                {Object.entries(preview.metadata ?? {}).map(([key, value]) => (
                  <div
                    key={key}
                    className="rounded-xl bg-slate-50 px-3 py-2 text-sm"
                  >
                    <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                      {key}
                    </div>
                    <div className="mt-1 text-slate-700 break-all">{value}</div>
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
