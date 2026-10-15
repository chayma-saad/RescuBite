import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generatePickupCode } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { bagId, quantity = 1 } = await req.json();

  const bag = await prisma.rescueBag.findUnique({ where: { id: bagId } });
  if (!bag || bag.status !== "AVAILABLE" || bag.remainingQty < 1) {
    return NextResponse.json({ error: "No longer available" }, { status: 400 });
  }

  const pickupCode = generatePickupCode();

  // Handle charity role
  if (session.user.role === "CHARITY") {
    let charity = await prisma.charity.findUnique({ where: { userId: session.user.id } });
    if (!charity) {
      const user = await prisma.user.findUnique({ where: { id: session.user.id } });
      charity = await prisma.charity.create({ data: { userId: session.user.id, name: user?.name ?? "Unknown Charity" } });
    }
    await prisma.donation.create({
      data: {
        charityId: charity.id,
        restaurantId: bag.restaurantId,
        rescueBagId: bagId,
        quantity: Math.min(quantity, bag.remainingQty),
        pickupCode,
        status: "CONFIRMED",
      },
    });
  } else {
    // Consumer claiming a donation bag
    let consumer = await prisma.consumer.findUnique({ where: { userId: session.user.id } });
    if (!consumer) consumer = await prisma.consumer.create({ data: { userId: session.user.id } });
    await prisma.reservation.create({
      data: { consumerId: consumer.id, rescueBagId: bagId, quantity: 1, pickupCode, status: "CONFIRMED" },
    });
  }

  await prisma.rescueBag.update({
    where: { id: bagId },
    data: { remainingQty: { decrement: Math.min(quantity, bag.remainingQty) } },
  });

  return NextResponse.json({ pickupCode });
}
