import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

const WEATHER_OPTIONS = ["sunny", "cloudy", "rainy"];
const WEATHER_FOR_DATE = (date: Date) => {
  const seed = date.getDate() + date.getMonth() * 31;
  return WEATHER_OPTIONS[seed % 3];
};

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.donation.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.rescueBag.deleteMany();
  await prisma.salesRecord.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.impactLog.deleteMany();
  await prisma.consumer.deleteMany();
  await prisma.charity.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("demo1234", 10);

  // === USERS ===
  const restaurantUser = await prisma.user.create({
    data: {
      email: "demo@restaurant.com",
      password: hashedPassword,
      name: "Sami Ben Ali",
      role: "RESTAURANT",
    },
  });

  const consumerUser = await prisma.user.create({
    data: {
      email: "demo@user.com",
      password: hashedPassword,
      name: "Yasmine Trabelsi",
      role: "CONSUMER",
    },
  });

  const charityUser = await prisma.user.create({
    data: {
      email: "demo@charity.com",
      password: hashedPassword,
      name: "Riadh Mansour",
      role: "CHARITY",
    },
  });

  // Extra restaurant users
  const extraRestaurantUsers = await Promise.all([
    prisma.user.create({ data: { email: "marsa@restaurant.com", password: hashedPassword, name: "Leila Gharbi", role: "RESTAURANT" } }),
    prisma.user.create({ data: { email: "centre@restaurant.com", password: hashedPassword, name: "Karim Jemli", role: "RESTAURANT" } }),
    prisma.user.create({ data: { email: "manar@restaurant.com", password: hashedPassword, name: "Nadia Boulila", role: "RESTAURANT" } }),
    prisma.user.create({ data: { email: "menzah@restaurant.com", password: hashedPassword, name: "Tarek Hamdi", role: "RESTAURANT" } }),
    prisma.user.create({ data: { email: "lac@restaurant.com", password: hashedPassword, name: "Rim Khemiri", role: "RESTAURANT" } }),
    prisma.user.create({ data: { email: "carthage@restaurant.com", password: hashedPassword, name: "Mehdi Zouaoui", role: "RESTAURANT" } }),
  ]);

  // === DEMO RESTAURANT ===
  const demoRestaurant = await prisma.restaurant.create({
    data: {
      userId: restaurantUser.id,
      name: "Le Jasmin",
      address: "12 Rue de la Kasbah, Tunis",
      lat: 36.7992,
      lng: 10.1719,
      cuisine: "Tunisian",
      phone: "+216 71 234 567",
      description: "Authentic Tunisian cuisine in the heart of Tunis medina.",
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
    },
  });

  // === EXTRA RESTAURANTS ===
  const extraRestaurantsData = [
    { name: "Dar El Medina", address: "La Marsa, Tunis", lat: 36.8892, lng: 10.3252, cuisine: "Tunisian", userId: extraRestaurantUsers[0].id, imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400" },
    { name: "Le Palmier Doré", address: "Centre Urbain Nord, Tunis", lat: 36.8399, lng: 10.1899, cuisine: "Mediterranean", userId: extraRestaurantUsers[1].id, imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400" },
    { name: "Couscous House", address: "El Manar, Tunis", lat: 36.8201, lng: 10.2102, cuisine: "Tunisian", userId: extraRestaurantUsers[2].id, imageUrl: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400" },
    { name: "Saveurs du Maghreb", address: "El Menzah, Tunis", lat: 36.8500, lng: 10.2000, cuisine: "Maghrebi", userId: extraRestaurantUsers[3].id, imageUrl: "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=400" },
    { name: "Café du Lac", address: "Les Berges du Lac, Tunis", lat: 36.8420, lng: 10.2420, cuisine: "International", userId: extraRestaurantUsers[4].id, imageUrl: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400" },
    { name: "Brik & Co", address: "Carthage, Tunis", lat: 36.8525, lng: 10.3226, cuisine: "Tunisian Street Food", userId: extraRestaurantUsers[5].id, imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400" },
  ];

  const extraRestaurants = await Promise.all(
    extraRestaurantsData.map((r) => prisma.restaurant.create({ data: r }))
  );

  // === MENU ITEMS (demo restaurant) ===
  const menuItemsData = [
    { name: "Couscous Royal", description: "Traditional couscous with lamb, vegetables and harissa", category: "Main", typicalPortions: 35, costPerPortion: 8.5, pricePerPortion: 18.0 },
    { name: "Brik à l'Oeuf", description: "Crispy pastry filled with egg, tuna and capers", category: "Starter", typicalPortions: 40, costPerPortion: 2.5, pricePerPortion: 6.5 },
    { name: "Lablabi", description: "Chickpea soup with harissa, cumin and olive oil", category: "Starter", typicalPortions: 30, costPerPortion: 1.8, pricePerPortion: 5.0 },
    { name: "Ojja Merguez", description: "Spiced eggs with merguez sausages in tomato sauce", category: "Main", typicalPortions: 25, costPerPortion: 6.0, pricePerPortion: 14.0 },
    { name: "Makroudh", description: "Semolina pastry filled with dates and honey", category: "Dessert", typicalPortions: 50, costPerPortion: 1.2, pricePerPortion: 3.5 },
    { name: "Mloukhia", description: "Jute leaf stew with beef, slow-cooked for hours", category: "Main", typicalPortions: 20, costPerPortion: 9.0, pricePerPortion: 20.0 },
    { name: "Tajine Tunisien", description: "Oven-baked frittata with cheese, parsley and spices", category: "Main", typicalPortions: 28, costPerPortion: 5.5, pricePerPortion: 12.0 },
    { name: "Salade Méchouia", description: "Grilled pepper and tomato salad with tuna and olives", category: "Starter", typicalPortions: 45, costPerPortion: 2.0, pricePerPortion: 6.0 },
  ];

  const menuItems = await Promise.all(
    menuItemsData.map((item) =>
      prisma.menuItem.create({
        data: { ...item, restaurantId: demoRestaurant.id },
      })
    )
  );

  // === SALES RECORDS (60 days) ===
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const salesRecords = [];
  for (let daysAgo = 60; daysAgo >= 1; daysAgo--) {
    const date = addDays(today, -daysAgo);
    date.setHours(22, 0, 0, 0);
    const dayOfWeek = date.getDay();
    const weather = WEATHER_FOR_DATE(date);

    const dayFactor = [0.85, 0.9, 0.95, 1.0, 1.15, 1.25, 1.1][dayOfWeek];
    const weatherFactor = weather === "sunny" ? 1.1 : weather === "rainy" ? 0.75 : 1.0;

    for (const item of menuItems) {
      const base = item.typicalPortions;
      const noise = 0.85 + Math.random() * 0.3;
      const prepared = Math.round(base * dayFactor * noise);
      const soldRatio = 0.65 + Math.random() * 0.3 * weatherFactor;
      const sold = Math.min(Math.round(prepared * soldRatio), prepared);
      const wasted = prepared - sold;

      salesRecords.push({
        restaurantId: demoRestaurant.id,
        menuItemId: item.id,
        date,
        prepared,
        sold,
        wasted,
        weather,
      });
    }
  }

  await prisma.salesRecord.createMany({ data: salesRecords });

  // === IMPACT LOG (60 days) ===
  const impactLogs = [];
  for (let daysAgo = 60; daysAgo >= 1; daysAgo--) {
    const date = addDays(today, -daysAgo);
    const kgRescued = 2 + Math.random() * 8;
    const mealsRescued = Math.round(kgRescued * 1.8);
    const revenueTND = mealsRescued * (5 + Math.random() * 4);
    const mealsDonated = randomBetween(0, 5);
    const co2Avoided = kgRescued * 2.5;
    impactLogs.push({
      restaurantId: demoRestaurant.id,
      date,
      kgRescued,
      mealsRescued,
      revenueTND,
      mealsDonated,
      co2Avoided,
    });
  }
  await prisma.impactLog.createMany({ data: impactLogs });

  // === CONSUMER ===
  const consumer = await prisma.consumer.create({
    data: { userId: consumerUser.id },
  });

  // === CHARITIES ===
  const charityProfile = await prisma.charity.create({
    data: {
      userId: charityUser.id,
      name: "Resto du Cœur Tunis",
      address: "Tunis Centre, Tunis",
      phone: "+216 71 890 123",
    },
  });

  await prisma.user.create({
    data: {
      email: "banque@charity.com",
      password: hashedPassword,
      name: "Amel Dridi",
      role: "CHARITY",
      charityProfile: {
        create: {
          name: "Banque Alimentaire de Tunisie",
          address: "Ariana, Tunis",
          phone: "+216 71 456 789",
        },
      },
    },
  });

  // === ACTIVE RESCUE BAGS (4 bags live now) ===
  const now = new Date();

  const bag1 = await prisma.rescueBag.create({
    data: {
      restaurantId: demoRestaurant.id,
      title: "Surprise Rescue Bag",
      description: "Mix of today's surplus — couscous, brik, and desserts. Always fresh, never wasted!",
      originalPrice: 24.0,
      discountedPrice: 10.0,
      quantity: 5,
      remainingQty: 3,
      status: "AVAILABLE",
      type: "SALE",
      pickupStart: new Date(now.getTime() + 30 * 60000),
      pickupEnd: new Date(now.getTime() + 150 * 60000),
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
    },
  });

  const bag2 = await prisma.rescueBag.create({
    data: {
      restaurantId: extraRestaurants[0].id,
      title: "Dar El Medina Special",
      description: "3 portions of mloukhia + 2 tajines. Rich Tunisian classics at a rescue price.",
      originalPrice: 38.0,
      discountedPrice: 15.0,
      quantity: 4,
      remainingQty: 4,
      status: "AVAILABLE",
      type: "SALE",
      pickupStart: new Date(now.getTime() + 45 * 60000),
      pickupEnd: new Date(now.getTime() + 165 * 60000),
      imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400",
    },
  });

  const bag3 = await prisma.rescueBag.create({
    data: {
      restaurantId: extraRestaurants[1].id,
      title: "Mediterranean Rescue",
      description: "Grilled fish, salads and hummus — fresh from this afternoon's service.",
      originalPrice: 32.0,
      discountedPrice: 12.0,
      quantity: 3,
      remainingQty: 2,
      status: "AVAILABLE",
      type: "SALE",
      pickupStart: new Date(now.getTime() + 60 * 60000),
      pickupEnd: new Date(now.getTime() + 180 * 60000),
      imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
    },
  });

  const bag4 = await prisma.rescueBag.create({
    data: {
      restaurantId: extraRestaurants[2].id,
      title: "Couscous House Donation",
      description: "6 generous portions of couscous royal — donated to families in need.",
      originalPrice: 108.0,
      discountedPrice: 0,
      quantity: 6,
      remainingQty: 6,
      status: "AVAILABLE",
      type: "DONATION",
      pickupStart: new Date(now.getTime() + 20 * 60000),
      pickupEnd: new Date(now.getTime() + 140 * 60000),
      imageUrl: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400",
    },
  });

  // A past reservation for the demo consumer
  await prisma.reservation.create({
    data: {
      consumerId: consumer.id,
      rescueBagId: bag1.id,
      quantity: 1,
      pickupCode: "RSCB-4729",
      status: "CONFIRMED",
    },
  });

  console.log("✅ Seed complete!");
  console.log("  Demo credentials:");
  console.log("  Restaurant: demo@restaurant.com / demo1234");
  console.log("  Consumer:   demo@user.com / demo1234");
  console.log("  Charity:    demo@charity.com / demo1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
