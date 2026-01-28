export type Report = {
  id: string;
  title: string;
  category: string;
  tags: string[];
  published_at: string;
};

export type User = {
  id: string;
  name: string;
  role: string;
  focus_categories: string[];
  focus_tags: string[];
};

export type FeedItem = Report & {
  score: number;
  reason: string;
  signals: Record<string, number>;
  why_it_matters?: string;
};

export type FeedResponse = {
  user_id: string;
  page: number;
  page_size: number;
  total: number;
  items: FeedItem[];
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Request failed");
  }
  return res.json();
}

export async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${API_BASE}/api/users`);
  return handle<User[]>(res);
}

export async function fetchReports(): Promise<Report[]> {
  const res = await fetch(`${API_BASE}/api/reports`);
  return handle<Report[]>(res);
}

export async function fetchFeed(params: {
  userId: string;
  page?: number;
  pageSize?: number;
  category?: string | null;
}): Promise<FeedResponse> {
  const search = new URLSearchParams({
    user_id: params.userId,
    page: String(params.page ?? 1),
    page_size: String(params.pageSize ?? 10),
  });
  if (params.category) {
    search.append("category", params.category);
  }
  const res = await fetch(`${API_BASE}/api/feed?${search.toString()}`);
  return handle<FeedResponse>(res);
}
