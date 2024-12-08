import getCurrentUser from "@/app/actions/getCurrentUser";

import { prisma } from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.error();
  }

  const { searchParams } = new URL(request.url);
  const reviewId = searchParams.get("reviewId");

  const reaction = await prisma.reviewReaction.findUnique({
    where: {
      reviewId_userId: {
        reviewId,
        userId: currentUser.id,
      },
    },
  });

  return NextResponse.json({ reaction: reaction?.reaction || null });
}
