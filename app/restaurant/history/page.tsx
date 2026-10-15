import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { HistoryCharts } from "@/components/restaurant/HistoryCharts";
import { predictDemand } from "@/lib/prediction";

export default async function HistoryPage() {
  const session = await auth();
  const restaurant = await prisma.restaurant.findUnique({
    where: { userId: session!.user.id },
    include: {
      menuItems: {
        where: { active: true },
        include: { salesRecords: { orderBy: { date: "desc" }, take: 30 } },
      },
    },
  });

  if (!restaurant) return <div>Not found</div>;

  // Build accuracy history
  const accuracyData = restaurant.menuItems.flatMap((item) => {
    return item.salesRecords.map((record) => {
      const historyBefore = item.salesRecords.filter((r) => new Date(r.date) < new Date(record.date));
      const pred = predictDemand(historyBefore.map((r) => ({ date: r.date, sold: r.sold, prepared: r.prepared })), new Date(record.date));
      const error = Math.abs(pred.predicted - record.sold);
      const accuracy = record.sold > 0 ? Math.max(0, Math.round((1 - error / record.sold) * 100)) : 100;
      return {
        date: new Date(record.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
        itemName: item.name,
        predicted: pred.predicted,
        actual: record.sold,
        accuracy,
      };
    });
  }).slice(0, 60);

  // Aggregate by date
  const byDate = accuracyData.reduce((acc, row) => {
    const key = row.date;
    if (!acc[key]) acc[key] = { date: key, totalPredicted: 0, totalActual: 0, count: 0 };
    acc[key].totalPredicted += row.predicted;
    acc[key].totalActual += row.actual;
    acc[key].count++;
    return acc;
  }, {} as Record<string, { date: string; totalPredicted: number; totalActual: number; count: number }>);

  const chartData = Object.values(byDate)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14)
    .map((d) => ({
      date: d.date,
      predicted: Math.round(d.totalPredicted),
      actual: d.totalActual,
      accuracy: d.totalActual > 0 ? Math.round(Math.max(0, (1 - Math.abs(d.totalPredicted - d.totalActual) / d.totalActual) * 100)) : 100,
    }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "Fraunces, serif", color: "var(--color-text)" }}>Forecast History</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>Track how accurately the AI predicted your daily demand over the past 2 weeks.</p>
      </div>
      <HistoryCharts data={chartData} />
    </div>
  );
}
