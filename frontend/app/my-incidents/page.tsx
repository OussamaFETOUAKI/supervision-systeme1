"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import { fetchUserIncidents, updateIncident, deleteIncident, Incident } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";

const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });

function LocationPicker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
    const MapEventsComp = dynamic(() => import("react-leaflet").then(mod => {
        const { useMapEvents } = mod;
        const Component = () => {
            useMapEvents({ click(e: any) { onLocationSelect(e.latlng.lat, e.latlng.lng); } });
            return null;
        };
        return Component;
    }), { ssr: false });
    return <MapEventsComp />;
}

export default function MyIncidentsPage() {
    const { user } = useAuth();
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(true);

    const [editingIncident, setEditingIncident] = useState<Incident | null>(null);
    const [editForm, setEditForm] = useState({
        title: "", description: "", imageUrl: "", location: "",
        latitude: 33.5731, longitude: -7.5898
    });
    const [updating, setUpdating] = useState(false);

    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) { loadUserIncidents(); }
    }, [user]);

    async function loadUserIncidents() {
        if (!user) return;
        try {
            const data = await fetchUserIncidents(user.id);
            setIncidents(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        } catch { console.error("Sync failed"); } finally { setLoading(false); }
    }

    const startEdit = (inc: Incident) => {
        setEditingIncident(inc);
        setEditForm({
            title: inc.title, description: inc.description, imageUrl: inc.imageUrl,
            location: inc.location, latitude: inc.latitude || 33.5731, longitude: inc.longitude || -7.5898
        });
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingIncident) return;
        setUpdating(true);
        try {
            await updateIncident(editingIncident.id, {
                ...editingIncident,
                ...editForm
            });
            setEditingIncident(null);
            loadUserIncidents();
        } catch { alert("Sync failed"); } finally { setUpdating(false); }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.src = reader.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1000;
                    const scale = MAX_WIDTH / img.width;
                    canvas.width = MAX_WIDTH; canvas.height = img.height * scale;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                    setEditForm({ ...editForm, imageUrl: canvas.toDataURL('image/jpeg', 0.6) });
                };
            };
            reader.readAsDataURL(file);
        }
    };

    const startCamera = async () => {
        setIsCameraOpen(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
            if (videoRef.current) videoRef.current.srcObject = stream;
        } catch { setIsCameraOpen(false); }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth; canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(video, 0, 0);
            setEditForm({ ...editForm, imageUrl: canvas.toDataURL("image/jpeg", 0.7) });
            if (video.srcObject) (video.srcObject as MediaStream).getTracks().forEach(t => t.stop());
            setIsCameraOpen(false);
        }
    };

    const updateLocation = async (lat: number, lng: number) => {
        setEditForm(prev => ({ ...prev, latitude: lat, longitude: lng }));
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
            const data = await res.json();
            const locName = data.display_name.split(',').slice(0, 3).join(',');
            setEditForm(prev => ({ ...prev, location: locName || `${lat.toFixed(4)}, ${lng.toFixed(4)}` }));
        } catch { setEditForm(prev => ({ ...prev, location: `${lat.toFixed(4)}, ${lng.toFixed(4)}` })); }
    };

    if (!user) return (
        <div className="min-h-screen bg-slate-950">
            <Navbar />
            <div className="flex flex-col items-center justify-center pt-48 px-4 text-center">
                <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-4">Archive Access Restricted</h1>
                <p className="text-slate-500 max-w-md font-medium mb-10 uppercase tracking-widest text-[10px]">Please identify yourself to view your personnel operation logs.</p>
                <Link href="/login" className="px-12 py-5 bg-white text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:scale-105 transition-all shadow-2xl">
                    Sign In
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 pb-20">
            <Navbar />

            {isCameraOpen && (
                <div className="fixed inset-0 z-[20000] bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-3xl">
                    <video ref={videoRef} autoPlay playsInline className="w-full max-w-2xl rounded-[3rem] border border-white/10" />
                    <div className="flex gap-8 mt-10">
                        <button onClick={capturePhoto} className="w-20 h-20 rounded-full border-8 border-slate-900 bg-white shadow-2xl active:scale-95 transition-transform" />
                        <button onClick={() => {
                            if (videoRef.current?.srcObject) (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
                            setIsCameraOpen(false);
                        }} className="px-8 py-3 rounded-2xl bg-slate-900 text-[10px] font-black uppercase text-white tracking-widest border border-white/5">Abort Capture</button>
                    </div>
                </div>
            )}
            <canvas ref={canvasRef} className="hidden" />

            {editingIncident && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
                    <div className="glass w-full max-w-5xl overflow-hidden rounded-[4rem] border border-white/10 shadow-3xl flex flex-col md:flex-row max-h-[90vh]">
                        <div className="md:w-1/2 p-10 bg-slate-900/50 flex flex-col">
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-6">Evidence Buffer</h2>
                            <div className="flex-1 relative rounded-[2.5rem] overflow-hidden border border-white/5 bg-black/40 group">
                                <img src={editForm.imageUrl} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all gap-4">
                                    <button onClick={startCamera} className="w-48 py-3 bg-sky-500 text-white font-black uppercase text-[10px] tracking-widest rounded-xl">Open Lens</button>
                                    <button onClick={() => fileInputRef.current?.click()} className="w-48 py-3 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl">Import Local</button>
                                </div>
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />

                            <div className="mt-8 space-y-2">
                                <div className="h-40 rounded-3xl overflow-hidden border border-white/5">
                                    <MapContainer center={[editForm.latitude, editForm.longitude]} zoom={15} style={{ height: "100%", width: "100%" }}>
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <Marker position={[editForm.latitude, editForm.longitude]} />
                                        <LocationPicker onLocationSelect={updateLocation} />
                                    </MapContainer>
                                </div>
                                <p className="text-[9px] font-black text-sky-500 uppercase mt-2 px-2 truncate leading-none">TARGET: {editForm.location}</p>
                            </div>
                        </div>

                        <form onSubmit={handleUpdate} className="md:w-1/2 p-10 flex flex-col">
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-8">Metadata</h2>
                            <div className="flex-1 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-600 ml-2">Header</label>
                                    <input type="text" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-sky-500 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-600 ml-2">Description</label>
                                    <textarea rows={6} value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-sky-500 transition-all" />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-8">
                                <button type="submit" disabled={updating} className="flex-1 py-5 rounded-2xl bg-white text-black font-black uppercase text-xs tracking-[0.2em] shadow-2xl transition-all leading-none">
                                    {updating ? "Syncing..." : "Commit Update"}
                                </button>
                                <button type="button" onClick={() => setEditingIncident(null)} className="px-8 py-5 rounded-2xl bg-slate-900 text-slate-600 font-black uppercase text-xs tracking-widest border border-white/5">Abort</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="max-w-5xl mx-auto px-4 py-16">
                <div className="mb-12 flex justify-between items-end gap-6 text-center md:text-left">
                    <div>
                        <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white leading-none">Archives</h1>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px] mt-3">Verified Citizen Contributions Journal</p>
                    </div>
                    <Link href="/report" className="px-10 py-4 bg-white text-black font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-sky-500 hover:text-white transition-all shadow-xl leading-none">
                        Initialize Mission
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-20 font-black uppercase tracking-widest text-slate-800 animate-pulse">Scanning...</div>
                ) : (
                    <div className="grid gap-8">
                        {incidents.map((incident) => (
                            <div key={incident.id} className="glass rounded-[3rem] overflow-hidden border border-white/5 hover:border-white/10 transition-all group p-1.5">
                                <div className="flex flex-col md:flex-row bg-slate-950/20 rounded-[2.5rem] overflow-hidden">
                                    <div className="md:w-64 h-48 md:h-auto shrink-0 overflow-hidden relative">
                                        <img src={incident.imageUrl} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-10 flex-1">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="text-white font-black text-3xl uppercase tracking-tighter italic leading-none mb-3">{incident.title}</h3>
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-3 py-1 bg-slate-900 border border-white/5 text-sky-400 text-[10px] font-black uppercase tracking-widest rounded-lg`}>{incident.status}</span>
                                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Confidence Index: {incident.urgencyScore}%</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => startEdit(incident)}
                                                        className="px-6 py-3 bg-white text-black font-black uppercase text-[9px] tracking-widest rounded-xl hover:bg-sky-500 hover:text-white transition-all shadow-xl active:scale-95 whitespace-nowrap"
                                                    >
                                                        Edit Record
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm("🚨 WARNING: Permanently purge this record from your archives?")) {
                                                                deleteIncident(incident.id).then(() => loadUserIncidents());
                                                            }
                                                        }}
                                                        className="px-6 py-3 bg-red-600/10 border border-red-600/20 text-red-500 font-black uppercase text-[9px] tracking-widest rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-xl active:scale-95"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-slate-500 text-base mb-8 font-medium line-clamp-2 leading-relaxed opacity-80">{incident.description}</p>
                                        <div className="flex items-center justify-between text-[10px] font-black text-slate-700 uppercase tracking-widest pt-6 border-t border-white/5">
                                            <span>TARGET REF: {incident.location.split(',')[0]}</span>
                                            <span>INSTANCE: {new Date(incident.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
