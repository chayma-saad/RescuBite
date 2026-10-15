"use client";
import { useState } from "react";
import { Loader2, CheckCircle2, Package, ToggleLeft, ToggleRight } from "lucide-react";
import type { PredictionResult } from "@/lib/prediction";

interface SurplusItem {
  id: string;
  name: string;
  pricePerPortion: number;
  prediction: PredictionResult;
}

interface SurplusEntry {
  menuItemId: string;
  prepared: number;
  sold: number;
}

export function SurplusLogger({ restaurantId, menuItems, weather }: {
  restaurantId: string;
  menuItems: SurplusItem[];
  weather: string;
}) {
  const [entries, setEntries] = useState<Record<string, SurplusEntry>>(
    Object.fromEntries(menuItems.map((item) => [
      item.id,
      { menuItemId: item.id, prepared: item.prediction.recommendedPrepare, sold: 0 },
    ]))
  );
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [bagType, setBagType] = useState<"SALE" | "DONATION">("SALE");
  const [result, setResult] = useState<{ bagsCreated: number; totalSurplus: number } | null>(null);

  function updateEntry(id: string, field: "prepared" | "sold", val: number) {
    setEntries((prev) => ({ ...prev, [id]: { ...prev[id], [field]: Math.max(0, val) } }));
  }

  const surplusItems = menuItems.filter((item) => {
    const entry = entries[item.id];
    return entry && entry.prepared - entry.sold > 0;
  });

  async function handleSubmit() {
    setLoading(true);
    const res = await fetch("/api/restaurant/surplus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurantId, entries: Object.values(entries), bagType, weather }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setDone(true);
      setResult(data);
    }
  }

  if (done && result) {
    return (
      <div className="card p-8 text-center">
        <CheckCircle2 size={48} className="mx-auto mb-4" style={{ color: "#4A7C4E" }} />
        <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "Fraunces, serif", color: "var(--color-text)" }}>
          {result.bagsCreated > 0 ? "Rescue Bags Created!" : "Sales Logged"}
        </h3>
        <p style={{ color: "var(--color-text-secondary)" }}>
          {result.bagsCreated > 0
            ? `${result.bagsCreated} Rescue Bag${result.bagsCreated > 1 ? "s" : ""} created for ${result.totalSurplus} surplus portions.`
            : "No surplus today — great prediction accuracy!"}
        </p>
        <button onClick={() => { setDone(false); setResult(null); }} className="btn-outline mt-4">Log Again</button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="card p-5">
        <h2 className="text-lg font-bold mb-1" style={{ fontFamily: "Fraunces, serif", color: "var(--color-text)" }}>Log End-of-Day Sales</h2>
        <p className="text-xs mb-4" style={{ color: "var(--color-text-secondary)" }}>Enter how many portions were prepared and sold for each item.</p>

        <div className="space-y-3">
          {menuItems.map((item) => {
            const entry = entries[item.id];
            const surplus = entry ? entry.prepared - entry.sold : 0;
            return (
              <div key={item.id} className="p-3 rounded-xl" style={{ background: surplus > 0 ? "#fef0e6" : "var(--color-bg)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: "var(--color-text)" }}>{item.name}</span>
                  {surplus > 0 && <span className="badge badge-orange">{surplus} surplus</span>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: "var(--color-text-secondary)" }}>Prepared</label>
                    <input
                      type="number"
                      min={0}
                      value={entry?.prepared ?? 0}
                      onChange={(e) => updateEntry(item.id, "prepared", parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 rounded-lg border text-sm focus:outline-none tabular-nums"
                      style={{ borderColor: "var(--color-border)", background: "white" }}
                    />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: "var(--color-text-secondary)" }}>Sold</label>
                    <input
                      type="number"
                      min={0}
                      max={entry?.prepared ?? 9999}
                      value={entry?.sold ?? 0}
                      onChange={(e) => updateEntry(item.id, "sold", parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 rounded-lg border text-sm focus:outline-none tabular-nums"
                      style={{ borderColor: "var(--color-border)", background: "white" }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {surplusItems.length > 0 && (
          <div className="mt-4 p-3 rounded-xl" style={{ background: "var(--color-bg)" }}>
            <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-text)" }}>
              Surplus detected for {surplusItems.length} item{surplusItems.length > 1 ? "s" : ""}. How would you like to handle it?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setBagType("SALE")}
                className="flex-1 py-2 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: bagType === "SALE" ? "var(--color-accent)" : "var(--color-surface)",
                  color: bagType === "SALE" ? "white" : "var(--color-text)",
                  border: `1.5px solid ${bagType === "SALE" ? "var(--color-accent)" : "var(--color-border)"}`,
                }}
              >
                <Package size={12} className="inline mr-1" />
                Sell at Discount
              </button>
              <button
                onClick={() => setBagType("DONATION")}
                className="flex-1 py-2 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: bagType === "DONATION" ? "#4A7C4E" : "var(--color-surface)",
                  color: bagType === "DONATION" ? "white" : "var(--color-text)",
                  border: `1.5px solid ${bagType === "DONATION" ? "#4A7C4E" : "var(--color-border)"}`,
                }}
              >
                ❤️ Donate to Charity
              </button>
            </div>
          </div>
        )}

        <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full justify-center mt-4 py-3">
          {loading ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : "Submit & Generate Rescue Bags"}
        </button>
      </div>
    </div>
  );
}
