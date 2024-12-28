import { NextResponse } from "next/server";
import { prisma } from "@/app/libs/prismadb";

export async function GET(request, { params }) {
  const { id } = await params;

  const user = await prisma.user.findFirst({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      businessName: true,
      email: true,
      hotelOwner: true,
      defaultLocation: true,
      locale: true,
    },
  });

  return NextResponse.json(user);
}
