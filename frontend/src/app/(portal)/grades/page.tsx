"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    BookOpen,
    TrendingUp,
    Award,
    ChevronDown,
    Eye
} from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function GradesPage() {
    type Course = { code: string; name: string; grade: string; points: number; creditHours: number };
    type GradeData = { semester: string; semesterGPA: string; cumulativeGPA: string; creditHours: number; courses: Course[] };
    const [selectedSemester, setSelectedSemester] = useState("Spring 2025");
    const [gradeData, setGradeData] = useState<GradeData | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadGrades = async () => {
            try {
                setError("");
                const data = await apiFetch("/api/student/grades-enhanced");
                setGradeData(data);
                if (data?.semester) setSelectedSemester(data.semester);
            } catch {
                setError("Unable to load grades.");
            }
        };
        loadGrades();
    }, []);

    const courses = useMemo(() => gradeData?.courses || [], [gradeData]);

    const getGradeColor = (grade: string) => {
        if (grade.startsWith('A')) return "bg-green-100 text-green-700";
        if (grade.startsWith('B')) return "bg-blue-100 text-blue-700";
        if (grade.startsWith('C')) return "bg-yellow-100 text-yellow-700";
        return "bg-red-100 text-red-700";
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-10">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Grade Report</h1>
                <p className="text-gray-500">View your grades and academic performance</p>
            </div>

            {/* Top Stats Row */}
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex gap-4 items-center">
                            <div className="p-3 bg-green-50 rounded-lg text-uaf-green">
                                <BookOpen size={20} />
                            </div>
                            <span className="text-gray-500 font-medium text-sm">Semester GPA</span>
                        </div>
                        <div className="mt-4">
                            <span className="text-4xl font-bold text-uaf-green">{gradeData?.semesterGPA || "0.00"}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex gap-4 items-center">
                            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                                <TrendingUp size={20} />
                            </div>
                            <span className="text-gray-500 font-medium text-sm">Cumulative GPA</span>
                        </div>
                        <div className="mt-4">
                            <span className="text-4xl font-bold text-blue-600">{gradeData?.cumulativeGPA || "0.00"}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex gap-4 items-center">
                            <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
                                <Award size={20} />
                            </div>
                            <span className="text-gray-500 font-medium text-sm">Credit Hours</span>
                        </div>
                        <div className="mt-4">
                            <span className="text-4xl font-bold text-purple-600">{gradeData?.creditHours || 0}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter Section */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <span className="text-sm font-medium text-gray-700">Select Semester:</span>
                <div className="relative">
                    <select
                        className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-uaf-green/20 focus:border-uaf-green text-sm font-medium cursor-pointer"
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                    >
                        <option>Spring 2025</option>
                        <option>Fall 2024</option>
                        <option>Spring 2024</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={16} />
                </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <Card key={course.code} className="border-none shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                        <CardContent className="p-0 flex flex-col h-full">
                            {/* Card Header */}
                            <div className="p-6 pb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-gray-800 line-clamp-1" title={course.name}>{course.name}</h3>
                                        <p className="text-sm text-gray-400 mt-1">{course.code}</p>
                                    </div>
                                    <div className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold ${getGradeColor(course.grade)}`}>
                                        {course.grade}
                                    </div>
                                </div>

                                <div className="mt-6 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">GPA Points:</span>
                                        <span className="font-semibold text-gray-700">{course.points}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Credit Hours:</span>
                                        <span className="font-semibold text-gray-700">{course.creditHours}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Course Grade:</span>
                                        <span className="font-semibold text-gray-700">{course.grade}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card Footer Button */}
                            <div className="mt-auto">
                                    <button className="w-full bg-uaf-green hover:bg-green-800 text-white py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2" onClick={() => alert(`${course.name}: ${course.grade}`)}>
                                    <Eye size={16} /> View Details
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Grade Scale Reference */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Grade Scale Reference</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="font-bold text-gray-800">A</p>
                        <p className="text-xs text-gray-500 mt-1">85-100</p>
                        <p className="text-xs font-semibold text-uaf-green">4.0 GPA</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="font-bold text-gray-800">A-</p>
                        <p className="text-xs text-gray-500 mt-1">80-84</p>
                        <p className="text-xs font-semibold text-uaf-green">3.7 GPA</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="font-bold text-gray-800">B+</p>
                        <p className="text-xs text-gray-500 mt-1">75-79</p>
                        <p className="text-xs font-semibold text-uaf-green">3.3 GPA</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="font-bold text-gray-800">B</p>
                        <p className="text-xs text-gray-500 mt-1">70-74</p>
                        <p className="text-xs font-semibold text-uaf-green">3.0 GPA</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="font-bold text-gray-800">B-</p>
                        <p className="text-xs text-gray-500 mt-1">65-69</p>
                        <p className="text-xs font-semibold text-uaf-green">2.7 GPA</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
