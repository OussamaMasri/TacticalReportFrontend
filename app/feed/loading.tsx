export default function LoadingFeed() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8">
      <div className="space-y-2">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-4 w-64 animate-pulse rounded-lg bg-slate-200" />
      </div>
      <div className="h-28 animate-pulse rounded-xl bg-slate-200" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="h-32 animate-pulse rounded-2xl bg-slate-200" />
        ))}
      </div>
    </main>
  );
}
