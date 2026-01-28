const USERNAME = "demo";
const PASSWORD = "tacticalreport";
const STORAGE_KEY = "tr_session";

export function login(username: string, password: string): boolean {
  const valid = username === USERNAME && password === PASSWORD;
  if (valid) {
    window.localStorage.setItem(STORAGE_KEY, "authenticated");
  }
  return valid;
}

export function logout() {
  window.localStorage.removeItem(STORAGE_KEY);
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEY) === "authenticated";
}
