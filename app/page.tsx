import Link from "next/link";
import { Store, User, Heart, Leaf, BarChart2, Zap, Globe, ChevronRight, Star, ArrowRight } from "lucide-react";
import { ImpactCounter } from "@/components/shared/ImpactCounter";

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Leaf size={24} style={{ color: "var(--color-accent)" }} />
          <span className="text-2xl font-bold" style={{ color: "var(--color-primary)", fontFamily: "Fraunces, serif" }}>RescuBite</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/browse" className="text-sm font-medium hover:underline" style={{ color: "var(--color-text-secondary)" }}>Browse Bags</Link>
          <Link href="/about" className="text-sm font-medium hover:underline" style={{ color: "var(--color-text-secondary)" }}>About</Link>
          <Link href="/auth/signin" className="btn-outline py-2 px-4 text-sm">Sign In</Link>
          <Link href="/auth/signup" className="btn-primary py-2 px-4 text-sm">Get Started</Link>
        </nav>
        <Link href="/auth/signup" className="md:hidden btn-accent py-2 px-4 text-sm">Get Started</Link>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-16 pb-24 max-w-7xl mx-auto text-center">
        {/* Decorative blob */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: "var(--color-accent)" }} />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ background: "var(--color-primary)" }} />

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ background: "#e6f4e7", color: "#2e6b32" }}>
            <Zap size={12} /> AI-Powered Food Rescue Platform
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-none mb-6" style={{ fontFamily: "Fraunces, serif", color: "var(--color-text)" }}>
            Less Waste.<br />
            <span style={{ color: "var(--color-accent)" }}>More Impact.</span>
          </h1>

          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10" style={{ color: "var(--color-text-secondary)", lineHeight: "1.7" }}>
            RescuBite helps Tunisian restaurants predict demand, rescue surplus meals at a discount,
            and redistribute what&apos;s left to communities that need it most.
          </p>

          {/* Role CTAs */}
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
            <Link href="/auth/signup?role=RESTAURANT" className="group card p-6 text-center hover:shadow-md transition-all hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: "#3D5A3D18" }}>
                <Store size={28} style={{ color: "#3D5A3D" }} />
              </div>
              <h3 className="font-bold mb-1" style={{ color: "var(--color-text)", fontFamily: "Fraunces, serif" }}>Restaurant</h3>
              <p className="text-xs mb-4" style={{ color: "var(--color-text-secondary)" }}>Predict demand, reduce waste, earn from surplus</p>
              <span className="btn-primary text-xs py-1.5 px-4 group-hover:shadow-sm">Join as Restaurant <ChevronRight size={12} /></span>
            </Link>

            <Link href="/auth/signup?role=CONSUMER" className="group card p-6 text-center hover:shadow-md transition-all hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: "#E0785618" }}>
                <User size={28} style={{ color: "#E07856" }} />
              </div>
              <h3 className="font-bold mb-1" style={{ color: "var(--color-text)", fontFamily: "Fraunces, serif" }}>Consumer</h3>
              <p className="text-xs mb-4" style={{ color: "var(--color-text-secondary)" }}>Discover great meals nearby at rescue prices</p>
              <span className="btn-accent text-xs py-1.5 px-4">Browse Rescue Bags <ChevronRight size={12} /></span>
            </Link>

            <Link href="/auth/signup?role=CHARITY" className="group card p-6 text-center hover:shadow-md transition-all hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: "#4A7C4E18" }}>
                <Heart size={28} style={{ color: "#4A7C4E" }} />
              </div>
              <h3 className="font-bold mb-1" style={{ color: "var(--color-text)", fontFamily: "Fraunces, serif" }}>Charity / NGO</h3>
              <p className="text-xs mb-4" style={{ color: "var(--color-text-secondary)" }}>Claim donated surplus for your community</p>
              <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-medium" style={{ background: "#4A7C4E18", color: "#4A7C4E" }}>
                Partner with us <ChevronRight size={12} />
              </span>
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            <div className="flex -space-x-2">
              {["#E07856", "#3D5A3D", "#4A7C4E", "#E8A54B"].map((color, i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold" style={{ background: color }}>
                  {["S", "K", "R", "N"][i]}
                </div>
              ))}
            </div>
            <span>Joined by <strong style={{ color: "var(--color-text)" }}>47 restaurants</strong> across Tunisia</span>
            <Star size={14} style={{ color: "#E8A54B" }} fill="#E8A54B" />
            <strong style={{ color: "var(--color-text)" }}>4.9</strong>
          </div>
        </div>
      </section>

      {/* Impact counter */}
      <section className="px-6 py-12" style={{ background: "var(--color-primary)" }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-semibold mb-6 tracking-widest uppercase opacity-60" style={{ color: "#FAF7F2" }}>Platform Impact — Live</p>
          <ImpactCounter />
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold mb-3" style={{ fontFamily: "Fraunces, serif", color: "var(--color-text)" }}>How RescuBite Works</h2>
          <p style={{ color: "var(--color-text-secondary)" }}>Three simple steps. Massive impact.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: BarChart2, step: "01", title: "Predict", color: "#3D5A3D", desc: "Our AI analyzes historical sales, day of week, and weather to forecast exactly how much to prepare — no guesswork, no waste." },
            { icon: Zap, step: "02", title: "Rescue", color: "#E07856", desc: "Leftover meals become Rescue Bags — auto-priced at 50–70% off. Nearby consumers discover and reserve them before the window closes." },
            { icon: Globe, step: "03", title: "Redistribute", color: "#4A7C4E", desc: "Anything unclaimed gets offered to partner charities with one tap. Nothing goes to the bin. Communities get fed." },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="relative">
                <div className="card p-8 h-full hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}15` }}>
                      <Icon size={24} style={{ color: item.color }} />
                    </div>
                    <span className="text-4xl font-bold opacity-10" style={{ fontFamily: "Fraunces, serif", color: item.color }}>{item.step}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "Fraunces, serif", color: "var(--color-text)" }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{item.desc}</p>
                </div>
                {item.step !== "03" && (
                  <div className="hidden md:block absolute top-1/2 -right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--color-bg)" }}>
                    <ArrowRight size={16} style={{ color: "var(--color-text-secondary)" }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature highlight */}
      <section className="px-6 py-16" style={{ background: "var(--color-surface)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ background: "#E0785618", color: "#b35a1f" }}>
                <Zap size={11} /> AI Demand Forecast
              </div>
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "Fraunces, serif", color: "var(--color-text)" }}>
                Your kitchen,<br />powered by intelligence
              </h2>
              <p className="mb-6 leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                RescuBite&apos;s prediction engine factors in your sales history, day of week, seasonal trends,
                and even local weather to give you a confident daily forecast — with transparent explanations.
              </p>
              <ul className="space-y-3">
                {["Predict portion-by-portion demand", "Understand why: see every factor", "Track forecast accuracy over time", "One-click Rescue Bag generation"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm" style={{ color: "var(--color-text)" }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#e6f4e7" }}>
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="#2e6b32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup?role=RESTAURANT" className="btn-primary mt-8 inline-flex">
                Start for free <ArrowRight size={16} />
              </Link>
            </div>
            {/* Mock forecast card */}
            <div className="card p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>Today&apos;s Forecast</h4>
                <span className="badge badge-green">Live</span>
              </div>
              {[
                { name: "Couscous Royal", predicted: 42, prepared: 50, confidence: 87 },
                { name: "Brik à l'Oeuf", predicted: 38, prepared: 40, confidence: 91 },
                { name: "Lablabi", predicted: 28, prepared: 30, confidence: 79 },
              ].map((item) => (
                <div key={item.name} className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium" style={{ color: "var(--color-text)" }}>{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span style={{ color: "var(--color-text-secondary)" }}>Pred: <strong style={{ color: "var(--color-primary)" }}>{item.predicted}</strong></span>
                      <span className="badge badge-green" style={{ fontSize: "0.6rem" }}>{item.confidence}%</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: "var(--color-bg)" }}>
                    <div className="h-2 rounded-full transition-all" style={{ width: `${(item.predicted / item.prepared) * 100}%`, background: "var(--color-primary)" }} />
                  </div>
                </div>
              ))}
              <div className="mt-4 p-3 rounded-xl text-xs" style={{ background: "#fef0e6" }}>
                <p className="font-medium" style={{ color: "#b35a1f" }}>💡 Recommendation: Prepare 4 fewer Couscous Royal today.</p>
                <p className="mt-0.5" style={{ color: "#b35a1f" }}>Forecast is 16% lower than yesterday. Weather: ☁️ Cloudy.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center animated-gradient">
        <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "Fraunces, serif" }}>
          Ready to rescue food?
        </h2>
        <p className="text-white/80 mb-8 max-w-md mx-auto">
          Join restaurants, consumers and charities already making a difference across Tunisia.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/signup" className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm" style={{ background: "white", color: "var(--color-primary)" }}>
            Get Started Free <ArrowRight size={16} />
          </Link>
          <Link href="/browse" className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm border border-white/40 text-white hover:bg-white/10 transition-colors">
            Browse Rescue Bags
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 border-t text-center" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <Leaf size={18} style={{ color: "var(--color-accent)" }} />
          <span className="font-bold" style={{ color: "var(--color-primary)", fontFamily: "Fraunces, serif" }}>RescuBite</span>
        </div>
        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
          © 2025 RescuBite. Built with ❤️ in Tunisia. Fighting food waste, one bag at a time.
        </p>
        <div className="flex justify-center gap-4 mt-3">
          <Link href="/about" className="text-xs hover:underline" style={{ color: "var(--color-text-secondary)" }}>About</Link>
          <Link href="/browse" className="text-xs hover:underline" style={{ color: "var(--color-text-secondary)" }}>Browse</Link>
          <Link href="/auth/signup" className="text-xs hover:underline" style={{ color: "var(--color-text-secondary)" }}>Sign Up</Link>
        </div>
      </footer>
    </div>
  );
}
