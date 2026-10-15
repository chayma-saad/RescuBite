"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Leaf, Loader2, Store, User, Heart } from "lucide-react";

const ROLES = [
  { value: "RESTAURANT", label: "Restaurant", desc: "Reduce waste, earn from surplus", icon: Store, color: "#3D5A3D" },
  { value: "CONSUMER", label: "Consumer", desc: "Find great deals on rescued meals", icon: User, color: "#E07856" },
  { value: "CHARITY", label: "Charity / NGO", desc: "Claim donated surplus for your community", icon: Heart, color: "#4A7C4E" },
];

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<"role" | "details">("role");
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      router.push("/auth/signin?registered=1");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  if (step === "role") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--color-bg)" }}>
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold" style={{ color: "var(--color-primary)", fontFamily: "Fraunces, serif" }}>
              <Leaf size={28} style={{ color: "var(--color-accent)" }} />
              RescuBite
            </Link>
            <h2 className="mt-4 text-2xl font-bold" style={{ fontFamily: "Fraunces, serif", color: "var(--color-text)" }}>I am a...</h2>
          </div>
          <div className="grid gap-4">
            {ROLES.map((r) => {
              const Icon = r.icon;
              return (
                <button
                  key={r.value}
                  onClick={() => { setRole(r.value); setStep("details"); }}
                  className="card p-5 text-left flex items-center gap-4 hover:shadow-md transition-all hover:scale-[1.01] group"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${r.color}18` }}>
                    <Icon size={24} style={{ color: r.color }} />
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: "var(--color-text)" }}>{r.label}</div>
                    <div className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{r.desc}</div>
                  </div>
                  <svg className="ml-auto w-5 h-5 opacity-30 group-hover:opacity-60 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              );
            })}
          </div>
          <p className="text-center mt-6 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Already have an account?{" "}
            <Link href="/auth/signin" className="font-medium hover:underline" style={{ color: "var(--color-primary)" }}>Sign in</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--color-bg)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold" style={{ color: "var(--color-primary)", fontFamily: "Fraunces, serif" }}>
            <Leaf size={28} style={{ color: "var(--color-accent)" }} />
            RescuBite
          </Link>
          <p className="mt-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>Create your account</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { label: "Full Name", value: name, onChange: setName, type: "text", placeholder: "Your name" },
              { label: "Email", value: email, onChange: setEmail, type: "email", placeholder: "you@example.com" },
              { label: "Password", value: password, onChange: setPassword, type: "password", placeholder: "Min. 8 characters" },
            ].map((field) => (
              <div key={field.label}>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text)" }}>{field.label}</label>
                <input
                  type={field.type}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  required
                  placeholder={field.placeholder}
                  className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-shadow"
                  style={{ borderColor: "var(--color-border)", background: "white" }}
                />
              </div>
            ))}
            {error && <div className="p-3 rounded-lg text-sm" style={{ background: "#fde8e8", color: "var(--color-danger)" }}>{error}</div>}
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Creating account...</> : "Create Account"}
            </button>
          </form>
          <button onClick={() => setStep("role")} className="mt-4 w-full text-sm text-center hover:underline" style={{ color: "var(--color-text-secondary)" }}>
            ← Change role ({role})
          </button>
        </div>
      </div>
    </div>
  );
}
