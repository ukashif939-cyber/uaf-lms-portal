"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    CalendarCheck,
    BookOpen,
    CreditCard,
    ArrowRight,
    Calendar,
    FileText,
    Book
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";

export default function DashboardPage() {
    type Activity = { id: number; text: string; time: string; type: string };
    type DashboardStats = { attendance: string; gpa: string; dueFees: string; activity: Activity[] };
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setError("");
                const data = await apiFetch("/api/student/dashboard");
                setStats(data);
            } catch {
                setError("Failed to load dashboard data.");
            }
        };
        loadDashboard();
    }, []);

    const quickLinks = [
        { name: "View Attendance", href: "/attendance", icon: CalendarCheck, color: "text-green-600", bg: "bg-green-100" },
        { name: "Check Grades", href: "/grades", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-100" },
        { name: "Fee Vouchers", href: "/fees", icon: CreditCard, color: "text-orange-600", bg: "bg-orange-100" },
        { name: "Digital Library", href: "/library", icon: Book, color: "text-purple-600", bg: "bg-purple-100" },
    ];

    return (
        <div className="space-y-6 max-w-7xl mx-auto">

            {/* Header Section */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-500">Here&apos;s what&apos;s happening with your academics</p>
            </div>

            {/* Stats Cards */}
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Attendance */}
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                                <FileText size={24} />
                            </div>
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Good</span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">Attendance</h3>
                        <div className="mt-1 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-gray-900">{stats?.attendance || "--"}</span>
                        </div>
                        <Link href="/attendance" className="text-sm text-uaf-green font-medium mt-4 flex items-center gap-1 hover:underline">
                            View Details <ArrowRight size={14} />
                        </Link>
                    </CardContent>
                </Card>

                {/* GPA */}
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-green-50 rounded-lg text-uaf-green">
                                <BookOpen size={24} />
                            </div>
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">On Track</span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">Current GPA</h3>
                        <div className="mt-1 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-gray-900">{stats?.gpa || "--"}</span>
                        </div>
                        <Link href="/grades" className="text-sm text-uaf-green font-medium mt-4 flex items-center gap-1 hover:underline">
                            View Grades <ArrowRight size={14} />
                        </Link>
                    </CardContent>
                </Card>

                {/* Fees */}
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-orange-50 rounded-lg text-orange-500">
                                <CreditCard size={24} />
                            </div>
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">Pending</span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">Due Fees</h3>
                        <div className="mt-1 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-gray-900">{stats?.dueFees || "--"}</span>
                        </div>
                        <Link href="/fees" className="text-sm text-uaf-green font-medium mt-4 flex items-center gap-1 hover:underline">
                            Pay Now <ArrowRight size={14} />
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Quick Links */}
                <Card className="border-none shadow-sm h-full">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold text-gray-800">Quick Links</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-3">
                        {quickLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn("p-2 rounded-lg", link.bg, link.color)}>
                                        <link.icon size={20} />
                                    </div>
                                    <span className="font-medium text-gray-700">{link.name}</span>
                                </div>
                                <ArrowRight size={16} className="text-gray-400 group-hover:text-uaf-green transition-colors" />
                            </Link>
                        ))}
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="border-none shadow-sm h-full">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold text-gray-800">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="space-y-6">
                            {stats?.activity?.map((act) => (
                                <div key={act.id} className="flex items-start gap-4">
                                    <div className="flex items-center justify-center w-3 h-3 mt-1.5 rounded-full bg-uaf-green shadow shrink-0">
                                    </div>
                                    <div className="w-full">
                                        <div className="flex flex-col">
                                            <p className="text-sm font-medium text-gray-800">{act.text}</p>
                                            <span className="text-xs text-gray-400 mt-0.5">{act.time}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {!stats && <p className="text-gray-400 text-sm ml-8">Loading activity...</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Upcoming Deadline Banner */}
            <div className="bg-uaf-green rounded-xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h3 className="font-semibold text-white/90 text-sm uppercase tracking-wide mb-1">Upcoming Deadline</h3>
                    <p className="text-lg font-bold">Software Engineering Project submission due in 3 days</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button className="bg-white text-uaf-green px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors w-full md:w-auto">
                        View Calendar
                    </button>
                    <div className="p-2 bg-white/20 rounded-lg hidden md:block">
                        <Calendar className="text-white" size={24} />
                    </div>
                </div>
            </div>

        </div>
    );
}
