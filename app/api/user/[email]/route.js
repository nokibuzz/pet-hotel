import { NextResponse } from "next/server";
import { prisma } from "@/app/libs/prismadb";

export async function PUT(request, { params }) {
  const { email, token } = await params;

  if (!token) {
    return NextResponse.json({ status: "400", error: "Token is required" });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { token },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({
      status: "500",
      error: "Failed to update user's token",
    });
  }
}
