import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CharityFeed } from "@/components/charity/CharityFeed";

export const dynamic = "force-dynamic";

export default async function CharityPage() {
  const session = await auth();

  const charity = await prisma.charity.findUnique({
    where: { userId: session!.user.id },
  });

  const donations = await prisma.rescueBag.findMany({
    where: { type: "DONATION", status: "AVAILABLE", pickupEnd: { gte: new Date() } },
    include: {
      restaurant: { select: { name: true, address: true, lat: true, lng: true, cuisine: true, phone: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const serialized = donations.map((d) => ({
    id: d.id,
    title: d.title,
    description: d.description,
    quantity: d.quantity,
    remainingQty: d.remainingQty,
    pickupStart: d.pickupStart.toISOString(),
    pickupEnd: d.pickupEnd.toISOString(),
    restaurant: d.restaurant,
  }));

  // Past claims for this charity
  const pastClaims = charity ? await prisma.donation.findMany({
    where: { charityId: charity.id },
    include: { rescueBag: { select: { title: true } }, restaurant: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 5,
  }) : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "Fraunces, serif", color: "var(--color-text)" }}>
          Donation Feed
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
          {charity?.name ?? "Your organization"} · Claim available surplus from partnered restaurants.
        </p>
      </div>
      <CharityFeed donations={serialized} charityId={charity?.id} />
    </div>
  );
}
