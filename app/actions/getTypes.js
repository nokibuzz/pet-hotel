import { prisma } from "@/app/libs/prismadb";

export default async function getTypes(params) {
  try {
    const {
      userId,
      startDate,
      endDate,
      title,
      petType,
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
      location,
    } = await params;

    const filters = [];
    const parameters = [];
    let distanceSelect = '';

    if (petType) {
      filters.push(`t.name = $${parameters.length + 1}`);
      parameters.push(petType);
    }

    if (minPrice) {
      const parsedMin = parseFloat(minPrice);
      if (!isNaN(parsedMin)) {
        filters.push(`t."defaultPrice" >= $${parameters.length + 1}`);
        parameters.push(parsedMin);
      }
    }

    if (maxPrice) {
      const parsedMax = parseFloat(maxPrice);
      if (!isNaN(parsedMax)) {
        filters.push(`t."defaultPrice" <= $${parameters.length + 1}`);
        parameters.push(parsedMax);
      }
    }
    if (category) {
      const categoryArray = category.split(',');
      filters.push(`l.category = ANY($${parameters.length + 1})`);
      parameters.push(categoryArray);
    }

    if (location) {
      distanceSelect = `, public.ST_Distance(
        l.location::public.geography,
        public.ST_SetSRID(public.ST_MakePoint($${parameters.length + 1}, $${parameters.length + 2}), 4326)::public.geography
      ) as distance`;
      parameters.push(location.longitude, location.latitude);
      
      filters.push(`
        public.ST_DWithin(
          l.location::public.geography,
          public.ST_SetSRID(public.ST_MakePoint($${parameters.length + 1}, $${parameters.length + 2}), 4326)::public.geography,
          $${parameters.length + 3}
        )
      `);
      parameters.push(location.longitude, location.latitude, (nearMe || 10) * 1000);
    }

    if (facility) {
      const facilities = [];
      if (facility.includes("Food")) facilities.push(`l."hasFood" = true`);
      if (facility.includes("Grooming")) facilities.push(`l."hasGrooming" = true`);
      if (facility.includes("Veterinarian")) facilities.push(`l."hasVet" = true`);
      if (facilities.length) filters.push(`(${facilities.join(" OR ")})`);
    }

    if (review) {
      const parsedReview = parseFloat(review);
      filters.push(`l."overallReview" >= $${parameters.length + 1}`);
      parameters.push(parsedReview);
    }

    if (hasCancelation) {
      const parsedValue = hasCancelation === 'true' || hasCancelation === true;
      filters.push(`l."hasCancelation" = $${parameters.length + 1}`);
      parameters.push(parsedValue);
    }

    if (paymentMethodsCards) {
      const parsedValue = paymentMethodsCards === 'true' || paymentMethodsCards === true;
      filters.push(`l."paymentMethodsCards" = $${parameters.length + 1}`);
      parameters.push(parsedValue);
    }

    if (paymentMethodsCash) {
      const parsedValue = paymentMethodsCash === 'true' || paymentpaymentMethodsCashMethodsCards === true;
      filters.push(`l."paymentMethodsCash" = $${parameters.length + 1}`);
      parameters.push(parsedValue);
    }

    if (startDate && endDate && petType) {
      filters.push(`
        NOT EXISTS (
          SELECT 1 FROM "Availability" a 
          WHERE 
            a."typeId" = t.id
            AND a.available = false
            AND a.date BETWEEN $${parameters.length + 1} AND $${parameters.length + 2}
            AND a."typeName" = $${parameters.length + 3}
        )
      `);
      parameters.push(new Date(startDate), new Date(endDate), petType);
    }

    if (userId) {
      throw new Error('Usao sam za user Id');
      // filters.push(`l."userId" = $${parameters.length + 1}`);
      // parameters.push(userId);
    }
    if (title) {
      throw new Error('Usao sam za title');
      // filters.push(`l.title = $${parameters.length + 1}`);
      // parameters.push(title);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

    const orderClause = 
      sortBy === "title"
        ? `l.title ASC`
        : sortBy === "price"
        ? `t."defaultPrice" ASC`
        : sortBy === "rating"
        ? `l."overallReview" DESC`
        : sortBy === "distance" && location
        ? `distance ASC`
        : `l."createdAt" DESC`;

    const query = `
      SELECT 
        t.id as "typeId",
        t.name,
        t.capacity,
        t."defaultPrice",
        t."weekendPrice",
        l.id, 
        l."userId", 
        l.title, 
        l.description, 
        l."imageSrc", 
        l."createdAt", 
        l.category, 
        l.price, 
        l."checkInTime", 
        l."checkOutTime", 
        l."hasCancelation", 
        l."allowBooking", 
        l."paymentMethodsCards", 
        l."paymentMethodsCash", 
        l."paymentMethodsAccount", 
        l."hasFood", 
        l."hasGrooming", 
        l."hasVet", 
        l."addionalInformation", 
        l."blockedBreeds", 
        l."capacityType", 
        l."totalPlaces", 
        l."totalReviews", 
        l."overallReview", 
        l."addressLabel"
        ${distanceSelect}
      FROM "Type" t
      JOIN "Listing" l ON t."listingId" = l.id
      ${whereClause}
      ORDER BY ${orderClause}
    `;

    const rawTypes = await prisma.$queryRawUnsafe(query, ...parameters);

    const types = rawTypes.map((row) => {
      const {
        typeId,
        name,
        capacity,
        defaultPrice,
        weekendPrice,
        id, userId, title, description, imageSrc, createdAt, category,
        price, checkInTime, checkOutTime, hasCancelation, allowBooking,
        paymentMethodsCards, paymentMethodsCash, paymentMethodsAccount,
        hasFood, hasGrooming, hasVet, addionalInformation, blockedBreeds,
        capacityType, totalPlaces, totalReviews, overallReview, addressLabel,
        distance,
      } = row;

      return {
        id: typeId,
        name,
        capacity,
        defaultPrice,
        weekendPrice,
        listing: {
          id,
          userId,
          title,
          description,
          imageSrc,
          createdAt,
          category,
          price,
          checkInTime,
          checkOutTime,
          hasCancelation,
          allowBooking,
          paymentMethodsCards,
          paymentMethodsCash,
          paymentMethodsAccount,
          hasFood,
          hasGrooming,
          hasVet,
          addionalInformation,
          blockedBreeds,
          capacityType,
          totalPlaces,
          totalReviews,
          overallReview,
          addressLabel,
          distance,
        },
      };
    });
   
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