"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RegisterClient() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [step, setStep] = useState<"register" | "otp" | "expired">("register");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Register Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // OTP State
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(0);

  // Timer logic for resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            // Timer expired — switch to expired state
            setStep("expired");
            setError(null);
            setSuccess(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Pendaftaran gagal");
      }

      setStep("otp");
      setTimer(600); // 10 minutes
      setSuccess("Kode verifikasi telah dikirim ke email Anda. Cek juga folder Spam.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpString }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Verifikasi gagal");
      }

      setSuccess("Verifikasi berhasil! Akun Anda aktif.");
      await refreshUser();
      setTimeout(() => {
        router.push("/"); // Redirect to homepage
        router.refresh();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => document.getElementById("otp-0")?.focus(), 100);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const resendOtp = async () => {
    if (timer > 0) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Gagal mengirim ulang OTP");
      setTimer(600); // 10 minutes
      setStep("otp");
      setOtp(["", "", "", "", "", ""]);
      setSuccess("Kode verifikasi baru telah dikirim. Cek juga folder Spam.");
      setTimeout(() => document.getElementById("otp-0")?.focus(), 100);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-6 py-24 animate-[fade-up-slide_0.8s_forwards]">
      <div className="w-full max-w-md bg-surface-container-lowest p-8 md:p-12 shadow-light border border-surface-container">
        <h1 className="font-headline font-bold text-4xl mb-2 text-center">
          {step === "register" ? "Create Account" : step === "expired" ? "Code Expired" : "Verify Email"}
        </h1>
        <p className="font-label text-xs tracking-[0.2em] uppercase text-outline text-center mb-10">
          {step === "register" 
            ? "Join the UPPERMOON Community" 
            : step === "expired"
            ? "Kode verifikasi sudah kedaluwarsa"
            : `Enter the code sent to ${email}`}
        </p>

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

        {step === "register" ? (
          <form className="space-y-8" onSubmit={handleRegisterSubmit}>
            <div className="space-y-2">
              <label htmlFor="fullName" className="font-label text-[0.6875rem] uppercase tracking-widest text-secondary block">
                Full Name
              </label>
              <input 
                type="text" 
                id="fullName"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-transparent border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors text-on-surface font-body"
                placeholder="Enter your full name"
              />
            </div>

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
              <label htmlFor="password" className="font-label text-[0.6875rem] uppercase tracking-widest text-secondary block">
                Password
              </label>
              <input 
                type="password" 
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors text-on-surface font-body"
                placeholder="Create a password"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary py-5 font-label text-[0.6875rem] font-bold tracking-[0.2em] uppercase hover:bg-primary-container transition-colors mt-4 disabled:opacity-50"
            >
              {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            </button>
          </form>
        ) : step === "otp" ? (
          <form className="space-y-10" onSubmit={handleOtpSubmit}>
            <div className="flex justify-between gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-full h-14 bg-surface-container text-center text-2xl font-headline border-b-2 border-outline-variant focus:border-primary outline-none transition-colors"
                  required
                />
              ))}
            </div>

            <button 
              type="submit"
              disabled={loading || otp.join("").length !== 6}
              className="w-full bg-primary text-on-primary py-5 font-label text-[0.6875rem] font-bold tracking-[0.2em] uppercase hover:bg-primary-container transition-colors disabled:opacity-50"
            >
              {loading ? "VERIFYING..." : "VERIFY CODE"}
            </button>

            <div className="text-center">
              <p className="font-label text-[0.625rem] text-secondary uppercase tracking-widest mb-2">
                Didn't receive the code?
              </p>
              <button
                type="button"
                onClick={resendOtp}
                disabled={timer > 0 || loading}
                className="text-primary font-bold font-label text-[0.6875rem] uppercase tracking-widest hover:underline disabled:opacity-50"
              >
                {timer > 0 
                  ? `Resend in ${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}` 
                  : "Resend Code"}
              </button>
              <button
                type="button"
                onClick={() => setStep("register")}
                className="block w-full mt-6 text-secondary font-label text-[0.625rem] uppercase tracking-widest hover:text-primary"
              >
                Back to Register
              </button>
            </div>
          </form>
        ) : step === "expired" ? (
          <div className="space-y-8 text-center">
            <div className="bg-error-container text-on-error-container p-6 text-xs font-label uppercase tracking-widest border border-error">
              Kode verifikasi sudah kedaluwarsa. Silakan kirim ulang kode baru.
            </div>
            <button
              type="button"
              onClick={resendOtp}
              disabled={loading}
              className="w-full bg-primary text-on-primary py-5 font-label text-[0.6875rem] font-bold tracking-[0.2em] uppercase hover:bg-primary-container transition-colors disabled:opacity-50"
            >
              {loading ? "MENGIRIM..." : "KIRIM ULANG KODE"}
            </button>
            <button
              type="button"
              onClick={() => { setStep("register"); setError(null); setSuccess(null); }}
              className="block w-full text-secondary font-label text-[0.625rem] uppercase tracking-widest hover:text-primary"
            >
              Kembali ke Registrasi
            </button>
          </div>
        ) : null}


        <div className="mt-10 text-center border-t border-surface-container pt-8">
          <p className="font-label text-[0.6875rem] tracking-widest uppercase text-secondary">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-bold hover:opacity-70 transition-opacity">
              SIGN IN
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
