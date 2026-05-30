"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace("/admin/dashboard");
    }, [router]);

    return (
        <div className="min-h-[40vh] flex items-center justify-center text-gray-500">Redirecting to admin dashboard...</div>
    );
}
