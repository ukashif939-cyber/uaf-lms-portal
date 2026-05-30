"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
    TrendingUp,
    Award,
    FileText,
    Calendar,
    CreditCard,
    BookOpen
} from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function AdminDashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState({ totalStudents: 0, activeThisWeek: 0, avgGpa: "0.0" });
    const [error, setError] = useState("");

    useEffect(() => {
        const loadStats = async () => {
            try {
                setError("");
                const data = await apiFetch("/api/admin/stats");
                setStats({
                    totalStudents: data.totalStudents || 0,
                    activeThisWeek: data.activeThisWeek || 0,
                    avgGpa: data.avgGpa || "0.0",
                });
            } catch {
                setError("Unable to load admin statistics.");
            }
        };
        loadStats();
    }, []);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-gray-500">Overview of system statistics</p>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Students */}
                <Card className="border-none shadow-sm h-32 flex flex-col justify-center">
                    <CardContent className="p-6">
                        <div className="flex gap-4 items-start">
                            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h3 className="text-gray-500 text-sm font-medium">Total Students</h3>
                                <div className="mt-1">
                                    <span className="text-3xl font-bold text-gray-700">{stats.totalStudents}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Active This Week */}
                <Card className="border-none shadow-sm h-32 flex flex-col justify-center">
                    <CardContent className="p-6">
                        <div className="flex gap-4 items-start">
                            <div className="p-3 bg-green-50 rounded-lg text-green-500">
                                <TrendingUp size={20} />
                            </div>
                            <div>
                                <h3 className="text-gray-500 text-sm font-medium">Active This Week</h3>
                                <div className="mt-1">
                                    <span className="text-3xl font-bold text-gray-700">{stats.activeThisWeek}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Average GPA */}
                <Card className="border-none shadow-sm h-32 flex flex-col justify-center">
                    <CardContent className="p-6">
                        <div className="flex gap-4 items-start">
                            <div className="p-3 bg-purple-50 rounded-lg text-purple-500">
                                <Award size={20} />
                            </div>
                            <div>
                                <h3 className="text-gray-500 text-sm font-medium">Average GPA</h3>
                                <div className="mt-1">
                                    <span className="text-3xl font-bold text-gray-700">{stats.avgGpa}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Manage Users */}
                    <Card className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer group" onClick={() => router.push("/admin/panel")}>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-2 border border-uaf-green/20 rounded text-uaf-green group-hover:bg-uaf-green group-hover:text-white transition-colors">
                                <FileText size={24} />
                            </div>
                            <span className="font-medium text-gray-700 group-hover:text-uaf-green">Manage Users</span>
                        </CardContent>
                    </Card>

                    {/* View Reports */}
                    <Card className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer group" onClick={() => router.push("/admin/panel")}>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-2 border border-uaf-green/20 rounded text-uaf-green group-hover:bg-uaf-green group-hover:text-white transition-colors">
                                <Calendar size={24} />
                            </div>
                            <span className="font-medium text-gray-700 group-hover:text-uaf-green">View Reports</span>
                        </CardContent>
                    </Card>

                    {/* Fee Management */}
                    <Card className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer group" onClick={() => router.push("/admin/panel")}>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-2 border border-uaf-green/20 rounded text-uaf-green group-hover:bg-uaf-green group-hover:text-white transition-colors">
                                <CreditCard size={24} />
                            </div>
                            <span className="font-medium text-gray-700 group-hover:text-uaf-green">Fee Management</span>
                        </CardContent>
                    </Card>

                    {/* Analytics */}
                    <Card className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer group" onClick={() => router.push("/admin/panel")}>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-2 border border-uaf-green/20 rounded text-uaf-green group-hover:bg-uaf-green group-hover:text-white transition-colors">
                                <BookOpen size={24} />
                            </div>
                            <span className="font-medium text-gray-700 group-hover:text-uaf-green">Analytics</span>
                        </CardContent>
                    </Card>
                </div>
            </div>

        </div>
    );
}
