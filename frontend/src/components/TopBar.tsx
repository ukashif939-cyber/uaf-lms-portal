"use client";

import { Bell, LogOut, Settings, KeyRound } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function TopBar() {
    const router = useRouter();
    const { portalUser: user, logout } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const notificationRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setShowProfile(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    const notifications = [
        { id: 1, title: 'New assignment posted in Software Engineering', time: '2 hours ago', status: 'new' },
        { id: 2, title: 'Your fee voucher for Spring 2025 is ready', time: '5 hours ago', status: 'pending' },
        { id: 3, title: 'Attendance updated for Database Systems', time: '1 day ago', status: 'read' }
    ];

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
            {/* Left Welcome Message */}
            <div>
                <h2 className="text-lg font-semibold text-gray-800">
                    Welcome back, <span className="text-uaf-green">{user?.name || "Student"}</span>
                </h2>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                {/* Notification Dropdown */}
                <div className="relative" ref={notificationRef}>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative text-gray-500 hover:text-uaf-green hover:bg-green-50"
                        onClick={() => {
                            setShowNotifications(!showNotifications);
                            setShowProfile(false);
                        }}
                    >
                        <Bell size={20} />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </Button>

                    {/* Notification Dropdown Menu */}
                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                            <div className="p-4 border-b border-gray-100">
                                <h3 className="font-semibold text-gray-800">Notifications</h3>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className="p-4 hover:bg-gray-50 border-b border-gray-50 last:border-0 cursor-pointer transition-colors"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notification.status === 'new' ? 'bg-red-500' :
                                                    notification.status === 'pending' ? 'bg-orange-500' :
                                                        'bg-gray-300'
                                                }`}></div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-800 font-medium">{notification.title}</p>
                                                <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-3 border-t border-gray-100 text-center">
                                <button className="text-sm text-uaf-green font-medium hover:underline" onClick={() => setShowNotifications(false)}>
                                    View all notifications
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-6 w-[1px] bg-gray-200 mx-1"></div>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                    <div
                        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => {
                            setShowProfile(!showProfile);
                            setShowNotifications(false);
                        }}
                    >
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                            {user?.avatar ? (
                                <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                            ) : (
                                <div className="bg-uaf-green text-white w-full h-full flex items-center justify-center text-xs font-bold">
                                    {user?.name ? user.name.charAt(0) : "U"}
                                </div>
                            )}
                        </div>
                        <div className="text-sm font-medium text-gray-700 hidden md:block">
                            {user?.name || "User"}
                        </div>
                    </div>

                    {/* Profile Dropdown Menu */}
                    {showProfile && (
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                            <div className="p-4 border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                                        {user?.avatar ? (
                                            <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="bg-uaf-green text-white w-full h-full flex items-center justify-center text-sm font-bold">
                                                {user?.name ? user.name.charAt(0) : "U"}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-800 text-sm truncate">{user?.name || "User"}</p>
                                        <p className="text-xs text-gray-500 truncate">{user?.email || "user@uaf.edu.pk"}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="py-2">
                                <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors" onClick={() => alert("Profile settings page can be added next.")}>
                                    <Settings size={16} className="text-gray-400" />
                                    Profile Settings
                                </button>
                                <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors" onClick={() => alert("Change password API is not implemented yet.")}>
                                    <KeyRound size={16} className="text-gray-400" />
                                    Change Password
                                </button>
                            </div>
                            <div className="border-t border-gray-100">
                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-medium"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
