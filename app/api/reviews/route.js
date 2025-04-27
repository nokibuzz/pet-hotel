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

    const overallReview = await prisma.$runCommandRaw({
      aggregate: "Review",
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$listingId", { $toObjectId: listingId }] },
          },
        },
        {
          $group: {
            _id: "$listingId",
            averageReview: { $avg: "$overallRating" },
          },
        },
      ],
      cursor: {},
    });

    await prisma.listing.update({
      where: { id: listingId },
      data: { 
        overallReview: overallReview.cursor?.firstBatch[0]?.averageReview || 0,
        totalReviews: { increment: 1 } 
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    logError(request, currentUser.id, error);
  }
}
