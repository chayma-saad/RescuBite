"use client";
import { useState, FormEvent, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Leaf, Eye, EyeOff, Loader2 } from "lucide-react";

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Invalid email or password. Try the demo credentials below.");
    } else {
      router.push(callbackUrl === "/" ? "/dashboard-redirect" : callbackUrl);
    }
  }

  const demos = [
    { label: "Restaurant", email: "demo@restaurant.com" },
    { label: "Consumer", email: "demo@user.com" },
    { label: "Charity", email: "demo@charity.com" },
  ];

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold" style={{ color: "var(--color-primary)", fontFamily: "Fraunces, serif" }}>
          <Leaf size={28} style={{ color: "var(--color-accent)" }} />
          RescuBite
        </Link>
        <p className="mt-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>Sign in to your account</p>
      </div>

      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text)" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-shadow"
              style={{ borderColor: "var(--color-border)", background: "white", color: "var(--color-text)" }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text)" }}>Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2.5 pr-10 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-shadow"
                style={{ borderColor: "var(--color-border)", background: "white", color: "var(--color-text)" }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-text-secondary)" }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg text-sm" style={{ background: "#fde8e8", color: "var(--color-danger)" }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : "Sign In"}
          </button>
        </form>

        <div className="mt-6">
          <p className="text-xs text-center mb-3" style={{ color: "var(--color-text-secondary)" }}>Demo accounts (password: demo1234)</p>
          <div className="grid grid-cols-3 gap-2">
            {demos.map((d) => (
              <button
                key={d.label}
                type="button"
                onClick={() => { setEmail(d.email); setPassword("demo1234"); }}
                className="px-2 py-2 rounded-lg text-xs font-medium transition-all hover:scale-[1.02]"
                style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)" }}
              >
                <span className="block text-xs font-semibold" style={{ color: "var(--color-text)" }}>{d.label}</span>
                <span className="block text-xs" style={{ color: "var(--color-text-secondary)" }}>Fill demo</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="text-center mt-4 text-sm" style={{ color: "var(--color-text-secondary)" }}>
        No account?{" "}
        <Link href="/auth/signup" className="font-medium hover:underline" style={{ color: "var(--color-primary)" }}>
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--color-bg)" }}>
      <Suspense fallback={<div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--color-primary)" }} />}>
        <SignInForm />
      </Suspense>
    </div>
  );
}
