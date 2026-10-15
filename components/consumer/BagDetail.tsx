"use client";
import { useState } from "react";
import { MapPin, Clock, Phone, ShoppingBag, Heart, CheckCircle2, Loader2, ArrowLeft, ChefHat } from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatTime, discountPercent, timeUntil } from "@/lib/utils";

interface Bag {
  id: string;
  title: string;
  description: string | null;
  originalPrice: number;
  discountedPrice: number;
  quantity: number;
  remainingQty: number;
  status: string;
  type: string;
  pickupStart: string;
  pickupEnd: string;
  imageUrl: string | null;
  restaurant: {
    name: string;
    address: string;
    lat: number;
    lng: number;
    cuisine: string;
    phone: string | null;
    imageUrl: string | null;
  };
}

export function BagDetail({ bag, isLoggedIn, userRole, userId }: {
  bag: Bag;
  isLoggedIn: boolean;
  userRole?: string;
  userId?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [reservation, setReservation] = useState<{ pickupCode: string } | null>(null);
  const [error, setError] = useState("");

  const isDonation = bag.type === "DONATION";
  const discount = discountPercent(bag.originalPrice, bag.discountedPrice);
  const urgent = new Date(bag.pickupEnd).getTime() - Date.now() < 45 * 60 * 1000;
  const available = bag.status === "AVAILABLE" && bag.remainingQty > 0;

  async function handleReserve() {
    if (!isLoggedIn) {
      window.location.href = `/auth/signin?callbackUrl=/bag/${bag.id}`;
      return;
    }
    setLoading(true);
    setError("");
    const endpoint = isDonation ? "/api/charity/claim" : "/api/consumer/reserve";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bagId: bag.id, quantity: 1 }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error ?? "Something went wrong"); return; }
    setReservation({ pickupCode: data.pickupCode });
  }

  if (reservation) {
    return (
      <div className="card p-10 text-center">
        <CheckCircle2 size={56} className="mx-auto mb-4" style={{ color: isDonation ? "#4A7C4E" : "var(--color-accent)" }} />
        <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "Fraunces, serif", color: "var(--color-text)" }}>
          {isDonation ? "Donation Claimed!" : "Reservation Confirmed!"}
        </h2>
        <p className="mb-6" style={{ color: "var(--color-text-secondary)" }}>
          Show this code at <strong>{bag.restaurant.name}</strong>
        </p>
        <div className="inline-block px-8 py-4 rounded-2xl mb-6 border-2 border-dashed" style={{ borderColor: isDonation ? "#4A7C4E" : "var(--color-accent)" }}>
          <p className="text-xs mb-1 font-medium" style={{ color: "var(--color-text-secondary)" }}>PICKUP CODE</p>
          <p className="text-3xl font-bold tracking-widest tabular-nums" style={{ fontFamily: "Fraunces, serif", color: "var(--color-primary)" }}>
            {reservation.pickupCode}
          </p>
        </div>
        <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: "var(--color-bg)" }}>
          <p style={{ color: "var(--color-text-secondary)" }}>
            🕐 Pickup window: <strong style={{ color: "var(--color-text)" }}>{formatTime(bag.pickupStart)} – {formatTime(bag.pickupEnd)}</strong>
          </p>
          <p className="mt-1" style={{ color: "var(--color-text-secondary)" }}>
            📍 {bag.restaurant.address}
          </p>
          {!isDonation && (
            <p className="mt-1 font-medium" style={{ color: "var(--color-text)" }}>
              💳 Pay at pickup: <strong style={{ color: "var(--color-primary)" }}>{formatCurrency(bag.discountedPrice)}</strong>
            </p>
          )}
        </div>
        <Link href="/reservations" className="btn-primary inline-flex">View My Rescues</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/browse" className="inline-flex items-center gap-1.5 text-sm hover:underline" style={{ color: "var(--color-text-secondary)" }}>
        <ArrowLeft size={14} /> Back to browse
      </Link>

      <div className="card overflow-hidden">
        {/* Image */}
        {(bag.imageUrl ?? bag.restaurant.imageUrl) && (
          <div className="h-56 overflow-hidden">
            <img src={bag.imageUrl ?? bag.restaurant.imageUrl ?? ""} alt={bag.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {isDonation ? (
                  <span className="badge badge-green">❤️ Free Donation</span>
                ) : (
                  <span className="badge badge-orange">{discount}% off</span>
                )}
                {urgent && <span className="badge badge-red timer-urgent">⚡ Ending soon</span>}
              </div>
              <h1 className="text-2xl font-bold" style={{ fontFamily: "Fraunces, serif", color: "var(--color-text)" }}>{bag.title}</h1>
            </div>
            {!isDonation && (
              <div className="text-right flex-shrink-0">
                <div className="text-3xl font-bold tabular-nums" style={{ fontFamily: "Fraunces, serif", color: "var(--color-primary)" }}>
                  {formatCurrency(bag.discountedPrice)}
                </div>
                <div className="text-sm line-through" style={{ color: "var(--color-text-secondary)" }}>{formatCurrency(bag.originalPrice)}</div>
              </div>
            )}
          </div>

          {bag.description && <p style={{ color: "var(--color-text-secondary)" }}>{bag.description}</p>}

          {/* Info grid */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: "var(--color-bg)" }}>
              <ChefHat size={16} style={{ color: "var(--color-primary)", marginTop: 1 }} />
              <div>
                <p className="text-xs font-medium" style={{ color: "var(--color-text)" }}>{bag.restaurant.name}</p>
                <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{bag.restaurant.cuisine}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: "var(--color-bg)" }}>
              <MapPin size={16} style={{ color: "var(--color-primary)", marginTop: 1 }} />
              <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{bag.restaurant.address}</p>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: "var(--color-bg)" }}>
              <Clock size={16} style={{ color: "var(--color-primary)", marginTop: 1 }} />
              <div>
                <p className="text-xs font-medium" style={{ color: "var(--color-text)" }}>Pickup window</p>
                <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{formatTime(bag.pickupStart)} – {formatTime(bag.pickupEnd)}</p>
                <p className="text-xs font-medium" style={{ color: urgent ? "var(--color-danger)" : "#4A7C4E" }}>{timeUntil(bag.pickupEnd)} remaining</p>
              </div>
            </div>
            {bag.restaurant.phone && (
              <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: "var(--color-bg)" }}>
                <Phone size={16} style={{ color: "var(--color-primary)", marginTop: 1 }} />
                <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{bag.restaurant.phone}</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            <ShoppingBag size={14} />
            <span><strong style={{ color: bag.remainingQty <= 2 ? "var(--color-danger)" : "var(--color-text)" }}>{bag.remainingQty}</strong> of {bag.quantity} remaining</span>
          </div>

          {error && <div className="p-3 rounded-lg text-sm" style={{ background: "#fde8e8", color: "var(--color-danger)" }}>{error}</div>}

          {available ? (
            <button onClick={handleReserve} disabled={loading} className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${isDonation ? "" : ""}`}
              style={{ background: isDonation ? "#4A7C4E" : "var(--color-accent)", color: "white" }}>
              {loading ? <><Loader2 size={18} className="animate-spin" /> Processing...</> : isDonation ? <><Heart size={18} /> Claim Donation</> : <><ShoppingBag size={18} /> Reserve — Pay at Pickup</>}
            </button>
          ) : (
            <div className="w-full py-3.5 rounded-xl font-semibold text-center text-sm" style={{ background: "var(--color-bg)", color: "var(--color-text-secondary)" }}>
              {bag.remainingQty === 0 ? "Fully Reserved" : "No Longer Available"}
            </div>
          )}

          {!isDonation && <p className="text-xs text-center" style={{ color: "var(--color-text-secondary)" }}>💳 No payment now — pay at the restaurant when you pick up.</p>}
        </div>
      </div>
    </div>
  );
}
