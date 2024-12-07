import { NextResponse } from "next/server";
import { prisma } from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { id, userId, action } = body;

  if (!["like", "dislike"].includes(action)) {
    return NextResponse.error();
  }

  const review = await prisma.review.findUnique({ where: { id } });

  if (!review || review.userId === currentUser.id) {
    return NextResponse.error();
  }

  const existingReaction = await prisma.reviewReaction.findUnique({
    where: {
      reviewId_userId: {
        reviewId: id,
        userId: currentUser.id,
      },
    },
  });

  if (existingReaction) {
    if (existingReaction.reaction === action) {
      // Remove the reaction
      await prisma.reviewReaction.delete({
        where: {
          id: existingReaction.id,
        },
      });
      await prisma.review.update({
        where: { id },
        data: {
          [action === "like" ? "likes" : "dislikes"]: { decrement: 1 },
        },
      });
      await prisma.user.update({
        where: { id: review.userId },
        data: {
          [action === "like" ? "likedReviews" : "dislikedReviews"]: {
            decrement: 1,
          },
        },
      });
    } else {
      // Update reaction
      await prisma.reviewReaction.update({
        where: {
          id: existingReaction.id,
        },
        data: { reaction: action },
      });
      await prisma.review.update({
        where: { id },
        data: {
          likes: action === "like" ? { increment: 1 } : { decrement: 1 },
          dislikes: action === "dislike" ? { increment: 1 } : { decrement: 1 },
        },
      });
      await prisma.user.update({
        where: { id: review.userId },
        data: {
          likedReviews: action === "like" ? { increment: 1 } : { decrement: 1 },
          dislikedReviews:
            action === "dislike" ? { increment: 1 } : { decrement: 1 },
        },
      });
    }
  } else {
    // Create new reaction
    await prisma.reviewReaction.create({
      data: {
        reviewId: id,
        userId: currentUser.id,
        reaction: action,
      },
    });
    await prisma.review.update({
      where: { id },
      data: {
        [action === "like" ? "likes" : "dislikes"]: { increment: 1 },
      },
    });
    await prisma.user.update({
      where: { id: review.userId },
      data: {
        [action === "like" ? "likedReviews" : "dislikedReviews"]: {
          increment: 1,
        },
      },
    });
  }

  return NextResponse.json({ success: true });
}
