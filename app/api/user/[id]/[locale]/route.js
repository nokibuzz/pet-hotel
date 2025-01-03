import { NextResponse } from "next/server";
import { prisma } from "@/app/libs/prismadb";

export async function PUT(request, { params }) {
  const { id, locale } = await params;

  if (!locale && locale !== "sr" && locale !== "en") {
    return NextResponse.json({ status: "400", error: "Locale is required" });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { locale },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ status: "500", error: "Failed to update user" });
  }
}
