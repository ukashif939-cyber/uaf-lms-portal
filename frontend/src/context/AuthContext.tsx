"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { User as FirebaseUser } from "firebase/auth";
import { subscribeToAuthState, signOutFirebase } from "@/lib/firebase";
import { getStoredUser, getStoredToken, StoredUser, clearSession, setSession, apiFetch } from "@/lib/api";

type AuthContextValue = {
  firebaseUser: FirebaseUser | null;
  portalUser: StoredUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshPortalUser: (user: StoredUser, token: string) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function syncPortalSession(firebaseUser: FirebaseUser): Promise<StoredUser | null> {
  const idToken = await firebaseUser.getIdToken();
  const data = await apiFetch("/api/auth/session", {
    method: "POST",
    body: JSON.stringify({ idToken }),
  });
  if (data?.user) {
    setSession(data.user, idToken);
    return data.user;
  }
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [portalUser, setPortalUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored?.id) {
      setPortalUser(stored);
      setLoading(false);
    }

    const unsubscribe = subscribeToAuthState(async (user) => {
      setFirebaseUser(user);

      if (user) {
        const cached = getStoredUser();
        const sameAccount =
          cached?.id &&
          cached.email?.toLowerCase() === user.email?.toLowerCase();

        if (sameAccount) {
          setPortalUser(cached);
        } else {
          try {
            const synced = await syncPortalSession(user);
            setPortalUser(synced);
          } catch {
            clearSession();
            setPortalUser(null);
          }
        }
      } else {
        const cached = getStoredUser();
        const token = getStoredToken();
        const hadFirebaseSession = Boolean(token?.startsWith("ey"));
        if (!cached?.id || hadFirebaseSession) {
          clearSession();
          setPortalUser(null);
        }
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const refreshPortalUser = useCallback((user: StoredUser, token: string) => {
    setSession(user, token);
    setPortalUser(user);
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    clearSession();
    setPortalUser(null);
    await signOutFirebase();
  }, []);

  return (
    <AuthContext.Provider value={{ firebaseUser, portalUser, loading, logout, refreshPortalUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
