"use client";

export type StoredUser = {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
};

/** Local dev → backend :5000. Firebase Hosting → same-origin /api (Cloud Function). */
export function getApiBase(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      if (envUrl && envUrl !== "") return envUrl.replace(/\/$/, "");
      return "http://localhost:5000";
    }
    if (envUrl && envUrl !== "") return envUrl.replace(/\/$/, "");
    return "";
  }

  if (envUrl !== undefined && envUrl !== "") return envUrl.replace(/\/$/, "");
  return "http://localhost:5000";
}

async function readErrorMessage(response: Response): Promise<string> {
  const text = await response.text();
  if (!text) return `Request failed (${response.status})`;
  try {
    const body = JSON.parse(text) as { message?: string };
    if (body.message) return body.message;
  } catch {
    /* not JSON — e.g. Firebase Hosting 404 HTML */
  }
  if (text.includes("<!DOCTYPE") || text.includes("<html")) {
    return response.status === 404
      ? "API is not available on this site yet. Use http://localhost:3000 on your laptop, or deploy Cloud Functions (Firebase Blaze plan)."
      : `Server error (${response.status}).`;
  }
  return text.length > 200 ? `${text.slice(0, 200)}…` : text;
}

export function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function setSession(user: StoredUser, token: string) {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
}

export function clearSession() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
}

async function resolveAuthToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  try {
    const { getFirebaseIdToken } = await import("@/lib/firebase");
    const live = await getFirebaseIdToken();
    if (live) return live;
  } catch {
    /* firebase not ready */
  }
  return getStoredToken();
}

export async function apiFetch(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers || {});
  headers.set("Content-Type", headers.get("Content-Type") || "application/json");

  const token = await resolveAuthToken();
  if (token?.startsWith("ey")) {
    headers.set("Authorization", `Bearer ${token}`);
  } else {
    const user = getStoredUser();
    if (user?.id) headers.set("x-user-id", user.id);
  }

  const base = getApiBase();
  let response: Response;
  try {
    response = await fetch(`${base}${path}`, { ...init, headers });
  } catch {
    throw new Error(
      base.includes("localhost")
        ? "Cannot reach the API. Start the backend: cd backend && npm run dev"
        : "Cannot reach the server. Check your internet connection."
    );
  }

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return response.json();
  return response.text();
}
