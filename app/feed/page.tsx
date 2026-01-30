import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { FeedClient } from "@/components/FeedClient";
import { fetchFeed, fetchUsers } from "@/lib/api";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { User } from "@/lib/api";

export default async function FeedPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const users = queryClient.getQueryData<User[]>(["users"]);
  const defaultUserId = users?.[0]?.id;

  if (defaultUserId) {
    await queryClient.prefetchQuery({
      queryKey: ["feed", defaultUserId, 1, DEFAULT_PAGE_SIZE, null],
      queryFn: () =>
        fetchFeed({
          userId: defaultUserId,
          page: 1,
          pageSize: DEFAULT_PAGE_SIZE,
          category: null,
        }),
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FeedClient />
    </HydrationBoundary>
  );
}
