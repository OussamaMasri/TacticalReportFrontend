export function FeedCardSkeleton() {
  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2 flex-1">
          <div className="h-6 w-3/4 rounded bg-slate-200" />
          <div className="flex flex-wrap items-center gap-2">
            <div className="h-5 w-20 rounded-full bg-slate-100" />
            <div className="h-4 w-24 rounded bg-slate-100" />
          </div>
        </div>
        <div className="h-5 w-20 rounded bg-slate-200" />
      </div>

      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-slate-100" />
        <div className="h-4 w-5/6 rounded bg-slate-100" />
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="h-6 w-16 rounded-full bg-blue-50/50" />
        <div className="h-6 w-20 rounded-full bg-blue-50/50" />
        <div className="h-6 w-14 rounded-full bg-blue-50/50" />
      </div>
    </div>
  );
}
