import { prisma } from "@/app/libs/prismadb";

export default async function getTypes(params) {
  try {
    const {
      userId,
      startDate,
      endDate,
      title,
      petType,
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
      sortBy,
    } = await params;

    const typeFilters = {};

    if (petType) {
      typeFilters.name = petType;
    }

    if (minPrice && maxPrice) {
      typeFilters.defaultPrice = {
        gte: parseFloat(minPrice),
        lte: parseFloat(maxPrice),
      };
    } else if (minPrice) {
      typeFilters.defaultPrice = { gte: parseFloat(minPrice) };
    } else if (maxPrice) {
      typeFilters.defaultPrice = { lte: parseFloat(maxPrice) };
    }

    // continue from here
    const listingFilters = {};
    if (userId) {
      listingFilters.userId = userId;
    }

    if (category) {
      const categoriesArray = category.split(",");
      listingFilters.category = { in: categoriesArray };
    }
    if (title) {
      listingFilters.title = title;
    }

    // if (startDate && endDate) {
    //   query.reservations = {
    //     $not: {
    //       $elemMatch: {
    //         $or: [
    //           {
    //             endDate: { $gte: new Date(startDate) },
    //             startDate: { $lte: new Date(startDate) },
    //           },
    //           {
    //             startDate: { $lte: new Date(endDate) },
    //             endDate: { $gte: new Date(endDate) },
    //           },
    //         ],
    //       },
    //     },
    //   };
    // }

    if (facility) {
      const facilityArray = facility.split(",");
      if (facilityArray.includes("Food")) {
        listingFilters.hasFood = true;
      }
      if (facilityArray.includes("Grooming")) {
        listingFilters.hasGrooming = true;
      }
      if (facilityArray.includes("Veterinarian")) {
        listingFilters.hasVet = true;
      }
    }

    if (hasCancelation) {
      listingFilters.hasCancelation = true;
    }
    if (paymentMethodsCards) {
      listingFilters.paymentMethodsCards = true;
    }
    if (paymentMethodsCash) {
      listingFilters.paymentMethodsCash = true;
    }

    if (review) {
      listingFilters.overallReview = { gte: parseInt(review, 10) };
    }

    const availabilityFilter =
      startDate && endDate && petType
        ? {
            Availability: {
              none: {
                available: false,
                date: { gte: startDate, lte: endDate },
                typeName: petType,
              },
            },
          }
        : {}; // If no dates provided, do not filter based on availability

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
          maxDistance: nearMe ? nearMe * 1000 : 10000, // Convert km to meters
        },
      });
    }

    pipeline.push({
      $match: {
        ...typeFilters,
        listing: {
          ...listingFilters,
        },
        ...availabilityFilter,
      },
    });

    pipeline.push({
      $addFields: {
        id: { $toString: "$_id" },
        userId: { $toString: "$userId" },
      },
    });

    if (sortBy) {
      switch (sortBy) {
        case "title":
          pipeline.push({ $sort: { "listing.title": 1 } });
          break;
        case "price":
          pipeline.push({ $sort: { defaultPrice: 1 } });
          break;
        case "rating":
          pipeline.push({ $sort: { "listing.overallReview": -1 } });
          break;
        case "distance":
          pipeline.push({ $sort: { distance: 1 } });
          break;
        default:
          pipeline.push({ $sort: { createdAt: -1 } });
          break;
      }
    } else {
      pipeline.push({ $sort: { createdAt: -1 } });
    }

    const types = await prisma.type.findMany({
      where: {
        ...typeFilters,
        listing: {
          ...listingFilters,
        },
        ...availabilityFilter,
      },
      include: {
        listing: true, // Includes the full listing object
      },
    });

    // Group response by listing
    const groupedResults = types.reduce((acc, type) => {
      const listingId = type.listing.id;
      if (!acc[listingId]) {
        acc[listingId] = {
          listing: type.listing,
          types: [],
        };
      }
      acc[listingId].types.push({
        id: type.id,
        name: type.name,
        capacity: type.capacity,
        defaultPrice: type.defaultPrice,
        weekendPrice: type.weekendPrice,
      });

      return acc;
    }, {});

    return Object.values(groupedResults);
  } catch (error) {
    throw new Error(error);
  }
}
