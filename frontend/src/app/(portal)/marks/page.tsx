"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";

export default function MarksPage() {
    type MarkBreakdown = { type: string; marks: number; total: number };
    type SubjectMarks = { subject: string; total: number; breakdown: MarkBreakdown[] };
    const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
    const [marksData, setMarksData] = useState<SubjectMarks[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadMarks = async () => {
            try {
                setError("");
                const data = await apiFetch("/api/student/marks");
                setMarksData(data?.subjects || []);
            } catch {
                setError("Unable to load marks breakdown.");
            }
        };
        loadMarks();
    }, []);

    const toggleExpand = (subject: string) => {
        setExpandedSubject(expandedSubject === subject ? null : subject);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-uaf-green">Detailed Marks Report</h1>
            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="space-y-4">
                {marksData.map((item, i) => (
                    <Card key={i} className="glass-panel overflow-hidden">
                        <CardHeader
                            className="cursor-pointer hover:bg-gray-50 transition-colors flex flex-row items-center justify-between"
                            onClick={() => toggleExpand(item.subject)}
                        >
                            <div className="flex items-center gap-4 flex-1">
                                <CardTitle className="text-lg">{item.subject}</CardTitle>
                                <span className="text-sm text-gray-500">Total: {item.total}/100</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-uaf-green text-white px-4 py-2 rounded-full font-bold">
                                    {item.total}%
                                </div>
                                {expandedSubject === item.subject ? (
                                    <ChevronUp className="text-gray-400" />
                                ) : (
                                    <ChevronDown className="text-gray-400" />
                                )}
                            </div>
                        </CardHeader>

                        <div className={cn(
                            "transition-all duration-300 overflow-hidden",
                            expandedSubject === item.subject ? "max-h-96" : "max-h-0"
                        )}>
                            <CardContent className="pt-0">
                                <div className="border-t border-gray-100 pt-4">
                                    <table className="w-full text-sm">
                                        <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left">Assessment</th>
                                                <th className="px-4 py-2 text-center">Obtained</th>
                                                <th className="px-4 py-2 text-center">Total</th>
                                                <th className="px-4 py-2 text-right">Percentage</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {item.breakdown.map((mark, j) => (
                                                <tr key={j} className="border-b last:border-0">
                                                    <td className="px-4 py-3 font-medium">{mark.type}</td>
                                                    <td className="px-4 py-3 text-center">{mark.marks}</td>
                                                    <td className="px-4 py-3 text-center">{mark.total}</td>
                                                    <td className="px-4 py-3 text-right">
                                                        <span className={cn(
                                                            "px-2 py-1 rounded text-xs font-bold",
                                                            (mark.marks / mark.total) >= 0.8
                                                                ? "bg-green-100 text-green-700"
                                                                : (mark.marks / mark.total) >= 0.6
                                                                    ? "bg-yellow-100 text-yellow-700"
                                                                    : "bg-red-100 text-red-700"
                                                        )}>
                                                            {Math.round((mark.marks / mark.total) * 100)}%
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
