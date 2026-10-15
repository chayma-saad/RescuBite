import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { SurplusLogger } from "@/components/restaurant/SurplusLogger";
import { ActiveBags } from "@/components/restaurant/ActiveBags";
import { predictDemand, getWeatherForDate } from "@/lib/prediction";

export default async function SurplusPage() {
  const session = await auth();
  const restaurant = await prisma.restaurant.findUnique({
    where: { userId: session!.user.id },
    include: {
      menuItems: {
        where: { active: true },
        include: { salesRecords: { orderBy: { date: "desc" }, take: 60 } },
      },
      rescueBags: {
        where: { status: "AVAILABLE" },
        include: { reservations: { select: { id: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!restaurant) return <div>Restaurant not found</div>;

  const today = new Date();
  const weather = getWeatherForDate(today);

  const menuItemsWithForecast = restaurant.menuItems.map((item) => {
    const history = item.salesRecords.map((r) => ({ date: r.date, sold: r.sold, prepared: r.prepared }));
    return {
      id: item.id,
      name: item.name,
      pricePerPortion: item.pricePerPortion,
      prediction: predictDemand(history, today),
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "Fraunces, serif", color: "var(--color-text)" }}>Surplus Management</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>Log today&apos;s end-of-service numbers and create Rescue Bags from surplus.</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <SurplusLogger restaurantId={restaurant.id} menuItems={menuItemsWithForecast} weather={weather} />
        <ActiveBags bags={restaurant.rescueBags} restaurantId={restaurant.id} />
      </div>
    </div>
  );
}
