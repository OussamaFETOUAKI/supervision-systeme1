"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { fetchIncidents, Incident } from "@/lib/api";

export default function FeedPage() {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadIncidents();
    }, []);

    async function loadIncidents() {
        try {
            const data = await fetchIncidents();
            setIncidents(data);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-950">
            <Navbar />

            <div className="max-w-5xl mx-auto px-4 py-16">
                <div className="mb-12 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter gradient-text">City Live Feed</h1>
                        <p className="text-slate-500 font-medium">Real-time incident stream from all citizen agents.</p>
                    </div>
                    <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Global Live</span>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-slate-700 animate-pulse font-black uppercase tracking-widest">Connecting to network...</div>
                ) : (
                    <div className="grid gap-8">
                        {incidents.map((incident) => (
                            <IncidentCard key={incident.id} incident={incident} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function IncidentCard({ incident }: { incident: Incident }) {
    return (
        <div className="glass rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-sky-500/20 transition-all group shadow-2xl">
            <div className="flex flex-col md:flex-row">
                {incident.imageUrl && (
                    <div className="md:w-72 h-56 md:h-auto shrink-0 overflow-hidden">
                        <img src={incident.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" />
                    </div>
                )}
                <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-white font-black text-2xl uppercase tracking-tighter italic leading-tight">{incident.title}</h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-900 border border-white/10">
                                        {incident.creator?.profilePicture && <img src={incident.creator.profilePicture} className="w-full h-full object-cover" />}
                                    </div>
                                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{incident.creator?.fullName || "Anonymous Agent"}</span>
                                </div>
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg ${incident.urgency === 'Très urgent' ? 'bg-red-600' : 'bg-slate-800 text-slate-400'
                                }`}>{incident.urgency}</span>
                        </div>
                        <p className="text-slate-500 text-sm mb-8 font-medium leading-relaxed">{incident.description}</p>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-black text-slate-700 uppercase tracking-widest border-t border-white/5 pt-5">
                        <span className="flex items-center gap-2 truncate max-w-[250px]">
                            <span className="text-sky-500">📍</span> {incident.location.split(',')[0]}
                        </span>
                        <span>🕒 {new Date(incident.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
