import { prisma } from "@/app/libs/prismadb";

export default async function getReviews(params) {
  try {
    const {
      userId,
      listingId,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
    } = await params;

    // const PAGE_SIZE = 5;
    // const skip = (page - 1) * PAGE_SIZE;

    const query = {};

    if (listingId) {
      query.listingId = listingId;
    }

    // if (userId) {
    //   query.userId = userId;
    // }

    const reviews = await prisma.review.findMany({
      where: query,
      orderBy: { [sortBy]: sortOrder },
      // skip,
      // take: PAGE_SIZE,
    });

    const totalReviews = await prisma.review.count({ where: query });

    return { reviews, totalReviews };
  } catch (error) {
    throw new Error(error);
  }
}
