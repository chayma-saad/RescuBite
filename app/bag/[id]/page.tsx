import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { BagDetail } from "@/components/consumer/BagDetail";

export default async function BagPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  const bag = await prisma.rescueBag.findUnique({
    where: { id },
    include: {
      restaurant: true,
      reservations: { select: { id: true, quantity: true } },
    },
  });

  if (!bag) notFound();

  const serialized = {
    id: bag.id,
    title: bag.title,
    description: bag.description,
    originalPrice: bag.originalPrice,
    discountedPrice: bag.discountedPrice,
    quantity: bag.quantity,
    remainingQty: bag.remainingQty,
    status: bag.status,
    type: bag.type,
    pickupStart: bag.pickupStart.toISOString(),
    pickupEnd: bag.pickupEnd.toISOString(),
    imageUrl: bag.imageUrl,
    restaurant: {
      name: bag.restaurant.name,
      address: bag.restaurant.address,
      lat: bag.restaurant.lat,
      lng: bag.restaurant.lng,
      cuisine: bag.restaurant.cuisine,
      phone: bag.restaurant.phone,
      imageUrl: bag.restaurant.imageUrl,
    },
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <BagDetail bag={serialized} isLoggedIn={!!session} userRole={session?.user.role} userId={session?.user.id} />
      </div>
    </div>
  );
}
