"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function AdminLoginForm() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal masuk ke dashboard");
      }

      // Check if user is actually an admin
      if (data.role !== "admin" && data.role !== "superadmin") {
        throw new Error("Anda tidak memiliki hak akses admin.");
      }

      await refreshUser();
      setSuccess("Login berhasil! Mengalihkan ke Dashboard...");
      
      setTimeout(() => {
        router.push(callbackUrl.startsWith("/admin") ? callbackUrl : "/admin");
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 md:p-12 shadow-2xl border border-surface-container">
      <div className="flex justify-center mb-8">
        <div className="bg-primary text-on-primary p-4 rounded-full">
          <span className="material-symbols-outlined text-4xl">admin_panel_settings</span>
        </div>
      </div>
      
      <h1 className="font-headline font-bold text-4xl mb-2 text-center text-[#000000]">Admin Login</h1>
      <p className="font-label text-xs tracking-[0.2em] uppercase text-outline text-center mb-10">Access the Dashboard</p>

      {error && (
        <div className="bg-error-container text-on-error-container p-4 mb-8 text-xs font-label uppercase tracking-widest text-center border border-error animate-shake">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-primary-container text-on-primary-container p-4 mb-8 text-xs font-label uppercase tracking-widest text-center border border-primary">
          {success}
        </div>
      )}

      <form className="space-y-8" onSubmit={handleLoginSubmit}>
        <div className="space-y-2">
          <label htmlFor="identifier" className="font-label text-[0.6875rem] uppercase tracking-widest text-secondary block">
            Username or Email
          </label>
          <input 
            type="text" 
            id="identifier"
            required
            autoComplete="username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full bg-transparent border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors text-on-surface font-body"
            placeholder="admin1"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="font-label text-[0.6875rem] uppercase tracking-widest text-secondary block">
            Password
          </label>
          <input 
            type="password" 
            id="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors text-on-surface font-body"
            placeholder="********"
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-on-primary py-5 font-label text-[0.6875rem] font-bold tracking-[0.2em] uppercase hover:bg-black transition-colors mt-4 disabled:opacity-50"
        >
          {loading ? "AUTHENTICATING..." : "LOGIN TO DASHBOARD"}
        </button>
      </form>

      <div className="mt-10 text-center">
        <Link href="/" className="font-label text-[0.625rem] text-secondary hover:text-primary transition-colors uppercase tracking-widest flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Website
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-surface-container-lowest flex items-center justify-center px-6 py-12">
      <Suspense fallback={<div className="text-secondary font-label text-xs uppercase tracking-widest">Loading...</div>}>
        <AdminLoginForm />
      </Suspense>
    </main>
  );
}
