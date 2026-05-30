"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { portalUser, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!portalUser?.id) {
      router.replace("/login");
    }
  }, [loading, portalUser, router]);

  if (loading || !portalUser?.id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-uaf-muted">
        <p className="text-sm text-gray-500">Checking session...</p>
      </div>
    );
  }

  return <>{children}</>;
}
