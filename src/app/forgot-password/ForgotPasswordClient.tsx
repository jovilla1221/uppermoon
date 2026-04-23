"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordClient() {
  const router = useRouter();

  const [step, setStep] = useState<"email" | "otp" | "new-password">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Email step state
  const [email, setEmail] = useState("");

  // OTP step state
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(0);

  // New password step state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Timer logic for resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Step 1: Request OTP
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mengirim kode verifikasi");
      }

      setStep("otp");
      setTimer(600); // 10 minutes
      setSuccess("Kode verifikasi telah dikirim ke email Anda. Cek juga folder Spam.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) return;

    setStep("new-password");
    setError(null);
    setSuccess(null);
  };

  // Step 3: Submit new password
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Password tidak cocok");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password minimal 8 karakter");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp: otp.join(""),
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // If OTP error, go back to OTP step
        if (res.status === 401 || res.status === 400) {
          setStep("otp");
          setOtp(["", "", "", "", "", ""]);
        }
        throw new Error(data.error || "Gagal mereset password");
      }

      setSuccess("Password berhasil direset! Mengalihkan ke halaman login...");
      setTimeout(() => {
        router.push("/login?reset=success");
      }, 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal");
    } finally {
      setLoading(false);
    }
  };

  // OTP input handlers
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

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

  // Resend OTP
  const resendOtp = async () => {
    if (timer > 0) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Gagal mengirim ulang kode");
      setTimer(600);
      setOtp(["", "", "", "", "", ""]);
      setSuccess("Kode verifikasi baru telah dikirim. Cek juga folder Spam.");
      setTimeout(() => document.getElementById("otp-0")?.focus(), 100);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-6 py-24 animate-[fade-up-slide_0.8s_forwards]">
      <div className="w-full max-w-md bg-surface-container-lowest p-8 md:p-12 shadow-light border border-surface-container">
        <h1 className="font-headline font-bold text-4xl mb-2 text-center">
          {step === "email"
            ? "Reset Password"
            : step === "otp"
            ? "Verify Code"
            : "New Password"}
        </h1>
        <p className="font-label text-xs tracking-[0.2em] uppercase text-outline text-center mb-10">
          {step === "email"
            ? "Enter your email to receive a reset code"
            : step === "otp"
            ? `Enter the code sent to ${email}`
            : "Create your new password"}
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

        {/* STEP 1: Email Input */}
        {step === "email" && (
          <form className="space-y-8" onSubmit={handleEmailSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="reset-email"
                className="font-label text-[0.6875rem] uppercase tracking-widest text-secondary block"
              >
                Email Address
              </label>
              <input
                type="email"
                id="reset-email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors text-on-surface font-body"
                placeholder="Enter your registered email"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary py-5 font-label text-[0.6875rem] font-bold tracking-[0.2em] uppercase hover:bg-primary-container transition-colors mt-4 disabled:opacity-50"
            >
              {loading ? "SENDING..." : "SEND RESET CODE"}
            </button>
          </form>
        )}

        {/* STEP 2: OTP Verification */}
        {step === "otp" && (
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
              VERIFY CODE
            </button>

            <div className="text-center">
              <p className="font-label text-[0.625rem] text-secondary uppercase tracking-widest mb-2">
                Didn&apos;t receive the code?
              </p>
              <button
                type="button"
                onClick={resendOtp}
                disabled={timer > 0 || loading}
                className="text-primary font-bold font-label text-[0.6875rem] uppercase tracking-widest hover:underline disabled:opacity-50"
              >
                {timer > 0
                  ? `Resend in ${Math.floor(timer / 60)}:${(timer % 60)
                      .toString()
                      .padStart(2, "0")}`
                  : "Resend Code"}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: New Password */}
        {step === "new-password" && (
          <form className="space-y-8" onSubmit={handleResetSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="new-password"
                className="font-label text-[0.6875rem] uppercase tracking-widest text-secondary block"
              >
                New Password
              </label>
              <input
                type="password"
                id="new-password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-transparent border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors text-on-surface font-body"
                placeholder="Minimum 8 characters"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirm-password"
                className="font-label text-[0.6875rem] uppercase tracking-widest text-secondary block"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-transparent border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors text-on-surface font-body"
                placeholder="Re-enter your new password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary py-5 font-label text-[0.6875rem] font-bold tracking-[0.2em] uppercase hover:bg-primary-container transition-colors mt-4 disabled:opacity-50"
            >
              {loading ? "RESETTING..." : "RESET PASSWORD"}
            </button>
          </form>
        )}

        {/* Footer: Back to Login */}
        <div className="mt-10 text-center border-t border-surface-container pt-8">
          <p className="font-label text-[0.6875rem] tracking-widest uppercase text-secondary">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-primary font-bold hover:opacity-70 transition-opacity"
            >
              SIGN IN
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
