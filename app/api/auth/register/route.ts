import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    const validRoles = ["RESTAURANT", "CONSUMER", "CHARITY"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role },
    });

    // Create role-specific profile
    if (role === "CONSUMER") {
      await prisma.consumer.create({ data: { userId: user.id } });
    } else if (role === "CHARITY") {
      await prisma.charity.create({ data: { userId: user.id, name } });
    } else if (role === "RESTAURANT") {
      await prisma.restaurant.create({
        data: {
          userId: user.id,
          name,
          address: "Tunis, Tunisia",
          lat: 36.8065,
          lng: 10.1815,
          cuisine: "Tunisian",
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
