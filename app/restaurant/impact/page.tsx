import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ImpactCharts } from "@/components/restaurant/ImpactCharts";
import { Leaf, TrendingUp, Heart, Wind } from "lucide-react";

export default async function ImpactPage() {
  const session = await auth();
  const restaurant = await prisma.restaurant.findUnique({ where: { userId: session!.user.id } });
  if (!restaurant) return <div>Not found</div>;

  const logs = await prisma.impactLog.findMany({
    where: { restaurantId: restaurant.id },
    orderBy: { date: "asc" },
    take: 60,
  });

  const totals = logs.reduce((acc, log) => ({
    kgRescued: acc.kgRescued + log.kgRescued,
    mealsRescued: acc.mealsRescued + log.mealsRescued,
    revenueTND: acc.revenueTND + log.revenueTND,
    mealsDonated: acc.mealsDonated + log.mealsDonated,
    co2Avoided: acc.co2Avoided + log.co2Avoided,
  }), { kgRescued: 0, mealsRescued: 0, revenueTND: 0, mealsDonated: 0, co2Avoided: 0 });

  // Weekly aggregation for charts
  const weeklyMap: Record<string, { week: string; kgRescued: number; mealsRescued: number; revenueTND: number }> = {};
  logs.forEach((log) => {
    const d = new Date(log.date);
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());
    const key = weekStart.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    if (!weeklyMap[key]) weeklyMap[key] = { week: key, kgRescued: 0, mealsRescued: 0, revenueTND: 0 };
    weeklyMap[key].kgRescued += log.kgRescued;
    weeklyMap[key].mealsRescued += log.mealsRescued;
    weeklyMap[key].revenueTND += log.revenueTND;
  });

  const chartData = Object.values(weeklyMap).slice(-8).map((w) => ({
    week: w.week,
    kgRescued: Math.round(w.kgRescued * 10) / 10,
    mealsRescued: Math.round(w.mealsRescued),
    revenueTND: Math.round(w.revenueTND),
  }));

  const statCards = [
    { label: "Total kg Rescued", value: `${totals.kgRescued.toFixed(1)} kg`, icon: Leaf, color: "#3D5A3D" },
    { label: "Meals Rescued", value: totals.mealsRescued.toString(), icon: TrendingUp, color: "#E07856" },
    { label: "Revenue from Surplus", value: `${totals.revenueTND.toFixed(0)} TND`, icon: TrendingUp, color: "#E8A54B" },
    { label: "Meals Donated", value: totals.mealsDonated.toString(), icon: Heart, color: "#4A7C4E" },
    { label: "CO₂ Avoided", value: `${totals.co2Avoided.toFixed(1)} kg`, icon: Wind, color: "#4A7C4E" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "Fraunces, serif", color: "var(--color-text)" }}>Your Impact</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>Every rescue bag makes a difference. Here&apos;s what you&apos;ve achieved.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card p-5 text-center">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: `${stat.color}15` }}>
                <Icon size={20} style={{ color: stat.color }} />
              </div>
              <div className="text-2xl font-bold tabular-nums" style={{ fontFamily: "Fraunces, serif", color: "var(--color-text)" }}>{stat.value}</div>
              <div className="text-xs mt-1" style={{ color: "var(--color-text-secondary)" }}>{stat.label}</div>
            </div>
          );
        })}
      </div>

      <ImpactCharts data={chartData} />
    </div>
  );
}
