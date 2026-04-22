"use client";

import { useState } from "react";
import { COURIERS } from "@/lib/binderbyte";

export default function TrackingPage() {
  const [awb, setAwb] = useState("");
  const [courier, setCourier] = useState("jne");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!awb) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/shipping/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ awb, courier }),
      });

      const data = await res.json();
      if (data.success && data.data.status === 200) {
        setResult(data.data.data);
      } else {
        setError(data.error || data.data?.message || "Nomor resi tidak ditemukan atau belum terupdate.");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat melacak paket.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tighter mb-2 italic">TRACK ORDER</h1>
          <p className="text-[10px] tracking-[0.4em] uppercase text-neutral-500">Track your shipment in real-time</p>
        </div>

        <div className="bg-neutral-900/50 border border-neutral-800 p-8 backdrop-blur-sm">
          <form onSubmit={handleTrack} className="space-y-6">
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 block mb-3">Nomor Resi (AWB)</label>
              <input
                type="text"
                value={awb}
                onChange={(e) => setAwb(e.target.value)}
                placeholder="Masukkan No. Resi..."
                className="w-full bg-black border border-neutral-800 focus:border-white transition-colors px-4 py-4 text-sm font-medium tracking-wide outline-none placeholder:text-neutral-700 uppercase"
                required
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 block mb-3">Kurir</label>
              <select
                value={courier}
                onChange={(e) => setCourier(e.target.value)}
                className="w-full bg-black border border-neutral-800 focus:border-white transition-colors px-4 py-4 text-sm font-bold tracking-widest uppercase outline-none"
              >
                {COURIERS.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-4 text-xs font-black tracking-[0.3em] uppercase hover:bg-neutral-200 transition-all disabled:opacity-50"
            >
              {loading ? "SEARCHING..." : "TRACK NOW"}
            </button>
          </form>

          {error && (
            <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center uppercase tracking-widest">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-end mb-6 border-b border-neutral-800 pb-4">
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Status</p>
                  <p className="text-xl font-bold italic text-white uppercase">{result.summary?.status}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Courier</p>
                  <p className="text-sm font-bold uppercase">{result.summary?.courier}</p>
                </div>
              </div>

              <div className="space-y-8">
                {result.history?.map((step: any, idx: number) => (
                  <div key={idx} className="relative pl-6 border-l border-neutral-800 pb-8 last:pb-0">
                    <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 bg-white rounded-full ring-4 ring-black" />
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">{step.date}</p>
                    <p className="text-xs text-neutral-200 leading-relaxed uppercase">{step.description}</p>
                    {step.location && (
                      <p className="text-[10px] text-neutral-500 mt-1 uppercase">📍 {step.location}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
