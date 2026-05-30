"use client";

export type StoredUser = {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
};

function getApiBase() {
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (envUrl !== undefined && envUrl !== "") return envUrl;
  if (typeof window !== "undefined") return "";
  return "http://localhost:5000";
}

const API_BASE = getApiBase();

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

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    let message = `Request failed: ${response.status}`;
    try {
      const body = await response.json();
      message = body.message || message;
    } catch {
      const text = await response.text();
      if (text) message = text;
    }
    throw new Error(message);
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return response.json();
  return response.text();
}
