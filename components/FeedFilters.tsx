import { User } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";

type Props = {
  users: User[];
  selectedUser: string | null;
  onUserChange: (userId: string) => void;
  category: string | null;
  onCategoryChange: (category: string | null) => void;
  showSignals: boolean;
  onToggleSignals: () => void;
};

export function FeedFilters({
  users,
  selectedUser,
  onUserChange,
  category,
  onCategoryChange,
  showSignals,
  onToggleSignals,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-800" htmlFor="user">
            User
          </label>
          <select
            id="user"
            className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            value={selectedUser ?? ""}
            onChange={(e) => onUserChange(e.target.value)}
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} — {u.role}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-800" htmlFor="category">
            Category filter
          </label>
          <select
            id="category"
            className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            value={category ?? ""}
            onChange={(e) => onCategoryChange(e.target.value || null)}
          >
            <option value="">All</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-800">Signals</label>
          <button
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100"
            onClick={onToggleSignals}
          >
            {showSignals ? "Hide breakdown" : "Show breakdown"}
          </button>
        </div>
      </div>
    </div>
  );
}
