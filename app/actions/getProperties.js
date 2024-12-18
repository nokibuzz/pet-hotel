import { prisma } from "@/app/libs/prismadb";

export default async function getProperties(params) {
  try {
    const { userId, startDate, endDate, category } = await params;

    const query = {};

    if (userId) {
      query.userId = userId;
    }

    if (category) {
      query.category = category;
    }

    if (startDate && endDate) {
      query.reservations = {
        none: {
          OR: [
            {
              endDate: { gte: new Date(startDate) },
              startDate: { lte: new Date(startDate) },
            },
            {
              startDate: { lte: new Date(endDate) },
              endDate: { gte: new Date(endDate) },
            },
          ],
        },
      };
    }

    const listings = await prisma.listing.findMany({
      where: query,
      orderBy: { createdAt: "desc" },
    });

    return listings;
  } catch (error) {
    throw new Error(error);
  }
}
