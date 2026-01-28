"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, login } from "@/lib/auth";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/feed");
    }
  }, [router]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(username.trim(), password.trim());
    if (!ok) {
      setError("Invalid credentials. Try demo / tacticalreport.");
      return;
    }
    setError(null);
    router.push("/feed");
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">Login</h1>
        <p className="text-sm text-slate-600">Use demo / tacticalreport to continue.</p>
      </div>
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <label className="block text-sm font-semibold text-slate-800" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="demo"
          autoComplete="username"
          required
        />

        <label className="block text-sm font-semibold text-slate-800" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="tacticalreport"
          autoComplete="current-password"
          required
        />

        {error && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
