import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generatePickupCode } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Sign in to reserve" }, { status: 401 });

  const { bagId, quantity = 1 } = await req.json();

  const bag = await prisma.rescueBag.findUnique({ where: { id: bagId } });
  if (!bag || bag.status !== "AVAILABLE" || bag.remainingQty < quantity) {
    return NextResponse.json({ error: "Bag no longer available" }, { status: 400 });
  }

  let consumer = await prisma.consumer.findUnique({ where: { userId: session.user.id } });
  if (!consumer) {
    consumer = await prisma.consumer.create({ data: { userId: session.user.id } });
  }

  const pickupCode = generatePickupCode();
  await prisma.reservation.create({
    data: { consumerId: consumer.id, rescueBagId: bagId, quantity, pickupCode, status: "CONFIRMED" },
  });

  await prisma.rescueBag.update({
    where: { id: bagId },
    data: { remainingQty: { decrement: quantity } },
  });

  return NextResponse.json({ pickupCode });
}
