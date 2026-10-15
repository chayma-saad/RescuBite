import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Package, Heart } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CharityHistoryPage() {
  const session = await auth();

  const charity = await prisma.charity.findUnique({
    where: { userId: session!.user.id },
    include: {
      donations: {
        include: {
          rescueBag: { select: { title: true, quantity: true } },
          restaurant: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const donations = charity?.donations ?? [];
  const totalPortions = donations.reduce((s, d) => s + d.quantity, 0);
  const totalMeals = totalPortions;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "Fraunces, serif", color: "var(--color-text)" }}>Distribution Log</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>Your full history of claimed donations and redistributed meals.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Donations Claimed", value: donations.length },
          { label: "Total Portions", value: totalPortions },
          { label: "kg CO₂ Avoided", value: `${(totalMeals * 0.5).toFixed(1)}` },
        ].map((s) => (
          <div key={s.label} className="card p-5 text-center">
            <div className="text-2xl font-bold tabular-nums" style={{ fontFamily: "Fraunces, serif", color: "#4A7C4E" }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color: "var(--color-text-secondary)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* History list */}
      {donations.length === 0 ? (
        <div className="card p-12 text-center">
          <Heart size={40} className="mx-auto mb-4" style={{ color: "var(--color-text-secondary)" }} />
          <p className="font-medium" style={{ color: "var(--color-text)" }}>No claims yet</p>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>Go to the Donation Feed to start claiming surplus meals.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {donations.map((d) => (
            <div key={d.id} className="card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "#e6f4e7" }}>
                    <Package size={16} style={{ color: "#4A7C4E" }} />
                  </div>
                  <div>
                    <p className="font-medium text-sm" style={{ color: "var(--color-text)" }}>{d.rescueBag.title}</p>
                    <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{d.restaurant.name} · {formatDate(d.createdAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold tabular-nums" style={{ color: "#4A7C4E" }}>{d.quantity} portions</p>
                  <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Code: {d.pickupCode}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
