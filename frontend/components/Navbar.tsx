"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";

export default function Navbar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const navLinks = [
        { name: "HOME", path: "/" },
        { name: "REPORT", path: "/report" },
        { name: "CITY FEED", path: "/feed" },
        { name: "MY REPORTS", path: "/my-incidents" },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-[1000] px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* LOGO */}
                <Link href="/" className="group flex items-center gap-4">
                    <div className="h-14 w-14 overflow-hidden rounded-2xl border border-white/10 shadow-2xl relative">
                        <img
                            src="/logo.png"
                            alt="Supervision Logo"
                            className="absolute top-0 left-0 w-full h-[140%] object-cover object-top brightness-110 group-hover:scale-110 transition-all duration-500"
                        />
                    </div>
                    <span className="text-white font-black italic uppercase tracking-tighter text-2xl group-hover:text-sky-400 transition-all duration-300">
                        UrbanEye
                    </span>
                </Link>

                {/* NAVIGATION LINKS */}
                <div className="hidden md:flex items-center gap-8 bg-slate-900/60 backdrop-blur-2xl px-8 py-3 rounded-2xl border border-white/5 shadow-2xl">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            href={link.path}
                            className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-sky-400 ${pathname === link.path ? "text-sky-500" : "text-slate-400"
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* ACTIONS / AUTH */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            {user.role === "ROLE_ADMIN" && (
                                <Link
                                    href="/admin"
                                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-2xl border ${pathname === "/admin"
                                        ? "bg-sky-500 text-white border-sky-400"
                                        : "bg-emerald-600/20 text-emerald-500 border-emerald-500/20 hover:bg-emerald-600 hover:text-white"
                                        }`}
                                >
                                    Supervisor Console
                                </Link>
                            )}
                            <Link href="/profile" className="w-10 h-10 rounded-full border border-white/10 overflow-hidden hover:scale-110 transition-all shadow-2xl">
                                {user.profilePicture ? (
                                    <img src={user.profilePicture} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-slate-800 flex items-center justify-center font-bold text-white text-xs">{user.fullName[0]}</div>
                                )}
                            </Link>
                            <button
                                onClick={logout}
                                className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-red-500 transition-colors"
                            >
                                Exit
                            </button>
                        </>
                    ) : (
                        <Link href="/login" className="px-8 py-3 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:scale-105 transition-all shadow-2xl">
                            Identification
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
