import { NextResponse } from "next/server";

import { prisma } from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.error();
    }

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

    const user = await prisma.user.update({
      where: { id: userId },
      data: { totalReviews: { increment: 1 } },
    });

    const listing = await prisma.listing.update({
      where: { id: listingId },
      data: { totalReviews: { increment: 1 } },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.log(error);
  }
}
