import { NextResponse } from "next/server";

import { prisma } from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function PATCH(request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { id, userId, action } = body;

  if (!id || !userId || !["like", "dislike"].includes(action)) {
    return NextResponse.error();
  }

  const review = await prisma.review.findUnique({ where: { id } });

  if (!review) {
    return NextResponse.error();
  }

  const decrementField = action === "like" ? "likedReviews" : "dislikedReviews";
  const reviewField = action === "like" ? "likes" : "dislikes";

  if (review[reviewField] <= 0) {
    return NextResponse.error();
  }

  const rev = await prisma.review.update({
    where: { id },
    data: { [reviewField]: { decrement: 1 } },
  });

  const user = await prisma.user.update({
    where: { id: userId },
    data: { [decrementField]: { decrement: 1 } },
  });

  return NextResponse.json(rev);
}
