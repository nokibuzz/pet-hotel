import { prisma } from "@/app/libs/prismadb";

export default async function getListings(params) {
  try {
    const {
      userId,
      guestCount, 
      startDate,
      endDate,
      latitude,
      longitude,
      category,
      minPrice,
      maxPrice,
      nearMe,
      facility,        
      hasCancelation,
      paymentMethodsCards,
      paymentMethodsCash,
      review,
    } = await params;

    const query = {};

    if (userId) {
      query.userId = userId;
    }

    if (category) {
      const categoriesArray = category.split(",");
      query.category = { $in: categoriesArray };
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

    if (minPrice && maxPrice) {
      query.price = {
        $gte: parseInt(minPrice, 10),
        $lte: parseInt(maxPrice, 10),
      };
    } else if (minPrice) {
      query.price = {
        $gte: parseInt(minPrice, 10),
      };
    } else if (maxPrice) {
      query.price = {
        $lte: parseInt(maxPrice, 10),
      };
    }

    if (facility) {
      const facilityArray = facility.split(",");
      if (facilityArray.includes("Food")) {
        query.hasFood = true;
      }
      if (facilityArray.includes("Grooming")) {
        query.hasGrooming = true;
      }
      if (facilityArray.includes("Veterinarian")) {
        query.hasVet = true;
      }
    }

    if (hasCancelation) {
      query.hasCancelation = true;
    }
    if (paymentMethodsCards) {
      query.paymentMethodsCards = true;
    }
    if (paymentMethodsCash) {
      query.paymentMethodsCash = true;
    }

    if (review) {
      query.overallReview = { $gte: parseInt(review, 10) };
    }

    const pipeline = [];

    if (latitude && longitude) {
      pipeline.push({
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: "distance",
          spherical: true,
          maxDistance: nearMe ? nearMe * 1000 : 10000,
        },
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
        userId: { $toString: "$userId" },
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
      cursor: {},
    });

    const safeListings =
      listings.cursor?.firstBatch?.map((listing) => ({
        ...listing,
        createdAt: listing.createdAt?.$date || null,
      })) || [];

    return safeListings;
  } catch (error) {
    throw new Error(error);
  }
}
