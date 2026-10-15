import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { predictDemand, getWeatherForDate } from "@/lib/prediction";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "RESTAURANT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { userId: session.user.id },
    include: {
      menuItems: {
        where: { active: true },
        include: {
          salesRecords: {
            orderBy: { date: "desc" },
            take: 60,
          },
        },
      },
    },
  });

  if (!restaurant) return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });

  const today = new Date();
  const weather = getWeatherForDate(today);

  const forecasts = restaurant.menuItems.map((item) => {
    const history = item.salesRecords.map((r) => ({
      date: r.date,
      sold: r.sold,
      prepared: r.prepared,
    }));
    const prediction = predictDemand(history, today);

    // Get today's actual (if already logged)
    const todayRecord = item.salesRecords.find((r) => {
      const d = new Date(r.date);
      return d.toDateString() === today.toDateString();
    });

    return {
      menuItemId: item.id,
      menuItemName: item.name,
      category: item.category,
      typicalPortions: item.typicalPortions,
      prediction,
      todayPrepared: todayRecord?.prepared ?? null,
      todaySold: todayRecord?.sold ?? null,
    };
  });

  return NextResponse.json({ forecasts, weather, restaurantName: restaurant.name });
}
