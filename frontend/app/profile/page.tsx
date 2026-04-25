"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/AuthProvider";
import { updateUserProfile } from "@/lib/api";
import Navbar from "@/components/Navbar";

export default function ProfilePage() {
    const { user, updateUser, logout } = useAuth();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [bio, setBio] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [status, setStatus] = useState<{ msg: string; type: "success" | "error" } | null>(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            setFullName(user.fullName);
            setEmail(user.email);
            setBio(user.bio || "");
            setProfilePicture(user.profilePicture || "");
        }
    }, [user]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        if ((email !== user.email || password) && !confirm("Save these account changes?")) return;

        setLoading(true);
        try {
            const updated = await updateUserProfile(user.id, { fullName, bio, profilePicture, email, password });
            updateUser(updated);
            setPassword("");
            setStatus({ msg: "Information saved successfully", type: "success" });
            setTimeout(() => setStatus(null), 3000);
        } catch (err: any) {
            setStatus({ msg: err.message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicture(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    if (!user) return <div className="min-h-screen bg-slate-950 flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-950">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-20">
                <div className="glass rounded-[3rem] p-10 border border-white/5 grid md:grid-cols-3 gap-12">

                    <div className="flex flex-col items-center">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-slate-900 shadow-2xl relative">
                                {profilePicture ? (
                                    <img src={profilePicture} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-slate-800 flex items-center justify-center text-5xl font-black text-slate-700">
                                        {user.fullName.charAt(0)}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Change Photo</span>
                                </div>
                            </div>
                            <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                        </div>

                        <h2 className="text-2xl font-black italic uppercase tracking-tighter mt-6 text-center">{fullName}</h2>
                        <div className="mt-2 px-4 py-1.5 rounded-full bg-slate-900 border border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-400">
                            {user.role === "ROLE_ADMIN" ? "Administrator" : "Citizen"}
                        </div>

                        <button onClick={logout} className="mt-12 text-slate-600 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors">
                            Logout
                        </button>
                    </div>

                    <div className="md:col-span-2 space-y-8">
                        <div>
                            <h1 className="text-3xl font-black italic uppercase tracking-tighter gradient-text">My Profile</h1>
                            <p className="text-slate-500 text-sm mt-1 font-medium">Update your name, email, and password below.</p>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-slate-600 ml-2">Full Name</label>
                                    <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required className="w-full bg-slate-900/50 border border-slate-900 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-sky-500 transition-all text-sm" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-slate-600 ml-2">Email Address</label>
                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-slate-900/50 border border-slate-900 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-sky-500 transition-all text-sm" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-slate-600 ml-2">New Password (Optional)</label>
                                <input type="password" placeholder="Leave blank if you don't want to change it" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-900/50 border border-slate-900 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-sky-500 transition-all text-sm" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-slate-600 ml-2">About Me</label>
                                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="w-full bg-slate-900/50 border border-slate-900 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-sky-500 transition-all" placeholder="Enter a brief bio..." />
                            </div>

                            {status && (
                                <div className={`p-4 rounded-xl text-center text-[10px] font-black uppercase tracking-widest ${status.type === "success" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>
                                    {status.msg}
                                </div>
                            )}

                            <button type="submit" disabled={loading} className="w-full py-5 rounded-3xl bg-white text-black font-black uppercase tracking-[0.3em] shadow-xl hover:scale-[1.01] transition-all disabled:opacity-50 text-xs">
                                {loading ? "SAVING..." : "SAVE CHANGES"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
