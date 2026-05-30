"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    CalendarCheck,
    GraduationCap,
    FileText,
    CreditCard,
    Book,
    MessageSquare,
    ChevronLeft,
    ChevronRight,
    LayoutDashboard,
    Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const studentNavItems = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Attendance", href: "/attendance", icon: CalendarCheck },
    { name: "Grades", href: "/grades", icon: GraduationCap },
    { name: "Marks", href: "/marks", icon: FileText },
    { name: "Fee System", href: "/fees", icon: CreditCard },
    { name: "Digital Library", href: "/library", icon: Book },
    { name: "Feedback", href: "/feedback", icon: MessageSquare },
];

const adminNavItems = [
    { name: "Admin Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Admin Panel", href: "/admin/panel", icon: Users },
];

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    // Always start with studentNavItems so server and client render identical HTML
    const [navItems, setNavItems] = useState(studentNavItems);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            const user = storedUser ? JSON.parse(storedUser) : null;
            if (user?.role === "admin") setNavItems(adminNavItems);
        } catch {
            // keep studentNavItems default
        }
    }, []);

    return (
        <aside
            className={cn(
                "h-screen bg-white border-r border-gray-200 text-gray-600 transition-all duration-300 flex flex-col z-50 sticky top-0",
                collapsed ? "w-20" : "w-[260px]"
            )}
        >
            {/* Header / Logo */}
            <div className="h-16 flex items-center px-6 border-b border-gray-100">
                <Link href={navItems === adminNavItems ? "/admin/dashboard" : "/dashboard"} className="flex items-center gap-3">
                    <div className="relative w-8 h-8">
                        <Image src="/uaf-logo.png" alt="UAF Logo" fill className="object-contain" />
                    </div>
                    {!collapsed && (
                        <span className="font-bold text-lg text-uaf-green whitespace-nowrap">UAF LMS</span>
                    )}
                </Link>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-20 bg-white border border-gray-200 text-gray-500 p-1 rounded-full shadow-sm hover:bg-gray-50 transition-colors z-50"
            >
                {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 space-y-1 px-3 custom-scrollbar">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative text-sm font-medium",
                                isActive
                                    ? "bg-uaf-green text-white shadow-sm"
                                    : "hover:bg-green-50 text-gray-600 hover:text-uaf-green"
                            )}
                        >
                            <item.icon size={20} className={cn("min-w-[20px]", isActive ? "text-white" : "text-gray-500 group-hover:text-uaf-green")} />

                            {!collapsed && (
                                <span className="truncate">{item.name}</span>
                            )}

                            {collapsed && (
                                <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none transition-opacity">
                                    {item.name}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Support */}
            <div className="p-4 border-t border-gray-100">
                <div className={cn("bg-gray-50 rounded-lg p-3", collapsed ? "hidden" : "block")}>
                    <p className="text-xs text-gray-500 mb-2">Need help? Contact support at</p>
                    <a href="mailto:support@uaf.edu.pk" className="text-xs font-semibold text-uaf-green hover:underline">
                        support@uaf.edu.pk
                    </a>
                </div>
            </div>
        </aside>
    );
}
