"use client";

import { useState } from "react";
import { loginUser, registerUser } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [role, setRole] = useState<"ROLE_USER" | "ROLE_ADMIN">("ROLE_USER");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (isLogin) {
                const user = await loginUser({ email, password });
                login(user);
            } else {
                const user = await registerUser({ email, password, fullName, role });
                login(user); // Auto-login after register
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950">
            <Navbar />

            <div className="flex items-center justify-center pt-20 px-4">
                <div className="glass w-full max-w-md p-8 rounded-[2.5rem] border border-white/5 space-y-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter gradient-text">
                            {isLogin ? "Welcome Back" : "Join SmartCity"}
                        </h1>
                        <p className="text-slate-500 text-sm mt-2 font-medium">
                            {isLogin ? "Enter your credentials to continue" : "Create an account to report incidents"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-black tracking-widest text-slate-600 ml-2">Full Name</label>
                                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-white placeholder:text-slate-700 outline-none focus:border-sky-500 transition-all font-bold" placeholder="John Doe" />
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-black tracking-widest text-slate-600 ml-2">Email Address</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-white placeholder:text-slate-700 outline-none focus:border-sky-500 transition-all font-bold" placeholder="your@email.com" />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-black tracking-widest text-slate-600 ml-2">Password</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-white placeholder:text-slate-700 outline-none focus:border-sky-500 transition-all font-bold" placeholder="••••••••" />
                        </div>

                        {error && <div className="text-red-500 text-xs font-bold text-center animate-shake">{error}</div>}

                        <button type="submit" disabled={loading} className="w-full py-5 rounded-2xl bg-gradient-to-r from-sky-600 to-emerald-600 text-white font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-4">
                            {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
                        </button>
                    </form>

                    <p className="text-center text-slate-600 text-xs font-bold uppercase tracking-widest pt-4">
                        {isLogin ? "New to the city?" : "Already have an account?"}
                        <button onClick={() => setIsLogin(!isLogin)} className="text-sky-500 ml-2 hover:underline">
                            {isLogin ? "Register here" : "Login here"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
