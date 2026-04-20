"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Login Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal masuk");
      }

      setSuccess("Login berhasil! Mengalihkan...");
      setTimeout(() => {
        router.push(callbackUrl);
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-6 py-24 animate-[fade-up-slide_0.8s_forwards]">
      <div className="w-full max-w-md bg-surface-container-lowest p-8 md:p-12 shadow-light border border-surface-container">
        <h1 className="font-headline italic text-4xl mb-2 text-center">Admin Login</h1>
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
            <label htmlFor="email" className="font-label text-[0.6875rem] uppercase tracking-widest text-secondary block">
              Email Address
            </label>
            <input 
              type="email" 
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors text-on-surface font-body"
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="font-label text-[0.6875rem] uppercase tracking-widest text-secondary block">
                Password
              </label>
              <Link href="#" className="font-label text-[0.625rem] text-secondary hover:text-primary transition-colors underline">
                FORGOT?
              </Link>
            </div>
            <input 
              type="password" 
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors text-on-surface font-body"
              placeholder="Enter your password"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary py-5 font-label text-[0.6875rem] font-bold tracking-[0.2em] uppercase hover:bg-primary-container transition-colors mt-4 disabled:opacity-50"
          >
            {loading ? "PROCESSING..." : "SIGN IN"}
          </button>
        </form>

        <div className="mt-10 text-center border-t border-surface-container pt-8">
          <p className="font-label text-[0.6875rem] tracking-widest uppercase text-secondary">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary font-bold hover:opacity-70 transition-opacity">
              CREATE ONE
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
