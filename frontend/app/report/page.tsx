"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import { createIncident } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
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

export default function ReportPage() {
    const { user } = useAuth();
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [location, setLocation] = useState("");
    const [latitude, setLatitude] = useState<number>(33.5731);
    const [longitude, setLongitude] = useState<number>(-7.5898);

    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState<{ msg: string; type: "success" | "error" } | null>(null);

    const updateLocationFromCoords = async (lat: number, lng: number) => {
        setLatitude(lat); setLongitude(lng);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
            const data = await res.json();
            setLocation(data.display_name.split(',').slice(0, 3).join(',') || `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        } catch { setLocation(`${lat.toFixed(4)}, ${lng.toFixed(4)}`); }
    };

    const startCamera = async () => {
        setIsCameraOpen(true); setImagePreview(null);
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
            const base64 = canvas.toDataURL("image/jpeg", 0.7);
            setImagePreview(base64); setImageUrl(base64);
            if (video.srcObject) (video.srcObject as MediaStream).getTracks().forEach(t => t.stop());
            setIsCameraOpen(false);
        }
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
                    const base64 = canvas.toDataURL('image/jpeg', 0.6);
                    setImagePreview(base64); setImageUrl(base64);
                };
            };
            reader.readAsDataURL(file);
        }
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!user) return;
        setSubmitting(true);
        setStatus(null);
        try {
            const res = await createIncident({ title, description, imageUrl, location, latitude, longitude, creatorId: user.id });

            if (res.urgencyScore >= 90) {
                setStatus({ msg: `SYSTEM ALERT: ${res.assistantMessage}`, type: "error" });
                setTimeout(() => router.push("/my-incidents"), 5000);
            } else {
                setStatus({ msg: "TRANSACTION SUCCESSFUL", type: "success" });
                setTimeout(() => router.push("/my-incidents"), 2000);
            }
        } catch (err: any) {
            if (err.message.includes("Similar incident")) {
                setStatus({ msg: "DUPLICATE ENTRY DETECTED AT THIS LOCATION", type: "error" });
            } else {
                setStatus({ msg: "SUBMISSION FAILED", type: "error" });
            }
        } finally { setSubmitting(false); }
    }

    if (!user) return (
        <div className="min-h-screen bg-slate-950">
            <Navbar />
            <div className="flex flex-col items-center justify-center pt-32 px-4 text-center">
                <h1 className="text-4xl font-black italic uppercase tracking-tighter gradient-text mb-4">Post-Incident Reporting</h1>
                <p className="text-slate-500 max-w-md font-medium mb-10">Access is restricted to verified city agents. Please identify yourself to proceed.</p>
                <Link href="/login" className="px-10 py-4 bg-white text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:scale-105 transition-all">Sign In</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 pb-20">
            <Navbar />

            {isCameraOpen && (
                <div className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center p-4">
                    <video ref={videoRef} autoPlay playsInline className="w-full max-w-3xl rounded-[2.5rem] border border-white/10" />
                    <div className="flex gap-8 mt-10">
                        <button onClick={capturePhoto} className="w-20 h-20 rounded-full border-8 border-slate-900 bg-white shadow-2xl active:scale-90 transition-transform" />
                        <button onClick={() => {
                            if (videoRef.current?.srcObject) (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
                            setIsCameraOpen(false);
                        }} className="px-8 py-3 rounded-2xl bg-slate-900 text-[10px] font-black uppercase tracking-widest text-white">Cancel Alignment</button>
                    </div>
                </div>
            )}
            <canvas ref={canvasRef} className="hidden" />

            <div className="max-w-4xl mx-auto px-4 mt-16">
                <div className="glass rounded-[3rem] p-10 md:p-16 border border-white/5">
                    <div className="mb-12 text-center md:text-left">
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter gradient-text">File New Report</h1>
                        <p className="text-slate-500 font-medium mt-1">Submit visual evidence and location data for system analysis.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-2">Header</label>
                                    <input type="text" placeholder="Instance Title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-sky-500 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-2">Description</label>
                                    <textarea placeholder="Describe incident specifics..." value={description} onChange={e => setDescription(e.target.value)} required rows={4} className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-sky-500 transition-all" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-2">Coordinate Selection</label>
                                <div className="h-64 rounded-3xl overflow-hidden border border-white/5">
                                    <MapContainer center={[latitude, longitude]} zoom={13} style={{ height: "100%", width: "100%" }}>
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <Marker position={[latitude, longitude]} />
                                        <LocationPicker onLocationSelect={updateLocationFromCoords} />
                                    </MapContainer>
                                </div>
                                {location && <p className="text-[9px] text-sky-500 font-black uppercase tracking-tighter px-2 truncate mt-3">Target: {location}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-2">Evidence Buffer</label>
                            {!imagePreview ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <button type="button" onClick={startCamera} className="py-10 rounded-3xl bg-sky-500/10 border border-sky-500/10 text-sky-400 font-black uppercase text-xs tracking-widest hover:bg-sky-500 hover:text-white transition-all">
                                        Open Lens
                                    </button>
                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="py-10 rounded-3xl bg-emerald-500/10 border border-emerald-500/10 text-emerald-400 font-black uppercase text-xs tracking-widest hover:bg-emerald-500 hover:text-white transition-all">
                                        Import Local
                                    </button>
                                </div>
                            ) : (
                                <div className="relative rounded-[2rem] overflow-hidden border border-white/10 aspect-video group">
                                    <img src={imagePreview} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                        <button type="button" onClick={() => { setImagePreview(null); setImageUrl(""); }} className="px-8 py-3 bg-red-500 text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-2xl">Purge Sequence</button>
                                    </div>
                                </div>
                            )}
                            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                        </div>

                        {status && (
                            <div className={`p-4 rounded-xl text-center text-[10px] font-black uppercase tracking-widest ${status.type === "success" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>
                                {status.msg}
                            </div>
                        )}

                        <button type="submit" disabled={submitting || !imageUrl} className="w-full py-6 rounded-[2rem] bg-gradient-to-r from-sky-600 to-emerald-600 text-white font-black uppercase tracking-[0.4em] shadow-2xl hover:scale-[1.01] transition-all disabled:opacity-20 mt-6 leading-none">
                            {submitting ? "Processing Submission..." : "INITIALIZE UPLOAD"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
