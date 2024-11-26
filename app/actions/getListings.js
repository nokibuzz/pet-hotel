import { prisma } from "@/app/libs/prismadb";

export default async function getListings(params) {
  try {
    // const { userId, guestCount, startDate, endDate, locationValue, category } =
    //   await params;

    console.log("par", JSON.stringify(params));

    // const query = {};

    // if (params?.userId) {
    //   query.userId = params.userId;
    // }

    // if (params?.category) {
    //   query.category = params.category;
    // }

    // if (params?.guestCount) {
    //   query.guestCount = { gte: +params.guestCount };
    // }

    // if (locationValue) {
    //   query.locationValue = locationValue;
    // }

    // if (params?.startDate && params?.endDate) {
    //   query.NOT = {
    //     reservations: {
    //       some: {
    //         OR: [
    //           {
    //             endDate: { gte: params.startDate },
    //             startDate: { lte: params.startDate },
    //           },
    //           {
    //             startDate: { lte: params.endDate },
    //             endDate: { gte: params.endDate },
    //           },
    //         ],
    //       },
    //     },
    //   };
    // }

    const listings = await prisma.listing.findMany({
      //   where: query,
      orderBy: {
        createdAt: "desc",
      },
    });

    const safeListings = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }));

    return safeListings;
  } catch (error) {
    throw new Error(error);
  }
}
