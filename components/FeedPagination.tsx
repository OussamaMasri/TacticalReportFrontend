type Props = {
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
};

export function FeedPagination({ page, totalPages, totalItems, onPageChange }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-700">
      <div>
        Page {page} of {totalPages} ({totalItems} items)
      </div>
      <div className="flex gap-2">
        <button
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          Previous
        </button>
        <button
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
}
