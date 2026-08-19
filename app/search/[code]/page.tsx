// app/search/[code]/page.tsx
import { Suspense } from "react";
import CardDetails from "@/components/search/CardDetails";

interface PageProps {
  params: Promise<{
    code: string;
  }>;
}

export default function Page({ params }: PageProps) {
  return (
    <main className="min-h-screen bg-[#050816] py-6 text-slate-100 sm:py-10">
      <h1 className="mb-8 text-center text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        Database Search
      </h1>

      <Suspense
        fallback={
          <p className="mt-10 text-center text-slate-500">
            Loading search parameters...
          </p>
        }
      >
        {params.then(({ code }) => (
          <CardDetails initialCode={code} />
        ))}
      </Suspense>
    </main>
  );
}
