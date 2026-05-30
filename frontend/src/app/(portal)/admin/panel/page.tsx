"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Users,
    Activity,
    GraduationCap,
    Award,
    Search,
    Download,
    Upload,
    Plus,
    Filter,
    Edit,
    Trash2
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useRef } from "react";

export default function AdminPanelPage() {
    type AdminUserRow = {
        id: string;
        name: string;
        regId: string;
        email: string;
        dept: string;
        role: "Student" | "Faculty";
        status: "Demo" | "Display only" | "Active" | "Inactive";
        isDemo: boolean;
    };

    const mapUser = (u: Record<string, unknown>): AdminUserRow => {
        const isDemo = Boolean(u.isDemo);
        const isActive = u.isActive !== false;
        let status: AdminUserRow["status"] = "Inactive";
        if (isDemo && isActive) status = "Demo";
        else if (!isActive) status = "Display only";
        else if (isActive) status = "Active";

        return {
            id: String(u.id ?? ""),
            name: (u.name as string) || "Unknown",
            regId: (u.regId as string) || "-",
            email: (u.email as string) || "-",
            dept: (u.dept as string) || "N/A",
            role: ((u.role || "STUDENT").toString().toLowerCase() === "student" ? "Student" : "Faculty"),
            status,
            isDemo,
        };
    };
    const [users, setUsers] = useState<AdminUserRow[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("All Roles");
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setError("");
                const data = await apiFetch("/api/admin/users");
                setUsers(Array.isArray(data) ? data.map(mapUser) : []);
            } catch {
                setError("Unable to load users.");
            }
        };
        loadUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        return users.filter((u) => {
            const q = searchTerm.toLowerCase();
            const matchesSearch =
                !q ||
                u.name.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q) ||
                String(u.regId).toLowerCase().includes(q);
            const matchesRole = roleFilter === "All Roles" || u.role === roleFilter;
            return matchesSearch && matchesRole;
        });
    }, [users, searchTerm, roleFilter]);

    const refreshUsers = async () => {
        const data = await apiFetch("/api/admin/users");
        setUsers(Array.isArray(data) ? data.map(mapUser) : []);
    };

    const handleAddUser = async () => {
        const email = prompt("Enter new user email");
        if (!email) return;
        const firstName = prompt("First name", "New") || "New";
        const lastName = prompt("Last name", "User") || "User";
        const role = (prompt("Role: STUDENT or TEACHER", "STUDENT") || "STUDENT").toUpperCase();
        const department = prompt("Department", "Computer Science") || "Computer Science";
        const registrationId = prompt("Registration ID", `TMP-${Date.now()}`) || `TMP-${Date.now()}`;
        try {
            await apiFetch("/api/admin/users", {
                method: "POST",
                body: JSON.stringify({
                    email,
                    firstName,
                    lastName,
                    role,
                    department,
                    registrationId,
                    password: role === "ADMIN" ? "admin" : "password123",
                }),
            });
            await refreshUsers();
        } catch {
            alert("Failed to add user.");
        }
    };

    const handleEdit = async (user: AdminUserRow) => {
        const firstName = prompt("Update first name", user.name.split(" ")[0] || "User");
        if (!firstName) return;
        const lastName = prompt("Update last name", user.name.split(" ").slice(1).join(" ") || "User") || "User";
        const department = prompt("Update department", user.dept) || user.dept;
        const role = prompt("Update role: STUDENT or TEACHER", user.role === "Student" ? "STUDENT" : "TEACHER") || "STUDENT";
        try {
            await apiFetch(`/api/admin/users/${user.id}`, {
                method: "PUT",
                body: JSON.stringify({ firstName, lastName, department, role }),
            });
            await refreshUsers();
        } catch {
            alert("Failed to update user.");
        }
    };

    const handleDelete = async (user: AdminUserRow) => {
        if (!confirm(`Delete ${user.name}?`)) return;
        try {
            await apiFetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
            await refreshUsers();
        } catch {
            alert("Failed to delete user.");
        }
    };

    const parseCsvRows = (text: string) => {
        const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
        if (lines.length < 2) return [];
        const headers = lines[0].split(",").map((h) => h.trim());
        return lines.slice(1).map((line) => {
            const values = line.split(",").map((v) => v.trim());
            const row: Record<string, string> = {};
            headers.forEach((h, idx) => {
                row[h] = values[idx] || "";
            });
            return row;
        });
    };

    const handleImportCsv = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        try {
            const text = await file.text();
            const rows = parseCsvRows(text);
            if (!rows.length) {
                alert("CSV appears empty.");
                return;
            }
            const result = await apiFetch("/api/admin/users/import", {
                method: "POST",
                body: JSON.stringify({ rows }),
            });
            alert(`Imported ${result.created || 0} users`);
            await refreshUsers();
        } catch {
            alert("CSV import failed.");
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage users and system settings</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 bg-white text-gray-700 border-gray-300 hover:bg-gray-50" onClick={() => fileInputRef.current?.click()}>
                        <Upload size={16} /> Import CSV
                    </Button>
                    <Button className="gap-2 bg-uaf-green hover:bg-green-800 text-white" onClick={handleAddUser}>
                        <Plus size={16} /> Add User
                    </Button>
                </div>
            </div>
            <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleImportCsv} />
            {error && <p className="text-sm text-red-600">{error}</p>}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Students */}
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                        <Users size={20} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-500">Total Students</span>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-bold text-blue-600">{users.filter((u) => u.role === "Student").length}</h3>
                                    <p className="text-xs text-green-600 font-medium">+12% this month</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Active This Week */}
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 bg-green-50 rounded-lg text-uaf-green">
                                        <Activity size={20} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-500">Active This Week</span>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-bold text-uaf-green">{users.length}</h3>
                                    <p className="text-xs text-gray-400">86% engagement</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Faculty Members */}
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                        <GraduationCap size={20} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-500">Faculty Members</span>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-bold text-purple-600">{users.filter((u) => u.role !== "Student").length}</h3>
                                    <p className="text-xs text-gray-400">Across all departments</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Average GPA */}
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                                        <Award size={20} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-500">Average GPA</span>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-bold text-orange-600">3.2</h3>
                                    <p className="text-xs text-gray-400">University-wide</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Actions */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, email, or registration ID..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-uaf-green focus:ring-1 focus:ring-uaf-green"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative">
                        <select className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg text-sm focus:outline-none focus:border-uaf-green cursor-pointer hover:bg-gray-50" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                            <option>All Roles</option>
                            <option>Student</option>
                            <option>Faculty</option>
                            <option>Admin</option>
                        </select>
                        <Filter className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={16} />
                    </div>
                    <Button variant="outline" className="gap-2 text-gray-600 border-gray-300" onClick={() => alert(`Exported ${filteredUsers.length} users`)}>
                        <Download size={16} /> Export
                    </Button>
                </div>
            </div>

            {/* Users Table */}
            <Card className="border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Name</th>
                                <th className="px-6 py-4 font-semibold">Reg ID</th>
                                <th className="px-6 py-4 font-semibold">Email</th>
                                <th className="px-6 py-4 font-semibold">Department</th>
                                <th className="px-6 py-4 font-semibold">Role</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="bg-white hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white
                                                ${Number(String(user.id).replace(/\D/g, "")) % 3 === 0 ? 'bg-purple-600' : 'bg-uaf-green'}
                                            `}>
                                                {user.name.charAt(0)}
                                            </div>
                                            <span className="font-medium text-gray-900">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">{user.regId}</td>
                                    <td className="px-6 py-4 text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 text-gray-900">{user.dept}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border
                                            ${user.role === 'Student'
                                                ? 'bg-blue-50 text-blue-700 border-blue-100'
                                                : 'bg-purple-50 text-purple-700 border-purple-100'}
                                        `}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                                            ${user.status === 'Demo'
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                : user.status === 'Display only'
                                                ? 'bg-gray-100 text-gray-600 border-gray-200'
                                                : user.status === 'Active'
                                                ? 'bg-green-50 text-green-700 border-green-100'
                                                : 'bg-red-50 text-red-700 border-red-100'}
                                        `}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${
                                                user.status === 'Demo' ? 'bg-emerald-600'
                                                : user.status === 'Display only' ? 'bg-gray-400'
                                                : user.status === 'Active' ? 'bg-green-600' : 'bg-red-600'
                                            }`}></span>
                                            {user.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" onClick={() => handleEdit(user)}>
                                                <Edit size={16} />
                                            </button>
                                            <button className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors" onClick={() => handleDelete(user)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
