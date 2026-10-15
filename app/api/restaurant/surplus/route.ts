import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "RESTAURANT") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { restaurantId, entries, bagType, weather } = await req.json();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Record sales
  for (const entry of entries) {
    const wasted = Math.max(0, entry.prepared - entry.sold);
    await prisma.salesRecord.create({
      data: { restaurantId, menuItemId: entry.menuItemId, date: today, prepared: entry.prepared, sold: entry.sold, wasted, weather },
    });
  }

  const surplusEntries = entries.filter((e: { prepared: number; sold: number }) => e.prepared - e.sold > 0);
  if (surplusEntries.length === 0) return NextResponse.json({ bagsCreated: 0, totalSurplus: 0 });

  // Get menu items for pricing
  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: surplusEntries.map((e: { menuItemId: string }) => e.menuItemId) } },
  });

  const itemMap = Object.fromEntries(menuItems.map((m) => [m.id, m]));
  const totalSurplus = surplusEntries.reduce((s: number, e: { prepared: number; sold: number }) => s + (e.prepared - e.sold), 0);
  const totalValue = surplusEntries.reduce((s: number, e: { menuItemId: string; prepared: number; sold: number }) => {
    const surplus = e.prepared - e.sold;
    return s + (itemMap[e.menuItemId]?.pricePerPortion ?? 0) * surplus;
  }, 0);

  // Dynamic pricing: 50% off, drops to 70% near window close
  const discountedPrice = bagType === "DONATION" ? 0 : totalValue * 0.5;

  const pickupStart = new Date();
  pickupStart.setMinutes(pickupStart.getMinutes() + 15);
  const pickupEnd = new Date();
  pickupEnd.setHours(pickupEnd.getHours() + 3);

  const names = surplusEntries.map((e: { menuItemId: string }) => itemMap[e.menuItemId]?.name ?? "").filter(Boolean);
  const title = names.length === 1 ? `${names[0]} Rescue` : `Surprise Rescue Bag`;
  const description = `${totalSurplus} portions · ${names.slice(0, 3).join(", ")}${names.length > 3 ? ` and more` : ""}. Fresh from today's service.`;

  await prisma.rescueBag.create({
    data: {
      restaurantId,
      title,
      description,
      originalPrice: totalValue,
      discountedPrice,
      quantity: totalSurplus,
      remainingQty: totalSurplus,
      status: "AVAILABLE",
      type: bagType,
      pickupStart,
      pickupEnd,
    },
  });

  // Log impact
  const kgRescued = totalSurplus * 0.35;
  await prisma.impactLog.create({
    data: {
      restaurantId,
      date: new Date(),
      kgRescued,
      mealsRescued: totalSurplus,
      revenueTND: bagType === "SALE" ? discountedPrice : 0,
      mealsDonated: bagType === "DONATION" ? totalSurplus : 0,
      co2Avoided: kgRescued * 2.5,
    },
  });

  return NextResponse.json({ bagsCreated: 1, totalSurplus });
}
