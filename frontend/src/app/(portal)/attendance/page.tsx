"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function AttendancePage() {
    type AttendanceRow = { subject: string; total: number; attended: number; percentage: number; semester?: string };
    const [semester, setSemester] = useState("");
    const [data, setData] = useState<AttendanceRow[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadAttendance = async () => {
            try {
                setError("");
                const rows = await apiFetch("/api/student/attendance");
                setData(Array.isArray(rows) ? rows : []);
            } catch {
                setError("Unable to fetch attendance.");
            }
        };
        loadAttendance();
    }, []);

    // Derive unique semesters directly from API data (uses exact DB format e.g. "Fall-2024")
    const semesters = useMemo(
        () => Array.from(new Set(data.map((r) => r.semester).filter(Boolean))).sort().reverse(),
        [data]
    );

    const filteredData = useMemo(
        () => (semester ? data.filter((row) => row.semester === semester) : data),
        [data, semester]
    );

    const handleExport = () => {
        const csv = [
            "Subject,Total Classes,Attended,Percentage",
            ...filteredData.map((r) => `${r.subject},${r.total},${r.attended},${r.percentage}%`)
        ].join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "attendance-report.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-uaf-green">Attendance Report</h1>
                <Button variant="outline" className="gap-2" onClick={handleExport}>
                    <Download size={16} /> Export PDF
                </Button>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}

            <Card className="glass-panel">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Detailed Attendance</CardTitle>
                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-gray-500" />
                        <select
                            className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer"
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                        >
                            <option value="">All Semesters</option>
                            {semesters.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">Subject</th>
                                    <th className="px-6 py-3 text-center">Total Classes</th>
                                    <th className="px-6 py-3 text-center">Attended</th>
                                    <th className="px-6 py-3 text-center">Percentage</th>
                                    <th className="px-6 py-3 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((row, i) => (
                                    <tr key={i} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-uaf-dark">{row.subject}</td>
                                        <td className="px-6 py-4 text-center">{row.total}</td>
                                        <td className="px-6 py-4 text-center">{row.attended}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${row.percentage >= 80 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {row.percentage}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-500">
                                            {row.percentage >= 75 ? "Safe" : "Short Attendance"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
