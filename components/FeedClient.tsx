"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { FeedCard } from "@/components/FeedCard";
import { fetchFeed, fetchUsers } from "@/lib/api";
import { isAuthenticated, logout } from "@/lib/auth";
import type { FeedItem, User } from "@/lib/api";

const CATEGORIES = ["Defense", "Energy", "Politics"];

export function FeedClient() {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [showSignals, setShowSignals] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
    }
  }, [router]);

  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000,
  });

  const effectiveUserId = selectedUser ?? users?.[0]?.id ?? null;

  const {
    data: feed,
    isFetching: feedLoading,
    error: feedError,
  } = useQuery<{ items: FeedItem[]; total: number }>({
    queryKey: ["feed", effectiveUserId, page, pageSize, category],
    queryFn: async () => {
      if (!effectiveUserId) return { items: [], total: 0 };
      const res = await fetchFeed({
        userId: effectiveUserId,
        page,
        pageSize,
        category,
      });
      return { items: res.items, total: res.total };
    },
    enabled: !!effectiveUserId,
    placeholderData: (prev) => prev,
    staleTime: 60 * 1000,
  });

  const items: FeedItem[] = feed?.items ?? [];
  const total = feed?.total ?? 0;


  const totalPages = useMemo(() => Math.max(Math.ceil(total / pageSize), 1), [total, pageSize]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-900">Personalized Feed</h1>
          <p className="text-sm text-slate-600">Multi-signal ranking with explainability.</p>
        </div>
        <button
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-800" htmlFor="user">
              User
            </label>
            <select
              id="user"
              className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              value={selectedUser ?? users?.[0]?.id ?? ""}
              onChange={(e) => {
                setSelectedUser(e.target.value);
                setPage(1);
              }}
            >
              {users?.map((u) => (
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
              onChange={(e) => {
                setCategory(e.target.value || null);
                setPage(1);
              }}
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
              onClick={() => setShowSignals((s) => !s)}
            >
              {showSignals ? "Hide breakdown" : "Show breakdown"}
            </button>
          </div>
        </div>
      </div>

      {(usersError || feedError) && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">Failed to load data.</div>
      )}
      {(usersLoading || feedLoading) && <div className="text-sm text-slate-600">Loading feed...</div>}

      <div className="space-y-4">
        {items.map((item: FeedItem) => (
          <FeedCard key={item.id} item={item} showSignals={showSignals} />
        ))}
        {!feedLoading && items.length === 0 && <div className="text-sm text-slate-600">No items found.</div>}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-700">
        <div>
          Page {page} of {totalPages} ({total} items)
        </div>
        <div className="flex gap-2">
          <button
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <button
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
}
