// app/components/SearchBar.tsx
"use client";

interface SearchBarProps {
  searchId: string;
  setSearchId: (val: string) => void;
  onSearch: () => void;
  loading: boolean;
}

export default function SearchBar({
  searchId,
  setSearchId,
  onSearch,
  loading,
}: SearchBarProps) {
  return (
    <div className="mb-8 flex gap-2">
      <input
        type="text"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
        placeholder="Enter ID (e.g., JUR-221)"
        className="w-full max-w-xs rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
      />
      <button
        onClick={onSearch}
        disabled={loading}
        className="rounded-xl bg-cyan-300 px-5 py-2 font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </div>
  );
}
