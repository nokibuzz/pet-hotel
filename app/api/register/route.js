import bcrypt from "bcrypt";
import { prisma } from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();
  const { email, name, password, businessName, hotelOwner } = body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
      businessName,
      hotelOwner,
    },
  });

  return NextResponse.json(user);
}
