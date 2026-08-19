// app/search/[code]/page.tsx
import { Suspense } from "react";
import CardDetails from "@/components/search/CardDetails";

interface PageProps {
  params: Promise<{
    code: string;
  }>;
}

// 1. A helper Async Server Component to handle the Promise unwrapping
async function SearchCodeResolver({
  paramsPromise,
}: {
  paramsPromise: PageProps["params"];
}) {
  const resolvedParams = await paramsPromise;
  const code = resolvedParams.code;

  return <CardDetails initialCode={code} />;
}

// 2. The main Page is NO LONGER async. It renders the static shell instantly.
export default function Page({ params }: PageProps) {
  return (
    <main className="min-h-screen bg-[#050816] py-6 text-slate-100 sm:py-10">
      <h1 className="mb-8 text-center text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        Database Search
      </h1>

      {/* 3. Wrap the dynamic parameter resolution in a Suspense boundary */}
      <Suspense
        fallback={
          <p className="mt-10 text-center text-slate-500">
            Loading search parameters...
          </p>
        }
      >
        <SearchCodeResolver paramsPromise={params} />
      </Suspense>
    </main>
  );
}
