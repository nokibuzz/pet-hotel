import { prisma } from "@/app/libs/prismadb";

export default async function getListings(params) {
  try {
    const { userId, guestCount, startDate, endDate, latitude, longitude, category } =
      await params;

    const query = {};

    if (userId) {
      query.userId = userId;
    }

    if (category) {
      query.category = category;
    }

    if (guestCount) {
      query.guestCount = { $gte: parseInt(guestCount, 10) };
    }

    if (startDate && endDate) {
      query.reservations = {
        $not: {
          $elemMatch: {
            $or: [
              {
                endDate: { $gte: new Date(startDate) },
                startDate: { $lte: new Date(startDate) },
              },
              {
                startDate: { $lte: new Date(endDate) },
                endDate: { $gte: new Date(endDate) },
              },
            ],
          },
        },
      };
    }

    const pipeline = [];

    if (latitude && longitude) {
      pipeline.push({
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          distanceField: "distance",
          spherical: true,
          maxDistance: 10000
        }
      });
    }

    if (query) {
      pipeline.push({
        $match: query,
      });
    }
    
    pipeline.push({
      $addFields: {
        id: { $toString: "$_id" },
        userId: { $toString: "$userId" }
      },
    });

    pipeline.push({
      $sort: {
        createdAt: -1,
      },
    });

    const listings = await prisma.$runCommandRaw({
      aggregate: "Listing",
      pipeline: pipeline,
      cursor: {}
    });

    const safeListings = listings.cursor?.firstBatch?.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt?.$date || null,
    })) || [];

    return safeListings;
  } catch (error) {
    throw new Error(error);
  }
}
