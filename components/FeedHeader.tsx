import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";

export function FeedHeader() {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
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
  );
}
