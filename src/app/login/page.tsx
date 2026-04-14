import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center px-6 py-24 animate-[fade-up-slide_0.8s_forwards]">
      <div className="w-full max-w-md bg-surface-container-lowest p-8 md:p-12 shadow-light border border-surface-container">
        <h1 className="font-headline italic text-4xl mb-2 text-center">Welcome Back</h1>
        <p className="font-label text-xs tracking-[0.2em] uppercase text-outline text-center mb-10">Access your Uppermoon account</p>

        <form className="space-y-8">
          {/* Email Input */}
          <div className="space-y-2">
            <label htmlFor="email" className="font-label text-[0.6875rem] uppercase tracking-widest text-secondary block">
              Email Address
            </label>
            <input 
              type="email" 
              id="email"
              required
              className="w-full bg-transparent border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors text-on-surface font-body"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Input */}
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
              className="w-full bg-transparent border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors text-on-surface font-body"
              placeholder="Enter your password"
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className="w-full bg-primary text-on-primary py-5 font-label text-[0.6875rem] font-bold tracking-[0.2em] uppercase hover:bg-primary-container transition-colors mt-4"
          >
            SIGN IN
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
