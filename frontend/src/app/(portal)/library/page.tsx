"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ExternalLink } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function LibraryPage() {
    type Resource = { id: string; title: string; author: string; type: string; link?: string };
    const [resources, setResources] = useState<Resource[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadLibrary = async () => {
            try {
                setError("");
                const data = await apiFetch("/api/library");
                setResources(Array.isArray(data) ? data : []);
            } catch {
                setError("Unable to fetch library resources.");
            }
        };
        loadLibrary();
    }, []);

    const handleAccess = (resource: Resource) => {
        if (resource.link && resource.link !== "#") {
            window.open(resource.link, "_blank");
            return;
        }
        alert(`Resource selected: ${resource.title}`);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-uaf-green">Digital Library</h1>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {resources.map(res => (
                    <Card key={res.id} className="glass-panel group hover:shadow-lg transition-all">
                        <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                <BookOpen size={32} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 line-clamp-2">{res.title}</h3>
                                <p className="text-sm text-gray-400 mt-1">{res.author}</p>
                            </div>
                            <Button variant="outline" size="sm" className="w-full mt-auto gap-2 group-hover:bg-uaf-green group-hover:text-white group-hover:border-uaf-green" onClick={() => handleAccess(res)}>
                                <ExternalLink size={14} /> Access
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
