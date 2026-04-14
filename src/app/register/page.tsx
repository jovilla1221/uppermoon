import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center px-6 py-24 animate-[fade-up-slide_0.8s_forwards]">
      <div className="w-full max-w-md bg-surface-container-lowest p-8 md:p-12 shadow-light border border-surface-container">
        <h1 className="font-headline italic text-4xl mb-2 text-center">Create Account</h1>
        <p className="font-label text-xs tracking-[0.2em] uppercase text-outline text-center mb-10">Join the UPPERMOON Community</p>

        <form className="space-y-8">
          {/* First & Last Name Input Group */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="font-label text-[0.6875rem] uppercase tracking-widest text-secondary block">
                First Name
              </label>
              <input 
                type="text" 
                id="firstName"
                required
                className="w-full bg-transparent border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors text-on-surface font-body"
                placeholder="First name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="font-label text-[0.6875rem] uppercase tracking-widest text-secondary block">
                Last Name
              </label>
              <input 
                type="text" 
                id="lastName"
                required
                className="w-full bg-transparent border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors text-on-surface font-body"
                placeholder="Last name"
              />
            </div>
          </div>

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
            <label htmlFor="password" className="font-label text-[0.6875rem] uppercase tracking-widest text-secondary block">
              Password
            </label>
            <input 
              type="password" 
              id="password"
              required
              className="w-full bg-transparent border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors text-on-surface font-body"
              placeholder="Create a password"
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className="w-full bg-primary text-on-primary py-5 font-label text-[0.6875rem] font-bold tracking-[0.2em] uppercase hover:bg-primary-container transition-colors mt-4"
          >
            CREATE ACCOUNT
          </button>
        </form>

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
