import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Navbar } from "@/components/shared/Navbar";
import { formatCurrency, formatDateTime, timeUntil } from "@/lib/utils";
import Link from "next/link";
import { Clock, MapPin, ShoppingBag, CheckCircle, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ReservationsPage() {
  const session = await auth();
  if (!session) return null;

  const consumer = await prisma.consumer.findUnique({
    where: { userId: session.user.id },
    include: {
      reservations: {
        include: {
          rescueBag: { include: { restaurant: { select: { name: true, address: true } } } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const reservations = consumer?.reservations ?? [];
  const upcoming = reservations.filter((r) => new Date(r.rescueBag.pickupEnd) > new Date());
  const past = reservations.filter((r) => new Date(r.rescueBag.pickupEnd) <= new Date());

  const totalMeals = reservations.reduce((s, r) => s + r.quantity, 0);
  const totalSaved = reservations.reduce((s, r) => s + (r.rescueBag.originalPrice - r.rescueBag.discountedPrice) * r.quantity, 0);
  const co2Avoided = totalMeals * 1.5;

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "Fraunces, serif", color: "var(--color-text)" }}>My Rescues</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>Your upcoming and past food rescues.</p>
        </div>

        {/* Personal impact */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Meals Rescued", value: totalMeals },
            { label: "TND Saved", value: `${totalSaved.toFixed(0)} TND` },
            { label: "kg CO₂ Avoided", value: `${co2Avoided.toFixed(1)} kg` },
          ].map((s) => (
            <div key={s.label} className="card p-4 text-center">
              <div className="text-2xl font-bold tabular-nums" style={{ fontFamily: "Fraunces, serif", color: "var(--color-primary)" }}>{s.value}</div>
              <div className="text-xs mt-1" style={{ color: "var(--color-text-secondary)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Upcoming */}
        <div>
          <h2 className="text-lg font-bold mb-3" style={{ fontFamily: "Fraunces, serif", color: "var(--color-text)" }}>Upcoming Pickups</h2>
          {upcoming.length === 0 ? (
            <div className="card p-8 text-center">
              <ShoppingBag size={36} className="mx-auto mb-3" style={{ color: "var(--color-text-secondary)" }} />
              <p style={{ color: "var(--color-text-secondary)" }}>No upcoming reservations. <Link href="/browse" className="underline" style={{ color: "var(--color-primary)" }}>Browse bags</Link></p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((r) => (
                <div key={r.id} className="card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-semibold" style={{ color: "var(--color-text)" }}>{r.rescueBag.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                        <MapPin size={10} className="inline" /> {r.rescueBag.restaurant.name}
                      </p>
                      <p className="text-xs mt-1" style={{ color: "var(--color-text-secondary)" }}>
                        <Clock size={10} className="inline" /> Pickup by {timeUntil(r.rescueBag.pickupEnd)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="inline-block px-3 py-1.5 rounded-lg border border-dashed" style={{ borderColor: "var(--color-primary)" }}>
                        <p className="text-xs mb-0.5" style={{ color: "var(--color-text-secondary)" }}>Code</p>
                        <p className="font-bold tracking-wider" style={{ color: "var(--color-primary)", fontFamily: "Fraunces, serif" }}>{r.pickupCode}</p>
                      </div>
                    </div>
                  </div>
                  {r.rescueBag.discountedPrice > 0 && (
                    <p className="text-xs mt-2" style={{ color: "var(--color-text-secondary)" }}>
                      💳 Pay at pickup: <strong style={{ color: "var(--color-text)" }}>{formatCurrency(r.rescueBag.discountedPrice)}</strong>
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past */}
        {past.length > 0 && (
          <div>
            <h2 className="text-lg font-bold mb-3" style={{ fontFamily: "Fraunces, serif", color: "var(--color-text)" }}>Past Rescues</h2>
            <div className="space-y-3">
              {past.slice(0, 10).map((r) => (
                <div key={r.id} className="card p-4 opacity-75">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm" style={{ color: "var(--color-text)" }}>{r.rescueBag.title}</p>
                      <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{r.rescueBag.restaurant.name} · {formatDateTime(r.createdAt)}</p>
                    </div>
                    <CheckCircle size={18} style={{ color: "#4A7C4E" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
