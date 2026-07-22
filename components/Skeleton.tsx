export const SkeletonCard = () => (
  <div className="overflow-hidden rounded-[20px] border border-slate-200/80 bg-white/90 shadow-[0_18px_45px_-20px_rgba(15,23,42,0.28)]">
    <div className="h-1 w-full bg-linear-to-r from-slate-200 via-slate-300 to-slate-200" />
    <div className="px-4 pt-4 pb-3">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="h-6 flex-1 animate-pulse rounded-full bg-slate-200" />
        <div className="flex items-center gap-1">
          <div className="h-7 w-7 animate-pulse rounded-full bg-slate-200" />
          <div className="h-7 w-7 animate-pulse rounded-full bg-slate-200" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-24 animate-pulse rounded-2xl bg-slate-200" />
        <div className="h-4 w-3/4 animate-pulse rounded-full bg-slate-200" />
        <div className="h-4 w-1/2 animate-pulse rounded-full bg-slate-200" />
      </div>
      <div className="mt-3 flex gap-2">
        <div className="h-6 w-12 animate-pulse rounded-full bg-slate-200" />
        <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" />
      </div>
    </div>
    <div className="px-4 pb-4">
      <div className="h-10 w-full animate-pulse rounded-2xl bg-slate-200" />
    </div>
  </div>
);

export const SkeletonIntro = () => (
  <div className="space-y-6 animate-pulse">
    <div className="mx-auto flex max-w-2xl flex-col items-center space-y-3 text-center">
      <div className="h-8 w-64 rounded-full bg-slate-200" />
      <div className="h-4 w-96 rounded-full bg-slate-200" />
    </div>
    <div className="flex justify-center gap-4">
      <div className="h-12 w-32 rounded-full bg-slate-200" />
      <div className="h-12 w-40 rounded-full bg-slate-200" />
    </div>
  </div>
);

export function MainPageSkeleton() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
      <SkeletonIntro />
      <section className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </section>
    </main>
  );
}
