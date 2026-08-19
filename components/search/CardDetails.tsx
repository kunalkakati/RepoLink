// app/components/SearchClient.tsx
"use client";

import { useState, useEffect } from "react";
import { SearchResult } from "@/types/card-details.types";
import SearchBar from "./Searchbar";
import CoverImage from "./CoverImage";
import VideoDetails from "./VideoDetails";
import SampleGallery from "./SampleGallery";

interface SearchClientProps {
  initialCode?: string;
}

export default function CardDetails({ initialCode = "" }: SearchClientProps) {
  const [data, setData] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState(initialCode);

  const handleSearch = async () => {
    if (!searchId) return;

    setLoading(true);
    try {
      const queryParams = new URLSearchParams({ id: searchId });
      const res = await fetch(`/api/data?${queryParams.toString()}`);

      if (!res.ok) throw new Error("Failed to fetch");

      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialCode) return;
    const timeoutId = window.setTimeout(() => void handleSearch(), 0);
    return () => window.clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
      <SearchBar
        searchId={searchId}
        setSearchId={setSearchId}
        onSearch={handleSearch}
        loading={loading}
      />

      {data && (
        <section className="animate-page-in overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/70 text-slate-100 shadow-[0_30px_100px_-45px_rgba(0,0,0,0.9)] backdrop-blur-xl">
          <div className="grid gap-0 lg:grid-cols-[minmax(320px,0.78fr)_1.22fr]">
            <CoverImage
              src={data.img || data.image}
              alt={data.title}
              width={data.imageSize?.width}
              height={data.imageSize?.height}
            />
            <VideoDetails data={data} />
          </div>

          {data.samples && <SampleGallery samples={data.samples} />}
        </section>
      )}
    </main>
  );
}
