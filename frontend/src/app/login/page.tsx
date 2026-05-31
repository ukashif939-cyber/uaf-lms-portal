"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Mail, Lock, ShieldCheck, HelpCircle, GraduationCap, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api";
import { signInWithEmailAndPasswordFirebase, signInWithGoogleFirebase, mapFirebaseAuthError } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
    const router = useRouter();
    const { portalUser, loading: authLoading, refreshPortalUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (authLoading) return;
        if (portalUser?.id) {
            router.replace(portalUser.role === "admin" ? "/admin/dashboard" : "/dashboard");
        }
    }, [authLoading, portalUser, router]);

    const finishLogin = (user: { role?: string }, token: string, userObj: Parameters<typeof refreshPortalUser>[0]) => {
        refreshPortalUser(userObj, token);
        router.replace(user.role === "admin" ? "/admin/dashboard" : "/dashboard");
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const normalizedEmail = email.trim().toLowerCase();

        try {
            // Admin: TEST_ACCOUNTS.md — password "admin" (backend auth)
            if (normalizedEmail === "admin@uaf.edu.pk") {
                const data = await apiFetch("/api/auth/login", {
                    method: "POST",
                    body: JSON.stringify({ email: normalizedEmail, password }),
                });
                if (data?.user) {
                    finishLogin(data.user, data.token, data.user);
                }
                return;
            }

            const credential = await signInWithEmailAndPasswordFirebase(normalizedEmail, password);
            const idToken = await credential.user.getIdToken();
            const data = await apiFetch("/api/auth/session", {
                method: "POST",
                body: JSON.stringify({ idToken }),
            });
            if (data?.user) {
                finishLogin(data.user, idToken, data.user);
            }
        } catch (err: unknown) {
            const code = typeof err === "object" && err && "code" in err ? String((err as { code: string }).code) : "";
            if (code.startsWith("auth/")) {
                setError(mapFirebaseAuthError(err));
            } else {
                setError(err instanceof Error ? err.message : "Login failed.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        setError("");
        try {
            const credential = await signInWithGoogleFirebase();
            const idToken = await credential.user.getIdToken();
            const data = await apiFetch("/api/auth/session", {
                method: "POST",
                body: JSON.stringify({ idToken }),
            });
            if (data?.user) {
                finishLogin(data.user, idToken, data.user);
            }
        } catch (err: unknown) {
            const code = typeof err === "object" && err && "code" in err ? String((err as { code: string }).code) : "";
            if (code.startsWith("auth/")) {
                setError(mapFirebaseAuthError(err));
            } else {
                setError(err instanceof Error ? err.message : "Google sign-in failed.");
            }
        } finally {
            setGoogleLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#F8F9FA]">
                <p className="text-sm text-gray-500">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex bg-[#F8F9FA] font-sans">
            <div className={`hidden lg:flex w-[45%] relative overflow-hidden flex-col justify-between p-16 text-white transition-colors duration-500 ${isAdmin ? 'bg-[#0B1A0B]' : 'bg-[#006A33]'}`}>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-[#ffffff10] to-transparent rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative z-10"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                            {isAdmin ? <ShieldCheck className="w-8 h-8 text-white" /> : <GraduationCap className="w-8 h-8 text-white" />}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold uppercase tracking-wider text-white/90">UAF Portal</h3>
                            <p className="text-xs text-white/60 font-medium">University of Agriculture Faisalabad</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    key={isAdmin ? "admin" : "student"}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 max-w-sm"
                >
                    <h1 className="text-4xl font-bold leading-tight mb-6 font-[family-name:var(--font-poppins)]">
                        {isAdmin ? "Administrative" : "Excellence in"} <br />
                        <span className="text-[#FFB000]">{isAdmin ? "Control Panel" : "Education & Research"}</span>
                    </h1>
                    <p className="text-white/70 text-base leading-relaxed mb-8">
                        {isAdmin
                            ? "Secure access for faculty and administration to manage academic records, scheduling, and portal settings."
                            : "The UAF Portal provides secure access to academic resources, grading systems, and administrative tools for students and faculty."
                        }
                    </p>

                    <div className="flex items-center gap-3 text-sm font-medium text-white/80 bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
                        <ShieldCheck className="w-4 h-4 text-[#FFB000]" />
                        <span>Official Secure Login</span>
                    </div>
                </motion.div>

                <div className="relative z-10 text-xs text-white/40">
                    © 2025 University of Agriculture Faisalabad. All Rights Reserved.
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative">
                <div className="absolute top-8 right-8 lg:right-12">
                    <a href="#" className="text-sm font-medium text-gray-500 hover:text-[#006A33] transition-colors flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" /> Help Center
                    </a>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-[440px] bg-white rounded-xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100 p-8 sm:p-12"
                >
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight font-[family-name:var(--font-poppins)]">
                            {isAdmin ? "Admin Login" : "Sign in to your account"}
                        </h2>
                        <p className="text-gray-500 text-sm mt-2">Enter your {isAdmin ? "administrative" : "institutional"} credentials.</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-red-50 text-red-700 text-sm p-4 rounded-lg mb-6 flex items-start gap-3 border-l-4 border-red-500"
                        >
                            <span className="mt-0.5 font-bold">!</span>
                            <span>{error}</span>
                        </motion.div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#006A33] focus:ring-1 focus:ring-[#006A33] transition-all placeholder:text-gray-400 hover:border-gray-300"
                                    placeholder={isAdmin ? "admin@uaf.edu.pk" : "ali.khan@uaf.edu.pk"}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-semibold text-gray-700">Password</label>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#006A33] focus:ring-1 focus:ring-[#006A33] transition-all placeholder:text-gray-400 hover:border-gray-300"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#006A33] focus:ring-[#006A33] transition-all" />
                                <span className="text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
                            </label>
                            <a href="#" className="font-medium text-[#006A33] hover:text-[#005428] hover:underline">Forgot password?</a>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-[#006A33] hover:bg-[#005428] text-white rounded-lg text-sm font-semibold tracking-wide transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 mt-2"
                            disabled={loading}
                        >
                            {loading ? (
                                "Authenticating..."
                            ) : (
                                <>
                                    {isAdmin ? "Access Dashboard" : "Sign In"} <ChevronRight className="w-4 h-4" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-3 text-gray-400 font-medium tracking-wider">Alternate Access</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Button
                            variant="outline"
                            onClick={handleGoogleLogin}
                            disabled={googleLoading || loading}
                            className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg font-medium transition-all flex items-center justify-center gap-3"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                            <span>{googleLoading ? "Signing in with Google..." : "Continue with Google"}</span>
                        </Button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => setIsAdmin(!isAdmin)}
                                className="text-sm font-medium text-gray-500 hover:text-[#006A33] transition-colors"
                            >
                                {isAdmin ? "Are you a student? Switch to Student Login" : "Faculty or Admin? Switch to Admin Login"}
                            </button>
                        </div>

                        <p className="text-xs text-center text-gray-400 pt-2">
                            9 demo accounts · Students: password123 · Admin: admin · Or Continue with Google
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
