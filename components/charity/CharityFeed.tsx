"use client";
import { useState } from "react";
import { MapPin, Clock, Package, Loader2, CheckCircle2, Heart } from "lucide-react";
import { formatTime, timeUntil } from "@/lib/utils";

interface Donation {
  id: string;
  title: string;
  description: string | null;
  quantity: number;
  remainingQty: number;
  pickupStart: string;
  pickupEnd: string;
  restaurant: { name: string; address: string; lat: number; lng: number; cuisine: string; phone: string | null };
}

function DonationCard({ donation, charityId, onClaim }: {
  donation: Donation;
  charityId?: string;
  onClaim: (id: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [claimed, setClaimed] = useState<string | null>(null);
  const urgent = new Date(donation.pickupEnd).getTime() - Date.now() < 45 * 60 * 1000;

  async function handleClaim() {
    if (!charityId) { window.location.href = "/auth/signin"; return; }
    setLoading(true);
    const res = await fetch("/api/charity/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bagId: donation.id, quantity: donation.remainingQty }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) { setClaimed(data.pickupCode); onClaim(donation.id); }
  }

  if (claimed) {
    return (
      <div className="card p-6 text-center">
        <CheckCircle2 size={40} className="mx-auto mb-3" style={{ color: "#4A7C4E" }} />
        <p className="font-bold mb-2" style={{ fontFamily: "Fraunces, serif", color: "var(--color-text)" }}>Donation Claimed!</p>
        <div className="inline-block px-6 py-3 rounded-xl border-2 border-dashed mb-3" style={{ borderColor: "#4A7C4E" }}>
          <p className="text-xs mb-1" style={{ color: "var(--color-text-secondary)" }}>PICKUP CODE</p>
          <p className="text-2xl font-bold tracking-widest" style={{ fontFamily: "Fraunces, serif", color: "#4A7C4E" }}>{claimed}</p>
        </div>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Show this at <strong>{donation.restaurant.name}</strong></p>
      </div>
    );
  }

  return (
    <div className="card p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-green">❤️ Donation</span>
            {urgent && <span className="badge badge-red timer-urgent">⚡ Soon</span>}
          </div>
          <h3 className="font-semibold" style={{ color: "var(--color-text)" }}>{donation.title}</h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
            <MapPin size={10} className="inline mr-0.5" />{donation.restaurant.name} · {donation.restaurant.address}
          </p>
        </div>
        <div className="text-center flex-shrink-0">
          <div className="text-2xl font-bold tabular-nums" style={{ fontFamily: "Fraunces, serif", color: "#4A7C4E" }}>{donation.remainingQty}</div>
          <div className="text-xs" style={{ color: "var(--color-text-secondary)" }}>portions</div>
        </div>
      </div>

      {donation.description && (
        <p className="text-xs mb-3" style={{ color: "var(--color-text-secondary)" }}>{donation.description}</p>
      )}

      <div className="flex items-center gap-4 mb-4 text-xs" style={{ color: "var(--color-text-secondary)" }}>
        <span><Clock size={11} className="inline mr-0.5" />{formatTime(donation.pickupStart)} – {formatTime(donation.pickupEnd)}</span>
        <span className={urgent ? "timer-urgent font-medium" : ""}>{timeUntil(donation.pickupEnd)} left</span>
        {donation.restaurant.phone && <span>📞 {donation.restaurant.phone}</span>}
      </div>

      <button onClick={handleClaim} disabled={loading} className="w-full py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
        style={{ background: "#4A7C4E", color: "white" }}>
        {loading ? <><Loader2 size={15} className="animate-spin" /> Claiming...</> : <><Heart size={15} /> Claim All {donation.remainingQty} Portions</>}
      </button>
    </div>
  );
}

export function CharityFeed({ donations, charityId }: { donations: Donation[]; charityId?: string }) {
  const [items, setItems] = useState(donations);

  function handleClaim(id: string) {
    setItems((prev) => prev.filter((d) => d.id !== id));
  }

  if (items.length === 0) {
    return (
      <div className="card p-16 text-center">
        <Heart size={48} className="mx-auto mb-4" style={{ color: "var(--color-text-secondary)" }} />
        <p className="font-medium text-lg mb-2" style={{ fontFamily: "Fraunces, serif", color: "var(--color-text)" }}>No donations available right now</p>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Check back later — restaurants post donations throughout the day when they have surplus.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{items.length} donation{items.length !== 1 ? "s" : ""} available now</p>
      {items.map((d) => (
        <DonationCard key={d.id} donation={d} charityId={charityId} onClaim={handleClaim} />
      ))}
    </div>
  );
}
