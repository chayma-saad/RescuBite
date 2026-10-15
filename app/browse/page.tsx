import { prisma } from "@/lib/db";
import { BrowsePage } from "@/components/consumer/BrowsePage";
import { Navbar } from "@/components/shared/Navbar";

export const dynamic = "force-dynamic";

export default async function Browse() {
  const bags = await prisma.rescueBag.findMany({
    where: { status: "AVAILABLE", pickupEnd: { gte: new Date() } },
    include: {
      restaurant: { select: { name: true, lat: true, lng: true, address: true, cuisine: true, imageUrl: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const serialized = bags.map((b) => ({
    id: b.id,
    title: b.title,
    description: b.description,
    originalPrice: b.originalPrice,
    discountedPrice: b.discountedPrice,
    quantity: b.quantity,
    remainingQty: b.remainingQty,
    status: b.status,
    type: b.type,
    pickupStart: b.pickupStart.toISOString(),
    pickupEnd: b.pickupEnd.toISOString(),
    imageUrl: b.imageUrl,
    restaurant: b.restaurant,
  }));

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <Navbar />
      <BrowsePage bags={serialized} />
    </div>
  );
}
