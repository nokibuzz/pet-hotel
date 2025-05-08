import { NextResponse } from "next/server";

import { prisma } from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { logError } from "@/app/libs/logtail.js";

export async function POST(request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  try {
    const body = await request.json();

    const {
      userId,
      listingId,
      overallRating,
      locationRating,
      serviceRating,
      checkInRating,
      title,
      positiveReview,
      negativeReview,
      suggestUs,
    } = body;

    if (
      !userId ||
      !listingId ||
      !overallRating ||
      !locationRating ||
      !serviceRating ||
      !checkInRating ||
      !title ||
      !positiveReview ||
      !negativeReview
    ) {
      return NextResponse.error();
    }

    const review = await prisma.review.create({
      data: {
        userId,
        listingId,
        overallRating,
        locationRating,
        serviceRating,
        checkInRating,
        title,
        positiveReview,
        negativeReview,
        suggestUs,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { totalReviews: { increment: 1 } },
    });

    // 1. Get average overallRating for the listing
    const [overallReviewResult] = await prisma.$queryRaw`
      SELECT 
        AVG("overallRating") AS "averageReview"
      FROM "Review"
      WHERE "listingId" = ${listingId}
    `;

    const averageReview = overallReviewResult?.averageReview ?? 0;

    // 2. Update the listing with the average review and increment total reviews
    await prisma.listing.update({
      where: { id: listingId },
      data: {
        overallReview: averageReview,
        totalReviews: { increment: 1 },
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    logError(request, currentUser.id, error);
    return NextResponse.error();
  }
}
