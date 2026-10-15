import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "RESTAURANT") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const item = await prisma.menuItem.create({
    data: {
      restaurantId: body.restaurantId,
      name: body.name,
      description: body.description || null,
      category: body.category || null,
      typicalPortions: Number(body.typicalPortions) || 20,
      costPerPortion: Number(body.costPerPortion),
      pricePerPortion: Number(body.pricePerPortion),
    },
  });
  return NextResponse.json(item);
}
