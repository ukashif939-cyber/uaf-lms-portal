"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type Message = {
    id: string;
    role: 'user' | 'ai';
    text: string;
};

const SUGGESTED_PROMPTS = [
    "Explain my grade drop",
    "Recommend courses",
    "Attendance improvement tips"
];

export function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 'init', role: 'ai', text: "Hello! I'm your UAF Academic Assistant. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);
    const idRef = useRef(1);

    const nextId = () => {
        const id = idRef.current;
        idRef.current += 1;
        return `msg-${id}`;
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = (textOverride?: string) => {
        const textToSend = textOverride || input;
        if (!textToSend.trim()) return;

        const userMsg: Message = { id: nextId(), role: 'user', text: textToSend };
        setMessages(prev => [...prev, userMsg]);
        setInput("");

        // Mock AI Response
        setTimeout(() => {
            let responseText = "I'm processing your request based on your academic records...";
            const lowerInput = textToSend.toLowerCase();

            if (lowerInput.includes("grade")) {
                responseText = "I see your GPA is 3.1. To improve, focus on 'Data Structures'. You missed 2 assignments which impacted your grade deeply.";
            } else if (lowerInput.includes("attendance")) {
                responseText = "Your attendance is 86%. Keeping it above 90% typically correlates with a 0.5 GPA increase.";
            } else if (lowerInput.includes("course")) {
                responseText = "Based on your interest in Mathematics, I recommend 'Advanced Calculus' and 'Numerical Analysis' for next semester.";
            }

            setMessages(prev => [...prev, { id: nextId(), role: 'ai', text: responseText }]);
        }, 1000);
    };

    return (
        <>
            {/* Toggle Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-uaf-green text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:bg-green-800 transition-colors"
            >
                {isOpen ? <X size={24} /> : <Bot size={28} />}
            </motion.button>

            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 right-6 w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-uaf-green p-4 flex items-center gap-3 text-white">
                            <div className="bg-white/20 p-2 rounded-full">
                                <Bot size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">UAF AI Assistant</h3>
                                <p className="text-xs text-green-100 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    Online
                                </p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" ref={scrollRef}>
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        "max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed",
                                        msg.role === 'user'
                                            ? "bg-uaf-green text-white ml-auto rounded-tr-none"
                                            : "bg-white text-gray-800 border border-gray-200 mr-auto rounded-tl-none shadow-sm"
                                    )}
                                >
                                    {msg.text}
                                </div>
                            ))}
                        </div>

                        {/* Suggested Prompts */}
                        {messages.length < 3 && (
                            <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
                                {SUGGESTED_PROMPTS.map(prompt => (
                                    <button
                                        key={prompt}
                                        onClick={() => handleSend(prompt)}
                                        className="text-xs bg-white border border-uaf-accent text-uaf-dark px-3 py-1.5 rounded-full whitespace-nowrap hover:bg-uaf-accent/10 transition-colors"
                                    >
                                        <Sparkles size={10} className="inline mr-1 text-uaf-accent" />
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask about grades, schedule..."
                                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-uaf-green outline-none"
                            />
                            <Button size="icon" className="rounded-full w-10 h-10 shrink-0" onClick={() => handleSend()}>
                                <Send size={18} />
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
