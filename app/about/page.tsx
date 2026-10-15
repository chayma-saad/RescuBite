import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Leaf, BarChart2, Globe, Heart, Zap, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-12">
        {/* Hero */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Leaf size={32} style={{ color: "var(--color-accent)" }} />
            <span className="text-4xl font-bold" style={{ color: "var(--color-primary)", fontFamily: "Fraunces, serif" }}>RescuBite</span>
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "Fraunces, serif", color: "var(--color-text)" }}>
            Fighting food waste,<br />one bite at a time.
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            RescuBite is an AI-powered platform built in Tunisia to help restaurants reduce food waste,
            consumers eat well for less, and communities access nutritious meals.
          </p>
        </div>

        {/* The problem */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "Fraunces, serif", color: "var(--color-text)" }}>The Problem</h2>
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            {[
              { value: "1/3", label: "of all food produced globally is wasted" },
              { value: "30%", label: "of restaurant food never gets eaten" },
              { value: "8–10%", label: "of global greenhouse gas emissions from food waste" },
            ].map((s) => (
              <div key={s.label} className="text-center p-4 rounded-xl" style={{ background: "#fde8e8" }}>
                <div className="text-3xl font-bold" style={{ fontFamily: "Fraunces, serif", color: "var(--color-danger)" }}>{s.value}</div>
                <div className="text-xs mt-1" style={{ color: "var(--color-text-secondary)" }}>{s.label}</div>
              </div>
            ))}
          </div>
          <p style={{ color: "var(--color-text-secondary)" }}>
            In Tunisia alone, thousands of kilograms of restaurant food are discarded every day — food that could feed families,
            generate revenue, and reduce carbon emissions. The gap between preparation and demand is a solvable problem.
          </p>
        </div>

        {/* Our approach */}
        <div>
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "Fraunces, serif", color: "var(--color-text)" }}>Our Approach</h2>
          <div className="space-y-4">
            {[
              { icon: BarChart2, title: "Predict", desc: "Our AI engine uses historical sales data, day-of-week patterns, and weather conditions to predict daily demand with high accuracy.", color: "#3D5A3D" },
              { icon: Zap, title: "Rescue", desc: "When surplus occurs, restaurants create Rescue Bags at 50–70% discount. Nearby consumers discover and reserve them before the pickup window closes.", color: "#E07856" },
              { icon: Heart, title: "Redistribute", desc: "Unclaimed bags are offered to partner NGOs — Resto du Cœur and Banque Alimentaire de Tunisie — ensuring nothing goes to waste.", color: "#4A7C4E" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="card p-5 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}15` }}>
                    <Icon size={22} style={{ color: s.color }} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1" style={{ fontFamily: "Fraunces, serif", color: "var(--color-text)" }}>{s.title}</h3>
                    <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team / CTA */}
        <div className="text-center card p-8 animated-gradient">
          <Users size={32} className="mx-auto mb-4 text-white" />
          <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "Fraunces, serif" }}>Built for Tunisia, scalable everywhere</h2>
          <p className="text-white/80 mb-6">
            RescuBite started as a hackathon project with a simple belief: the technology to end restaurant food waste exists —
            what&apos;s needed is a platform that connects the dots.
          </p>
          <Link href="/auth/signup" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold" style={{ background: "white", color: "var(--color-primary)" }}>
            Join the Movement
          </Link>
        </div>
      </div>
    </div>
  );
}
