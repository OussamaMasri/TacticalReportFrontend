import { FeedItem } from "@/lib/api";

type Props = {
  item: FeedItem;
  showSignals: boolean;
};

export function FeedCard({ item, showSignals }: Props) {
  const date = new Date(item.published_at).toLocaleDateString("en-GB", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800">
              {item.category}
            </span>
            <span>{date}</span>
          </div>
        </div>
        <div className="text-sm font-semibold text-slate-700">Score: {item.score.toFixed(2)}</div>
      </div>

      <div className="text-sm text-slate-700">
        <span className="font-semibold text-slate-800">Why this:</span> <span className="text-slate-600">{item.reason}</span>
      </div>
      {item.why_it_matters && (
        <div className="text-sm text-slate-700">
          <span className="font-semibold text-slate-800">Why it matters:</span>{" "}
          <span className="text-slate-600">{item.why_it_matters}</span>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <span key={tag} className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            {tag}
          </span>
        ))}
      </div>

      {showSignals && (
        <div className="space-y-2">
          <strong className="text-sm text-slate-800">Signal breakdown</strong>
          <div className="flex flex-wrap gap-2">
            {Object.entries(item.signals).map(([key, value]) => (
              <span key={key} className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {key}: {value}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
