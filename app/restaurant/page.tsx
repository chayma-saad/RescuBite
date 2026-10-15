import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ForecastDashboard } from "@/components/restaurant/ForecastDashboard";
import { predictDemand, getWeatherForDate } from "@/lib/prediction";
import { TrendingUp, Package, AlertTriangle, Leaf } from "lucide-react";
import Link from "next/link";

async function getRestaurantData(userId: string) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { userId },
    include: {
      menuItems: {
        where: { active: true },
        include: {
          salesRecords: { orderBy: { date: "desc" }, take: 60 },
        },
      },
      rescueBags: {
        where: { status: "AVAILABLE" },
        include: { reservations: true },
      },
    },
  });
  return restaurant;
}

export default async function RestaurantDashboard() {
  const session = await auth();
  const restaurant = await getRestaurantData(session!.user.id);

  if (!restaurant) {
    return (
      <div className="text-center py-20">
        <p style={{ color: "var(--color-text-secondary)" }}>Restaurant profile not found.</p>
        <Link href="/auth/signup" className="btn-primary mt-4 inline-flex">Complete Setup</Link>
      </div>
    );
  }

  const today = new Date();
  const weather = getWeatherForDate(today);

  const forecasts = restaurant.menuItems.map((item) => {
    const history = item.salesRecords.map((r) => ({ date: r.date, sold: r.sold, prepared: r.prepared }));
    return {
      menuItemId: item.id,
      menuItemName: item.name,
      category: item.category,
      typicalPortions: item.typicalPortions,
      prediction: predictDemand(history, today),
    };
  });

  const activeBags = restaurant.rescueBags.length;
  const totalRemaining = restaurant.rescueBags.reduce((s, b) => s + b.remainingQty, 0);

  // Get recent week impact
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekImpact = await prisma.impactLog.aggregate({
    where: { restaurantId: restaurant.id, date: { gte: weekAgo } },
    _sum: { kgRescued: true, mealsRescued: true, revenueTND: true },
  });

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayName = dayNames[today.getDay()];
  const weatherEmoji = { sunny: "☀️", cloudy: "⛅", rainy: "🌧️" }[weather];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "Fraunces, serif", color: "var(--color-text)" }}>
            Good {today.getHours() < 12 ? "morning" : today.getHours() < 17 ? "afternoon" : "evening"}, {session?.user.name?.split(" ")[0] ?? "Chef"} 👋
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            {dayName}, {today.toLocaleDateString("en-GB", { day: "numeric", month: "long" })} · {weatherEmoji} {weather.charAt(0).toUpperCase() + weather.slice(1)} today
          </p>
        </div>
        <Link href="/restaurant/surplus" className="btn-accent self-start">
          <AlertTriangle size={16} /> Log Surplus
        </Link>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Weekly Meals Rescued", value: weekImpact._sum.mealsRescued ?? 0, icon: Leaf, color: "#3D5A3D", suffix: " meals" },
          { label: "Weekly Revenue", value: `${(weekImpact._sum.revenueTND ?? 0).toFixed(0)} TND`, icon: TrendingUp, color: "#E07856", raw: true },
          { label: "Active Rescue Bags", value: activeBags, icon: Package, color: "#4A7C4E", suffix: " bags" },
          { label: "Portions Available", value: totalRemaining, icon: AlertTriangle, color: "#E8A54B", suffix: " left" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                  <Icon size={18} style={{ color: stat.color }} />
                </div>
              </div>
              <div className="text-2xl font-bold tabular-nums" style={{ fontFamily: "Fraunces, serif", color: "var(--color-text)" }}>
                {stat.raw ? stat.value : `${stat.value}${stat.suffix ?? ""}`}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Forecast section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold" style={{ fontFamily: "Fraunces, serif", color: "var(--color-text)" }}>
            Today&apos;s AI Forecast
          </h2>
          <span className="badge badge-green">Live · {weather}</span>
        </div>
        <ForecastDashboard forecasts={forecasts} weather={weather} />
      </div>
    </div>
  );
}
