"use client";
import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 1247, label: "Meals Rescued", suffix: "", color: "#FAF7F2" },
  { value: 498, label: "kg Food Saved", suffix: "kg", color: "#FAF7F2" },
  { value: 1245, label: "kg CO₂ Avoided", suffix: "kg", color: "#FAF7F2" },
  { value: 47, label: "Partner Restaurants", suffix: "", color: "#FAF7F2" },
];

function useCountUp(target: number, duration = 1500, started: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, started]);

  return count;
}

function Counter({ value, label }: { value: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const count = useCountUp(value, 1800, started);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-bold tabular-nums" style={{ color: "white", fontFamily: "Fraunces, serif" }}>
        {count.toLocaleString()}
      </div>
      <div className="text-sm mt-1 opacity-75" style={{ color: "white" }}>{label}</div>
    </div>
  );
}

export function ImpactCounter() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {STATS.map((s) => (
        <Counter key={s.label} value={s.value} label={s.label} />
      ))}
    </div>
  );
}
