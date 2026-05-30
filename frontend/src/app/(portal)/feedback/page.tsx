"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Send } from "lucide-react";
import { apiFetch, getStoredUser } from "@/lib/api";

export default function FeedbackPage() {
    type RatingKey = "teaching" | "content" | "facilities" | "support";
    const [ratings, setRatings] = useState({
        teaching: 0,
        content: 0,
        facilities: 0,
        support: 0
    });
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState("");

    const categories: { id: RatingKey; label: string; sub: string }[] = [
        { id: 'teaching', label: 'Teaching Quality', sub: 'Rate the quality of instruction' },
        { id: 'content', label: 'Course Content', sub: 'Relevance and quality of course material' },
        { id: 'facilities', label: 'Facilities', sub: 'Lab equipment and infrastructure' },
        { id: 'support', label: 'Student Support', sub: 'Administrative and academic support' },
    ];

    const handleRate = (category: RatingKey, value: number) => {
        setRatings(prev => ({ ...prev, [category]: value }));
    };

    const handleSubmit = async () => {
        const user = getStoredUser();
        if (!user?.id) {
            setStatus("Login required before submitting feedback.");
            return;
        }
        const avg = Math.round((Object.values(ratings).reduce((a, b) => a + b, 0) / 4) || 0);
        if (avg <= 0) {
            setStatus("Please rate at least one category.");
            return;
        }
        try {
            setSubmitting(true);
            setStatus("");
            await apiFetch("/api/feedback", {
                method: "POST",
                body: JSON.stringify({
                    userId: user.id,
                    rating: avg,
                    text: comment,
                    ratings
                })
            });
            setStatus("Feedback submitted successfully.");
        } catch {
            setStatus("Failed to submit feedback.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Feedback & Survey</h1>
                <p className="text-gray-500">Help us improve by sharing your thoughts and experiences</p>
            </div>

            {/* Rating Section */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-8 space-y-8">
                    <h3 className="text-sm font-semibold text-gray-800">Rate Your Experience</h3>

                    <div className="space-y-6">
                        {categories.map((cat) => (
                            <div key={cat.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                                <div>
                                    <p className="font-medium text-gray-800">{cat.label}</p>
                                    <p className="text-xs text-gray-400 mt-1">{cat.sub}</p>
                                </div>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => handleRate(cat.id, star)}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star
                                                size={24}
                                                className={`${
                                                    star <= ratings[cat.id]
                                                        ? "fill-uaf-accent text-uaf-accent"
                                                        : "text-gray-200"
                                                    } transition-colors`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Comments Section */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-8">
                    <label className="text-sm font-semibold text-gray-800 block mb-4">Additional Comments</label>
                    <textarea
                        className="w-full h-32 p-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-uaf-green/20 focus:border-uaf-green text-sm resize-none"
                        placeholder="Share your thoughts, suggestions, or concerns..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                    <p className="text-xs text-gray-400 mt-3">
                        Your feedback is anonymous and will be used to improve our services.
                    </p>
                </CardContent>
            </Card>

            {/* Quick Questions */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-8 space-y-6">
                    <h3 className="text-sm font-semibold text-gray-800">Quick Questions</h3>

                    {/* NPS */}
                    <div>
                        <p className="text-sm text-gray-700 mb-3">How likely are you to recommend UAF to others?</p>
                        <div className="flex justify-between gap-1 overflow-x-auto pb-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <button key={num} className="min-w-[36px] h-9 flex items-center justify-center border border-gray-200 rounded hover:border-uaf-green hover:text-uaf-green text-xs font-medium transition-colors">
                                    {num}
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>Not likely</span>
                            <span>Very likely</span>
                        </div>
                    </div>

                    {/* Dropdowns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-700">What aspect of UAF do you value most?</label>
                            <select className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-500 focus:outline-none focus:border-uaf-green">
                                <option>Select an option</option>
                                <option>Faculty Quality</option>
                                <option>Campus Facilities</option>
                                <option>Research Opportunities</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-700">What area needs the most improvement?</label>
                            <select className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-500 focus:outline-none focus:border-uaf-green">
                                <option>Select an option</option>
                                <option>Administrative Process</option>
                                <option>Wi-Fi / Internet</option>
                                <option>Cafeteria</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end">
                <Button className="bg-uaf-green hover:bg-green-800 text-white px-8 h-12 text-sm font-medium" onClick={handleSubmit} disabled={submitting}>
                    <Send size={16} className="mr-2" /> {submitting ? "Submitting..." : "Submit Feedback"}
                </Button>
            </div>
            {status && <p className="text-sm text-gray-700">{status}</p>}

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                <h4 className="text-blue-800 font-semibold text-sm mb-3">Why Your Feedback Matters</h4>
                <ul className="space-y-2">
                    <li className="flex gap-2 text-xs text-blue-700">
                        <span className="text-blue-500">•</span> Your input helps us identify areas for improvement
                    </li>
                    <li className="flex gap-2 text-xs text-blue-700">
                        <span className="text-blue-500">•</span> We review all feedback to enhance student experience
                    </li>
                    <li className="flex gap-2 text-xs text-blue-700">
                        <span className="text-blue-500">•</span> Your responses are completely anonymous
                    </li>
                    <li className="flex gap-2 text-xs text-blue-700">
                        <span className="text-blue-500">•</span> Regular surveys help us track progress over time
                    </li>
                </ul>
            </div>
        </div>
    );
}
