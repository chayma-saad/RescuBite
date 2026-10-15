import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { MenuManager } from "@/components/restaurant/MenuManager";

export default async function MenuPage() {
  const session = await auth();
  const restaurant = await prisma.restaurant.findUnique({
    where: { userId: session!.user.id },
    include: { menuItems: { orderBy: { createdAt: "asc" } } },
  });

  if (!restaurant) return <div>Restaurant not found</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "Fraunces, serif", color: "var(--color-text)" }}>Menu Management</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>Add, edit, and manage your menu items. Accurate portion counts improve forecast quality.</p>
      </div>
      <MenuManager restaurantId={restaurant.id} menuItems={restaurant.menuItems} />
    </div>
  );
}
