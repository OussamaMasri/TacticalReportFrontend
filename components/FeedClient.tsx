"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { FeedCard } from "@/components/FeedCard";
import { FeedCardSkeleton } from "@/components/FeedCardSkeleton";
import { FeedHeader } from "@/components/FeedHeader";
import { FeedFilters } from "@/components/FeedFilters";
import { FeedPagination } from "@/components/FeedPagination";
import { fetchFeed, fetchUsers } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { DEFAULT_PAGE_SIZE, STALE_TIMES } from "@/lib/constants";
import type { FeedItem, User } from "@/lib/api";

export function FeedClient() {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
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
    staleTime: STALE_TIMES.USERS,
  });

  const effectiveUserId = selectedUser ?? users?.[0]?.id ?? null;

  const {
    data: feed,
    isLoading: feedInitialLoading,
    isFetching: feedFetching,
    error: feedError,
  } = useQuery<{ items: FeedItem[]; total: number }>({
    queryKey: ["feed", effectiveUserId, page, DEFAULT_PAGE_SIZE, category],
    queryFn: async () => {
      if (!effectiveUserId) return { items: [], total: 0 };
      const res = await fetchFeed({
        userId: effectiveUserId,
        page,
        pageSize: DEFAULT_PAGE_SIZE,
        category,
      });
      return { items: res.items, total: res.total };
    },
    enabled: !!effectiveUserId,
    placeholderData: (prev) => prev,
    staleTime: STALE_TIMES.FEED,
  });

  const items: FeedItem[] = feed?.items ?? [];
  const total = feed?.total ?? 0;

  const totalPages = useMemo(
    () => Math.max(Math.ceil(total / DEFAULT_PAGE_SIZE), 1),
    [total]
  );

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8">
      <FeedHeader />

      <FeedFilters
        users={users ?? []}
        selectedUser={selectedUser ?? users?.[0]?.id ?? null}
        onUserChange={(userId) => {
          setSelectedUser(userId);
          setPage(1);
        }}
        category={category}
        onCategoryChange={(newCategory) => {
          setCategory(newCategory);
          setPage(1);
        }}
        showSignals={showSignals}
        onToggleSignals={() => setShowSignals((s) => !s)}
      />

      {(usersError || feedError) && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Failed to load data.
        </div>
      )}

      <div className="space-y-4">
        {usersLoading || feedInitialLoading || (feedFetching && items.length === 0) ? (
          Array.from({ length: 5 }).map((_, i) => <FeedCardSkeleton key={i} />)
        ) : (
          <>
            {items.map((item: FeedItem) => (
              <FeedCard key={item.id} item={item} showSignals={showSignals} />
            ))}
            {!feedFetching && items.length === 0 && (
              <div className="text-sm text-slate-600">No items found.</div>
            )}
          </>
        )}
      </div>

      <FeedPagination
        page={page}
        totalPages={totalPages}
        totalItems={total}
        onPageChange={setPage}
      />
    </main>
  );
}
