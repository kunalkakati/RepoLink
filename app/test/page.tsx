// app/components/SearchButton.jsx
"use client";
import { useState } from "react";
import Image from "next/image"; // 1. Import Next.js Image component

type SearchResult = {
  id?: string;
  title?: string;
  date?: string;
  videoLength?: number | string;
  img?: string;
  image?: string;
  imageSize?: { width?: number; height?: number };
  stars?: Array<{ id: string; name: string }>;
  samples?: Array<{
    id: string;
    thumbnail?: string;
    image?: string;
    alt?: string;
  }>;
};

export default function SearchButton() {
  const [data, setData] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState("JUR-221");
  const coverImage = data?.img || data?.image;

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ id: searchId });
      const res = await fetch(`/api/data?${params.toString()}`);
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 font-sans text-gray-800">
      {/* Search Bar UI */}
      <div className="flex gap-2 mb-8">
        <input
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="border border-gray-300 p-2 rounded-md w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter ID (e.g., JUR-221)"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Results UI */}
      {data && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="md:flex">
            {/* 2. Cover Image using <Image /> */}
            <div className="md:w-1/2 bg-gray-50 flex items-center justify-center p-4">
              {typeof coverImage === "string" ? (
                <Image
                  src={coverImage}
                  alt={data.title || "Cover Image"}
                  width={data.imageSize?.width || 800}
                  height={data.imageSize?.height || 538}
                  className="w-full max-w-md h-auto rounded shadow-sm object-cover"
                  priority
                  unoptimized
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <p className="text-sm text-gray-500">Cover image unavailable</p>
              )}
            </div>

            <div className="p-6 md:w-1/2 flex flex-col justify-center">
              <h2 className="text-xl md:text-2xl font-bold mb-4 leading-tight">
                <span className="text-blue-600 mr-2">[{data.id}]</span>
                {data.title}
              </h2>

              <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                <div>
                  <p className="text-gray-500">Release Date</p>
                  <p className="font-medium">{data.date}</p>
                </div>
                <div>
                  <p className="text-gray-500">Duration</p>
                  <p className="font-medium">{data.videoLength} mins</p>
                </div>
              </div>

              {data.stars && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Stars</p>
                  <div className="flex flex-wrap gap-2">
                    {data.stars.map((star) => (
                      <span
                        key={star.id}
                        className="bg-pink-100 text-pink-700 text-xs font-semibold px-3 py-1 rounded-full"
                      >
                        {star.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. Sample Thumbnails using <Image /> */}
          {data.samples && data.samples.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <h3 className="font-semibold text-lg mb-4">Sample Images</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {data.samples.map((sample) => {
                  const sampleImage = sample.thumbnail || sample.image;
                  if (!sampleImage) return null;

                  return (
                    <Image
                      key={sample.id}
                      src={sampleImage}
                      alt={sample.alt || "Sample"}
                      width={320}
                      height={240}
                      unoptimized
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                      className="w-full h-auto rounded border border-gray-200 hover:shadow-md transition-shadow cursor-pointer object-cover"
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
