"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { fetchStats } from "@/lib/api";

export default function HomePage() {
  const [stats, setStats] = useState({
    agents: "...",
    resolved: "...",
    aiAccuracy: "...",
    responseTime: "..."
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchStats();
        if (data) {
          setStats({
            agents: data.agents?.toString() || "0",
            resolved: data.resolved?.toString() || "0",
            aiAccuracy: data.aiAccuracy ? data.aiAccuracy.toFixed(1) + "%" : "99.0%",
            responseTime: data.responseTime || "0.0m"
          });
        }
      } catch (err) {
        console.error("Failed to fetch live stats", err);
      }
    }
    loadStats();
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 overflow-hidden">
      <Navbar />

      <div className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] -z-10 animate-pulse delay-700"></div>

        <div className="inline-flex items-center gap-2 bg-slate-900 border border-white/5 px-4 py-2 rounded-full mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Live Infrastructure Monitoring</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none mb-8 text-white">
          Guardians of <br />
          <span className="gradient-text">The Urban Future</span>
        </h1>

        <p className="text-slate-500 text-lg md:text-xl max-w-2xl font-medium leading-relaxed mb-12">
          Empowering citizens with AI-driven incident reporting and real-time city-wide monitoring.
          The smarter way to manage local public emergencies.
        </p>

        <div className="flex flex-col sm:flex-row gap-6">
          <Link href="/report" className="px-12 py-5 bg-white text-black font-black uppercase text-xs tracking-[0.3em] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl">
            Submit Report
          </Link>
          <Link href="/feed" className="px-12 py-5 bg-slate-900 text-white font-black uppercase text-xs tracking-[0.3em] rounded-2xl border border-white/5 hover:bg-slate-800 transition-all">
            Browse Feed
          </Link>
        </div>

        {/* LIVE STATS SECTION */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-5xl">
          <StatBox label="Active Personnel" value={stats.agents} />
          <StatBox label="Resolved Tasks" value={stats.resolved} />
          <StatBox label="System Accuracy" value={stats.aiAccuracy} />
          <StatBox label="Response Metrics" value={stats.responseTime} />
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass p-10 rounded-[2rem] border border-white/5 hover:border-white/10 transition-all hover:scale-105">
      <p className="text-4xl font-black uppercase tracking-tighter text-white mb-2 italic">{value}</p>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 leading-none">{label}</p>
    </div>
  );
}
