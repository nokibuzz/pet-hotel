import { prisma } from "@/app/libs/prismadb";

export default async function getReviews(params) {
  try {
    const {
      userId,
      listingId,
      sortBy = "createdAt",
      sortOrder = "desc",
      skip = 0,
      take = 5,
    } = await params;

    const query = {};

    if (listingId) {
      query.listingId = listingId;
    }

    // will be used for my reviews only checkbox
    // if (userId) {
    //   query.userId = userId;
    // }

    const reviews = await prisma.review.findMany({
      where: query,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take,
      include: {
        user: true,
      },
    });

    const totalReviews = await prisma.review.count();

    return { reviews, totalReviews };
  } catch (error) {
    throw new Error(error);
  }
}
