"use client";
import { formatCurrency, timeUntil, discountPercent } from "@/lib/utils";
import { Package, Users, Clock, Trash2 } from "lucide-react";

interface Bag {
  id: string;
  title: string;
  originalPrice: number;
  discountedPrice: number;
  quantity: number;
  remainingQty: number;
  status: string;
  type: string;
  pickupStart: Date;
  pickupEnd: Date;
  reservations: { id: string }[];
}

export function ActiveBags({ bags, restaurantId }: { bags: Bag[]; restaurantId: string }) {
  async function deleteBag(id: string) {
    if (!confirm("Cancel this Rescue Bag?")) return;
    await fetch(`/api/restaurant/bags/${id}`, { method: "DELETE" });
    window.location.reload();
  }

  if (bags.length === 0) {
    return (
      <div className="card p-8 text-center">
        <Package size={40} className="mx-auto mb-4" style={{ color: "var(--color-text-secondary)" }} />
        <p className="font-medium mb-1" style={{ color: "var(--color-text)" }}>No active Rescue Bags</p>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Log surplus on the left to auto-create bags.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold" style={{ fontFamily: "Fraunces, serif", color: "var(--color-text)" }}>Active Rescue Bags</h2>
      {bags.map((bag) => {
        const discount = discountPercent(bag.originalPrice, bag.discountedPrice);
        const reserved = bag.quantity - bag.remainingQty;
        const fillPct = (reserved / bag.quantity) * 100;
        const urgent = new Date(bag.pickupEnd).getTime() - Date.now() < 60 * 60 * 1000;
        return (
          <div key={bag.id} className="card p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>{bag.title}</h3>
                  <span className={`badge ${bag.type === "DONATION" ? "badge-green" : "badge-orange"}`}>
                    {bag.type === "DONATION" ? "Donation" : `${discount}% off`}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                  <span className={urgent ? "timer-urgent" : ""}><Clock size={11} className="inline mr-0.5" />{timeUntil(bag.pickupEnd)} left</span>
                  <span><Users size={11} className="inline mr-0.5" />{reserved}/{bag.quantity} reserved</span>
                </div>
              </div>
              <div className="text-right">
                {bag.type === "SALE" && (
                  <>
                    <div className="text-lg font-bold tabular-nums" style={{ color: "var(--color-primary)", fontFamily: "Fraunces, serif" }}>
                      {formatCurrency(bag.discountedPrice)}
                    </div>
                    <div className="text-xs line-through" style={{ color: "var(--color-text-secondary)" }}>{formatCurrency(bag.originalPrice)}</div>
                  </>
                )}
              </div>
            </div>
            {/* Fill bar */}
            <div className="h-1.5 rounded-full mb-1" style={{ background: "var(--color-bg)" }}>
              <div className="h-1.5 rounded-full transition-all" style={{ width: `${fillPct}%`, background: fillPct > 70 ? "#4A7C4E" : "var(--color-accent)" }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{bag.remainingQty} remaining</span>
              <button onClick={() => deleteBag(bag.id)} className="p-1 rounded hover:bg-red-50 transition-colors">
                <Trash2 size={13} style={{ color: "var(--color-danger)" }} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
