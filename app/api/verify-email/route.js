import { prisma } from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import { logError } from "@/app/libs/logtail.js";

export async function GET(req) {
  let user;

  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token is missing" }, { status: 400 });
    }

    // Find user by token
    user = await prisma.user.findFirst({
      where: { token },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Mark user as verified and remove the token
    await prisma.user.update({
      where: { id: user.id },
      data: { verified: true, token: null, emailVerified: new Date() },
    });

    return NextResponse.json("Verified email");
  } catch (error) {
    logError(req, user?.id, error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
