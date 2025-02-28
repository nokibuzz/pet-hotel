import { NextResponse } from "next/server";

import { prisma } from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const {
    title,
    description,
    imageSrc,
    category,
    totalPlaces,
    checkInTime,
    checkOutTime,
    hasCancelation,
    allowBooking,
    paymentMethodsCards,
    paymentMethodsCash,
    hasFood,
    hasGrooming,
    hasVet,
    addionalInformation,
    locationLongitude,
    locationLatitude,
    addressLabel,
    capacityType, // TOTAL or ADVANCED
    types, // Array of { typeName, capacity } (if ADVANCED)
    pricing, // Array of {typeName, defaultPrice, weekendPrice} (if ADVANCED), if TOTAL only 1 element
  } = body;

  const location = {
    type: "Point",
    coordinates: [locationLongitude, locationLatitude],
  };

  const listing = await prisma.listing.create({
    data: {
      title,
      description,
      imageSrc,
      category,
      totalPlaces: parseInt(totalPlaces),
      price: 10, // for now, delete in the future and see how to calculate
      userId: currentUser.id,
      checkInTime,
      checkOutTime,
      hasCancelation,
      allowBooking,
      paymentMethodsCards,
      paymentMethodsCash,
      hasFood,
      hasGrooming,
      hasVet,
      addionalInformation,
      location,
      addressLabel,
      capacityType, // Store CapacityType (TOTAL or ADVANCED)
    },
  });

  // Handle Capacity Types
  if (capacityType === "ADVANCED" && types?.length > 0) {
    const typeMap = {}; // Temporary map to store { typeName: id }

    for (const type of types) {
      const createdType = await prisma.type.create({
        data: {
          listingId: listing.id,
          name: type.name,
          capacity: type.capacity,
        },
      });
      typeMap[type.name] = createdType.id;
    }
    for (const pricingObj of pricing) {
      await prisma.typePricing.create({
        data: {
          listingId: listing.id,
          typeId: typeMap[pricingObj.typeName],
          defaultPrice: parseFloat(pricingObj.defaultPrice),
          weekendPrice: parseFloat(pricingObj.weekendPrice),
        },
      });
    }
  } else {
    // If TOTAL capacity, save pricing in TypePricing without specific types
    await prisma.typePricing.create({
      data: {
        listingId: listing.id,
        typeId: null,
        defaultPrice: parseFloat(pricing[0]?.defaultPrice ?? 0),
        weekendPrice: parseFloat(pricing[0]?.weekendPrice ?? 0),
      },
    });
  }

  return NextResponse.json(listing);
}

export async function PUT(request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const {
    id,
    title,
    description,
    imageSrc,
    category,
    totalPlaces,
    checkInTime,
    checkOutTime,
    hasCancelation,
    allowBooking,
    paymentMethodsCards,
    paymentMethodsCash,
    hasFood,
    hasGrooming,
    hasVet,
    addionalInformation,
    locationLongitude,
    locationLatitude,
    addressLabel,
    capacityType,
    types,
    pricing,
  } = body;

  if (!id) {
    return NextResponse.json(
      { error: "Listing ID is required." },
      { status: 400 }
    );
  }

  const location =
    locationLongitude && locationLatitude
      ? {
          type: "Point",
          coordinates: [locationLongitude, locationLatitude],
        }
      : undefined;

  try {
    const updatedListing = await prisma.listing.update({
      where: { id },
      data: {
        title,
        description,
        imageSrc,
        category,
        totalPlaces,
        checkInTime,
        checkOutTime,
        hasCancelation,
        allowBooking,
        paymentMethodsCards,
        paymentMethodsCash,
        hasFood,
        hasGrooming,
        hasVet,
        addionalInformation,
        location,
        addressLabel,
        capacityType,
        totalPlaces,
      },
    });

    await prisma.type.deleteMany({
      where: { listingId: id },
    });

    await prisma.typePricing.deleteMany({
      where: { listingId: id },
    });

    // Reinsert types
    if (capacityType === "ADVANCED" && types?.length > 0) {
      const typeMap = {}; // Temporary map to store { typeName: id }

      for (const type of types) {
        const createdType = await prisma.type.create({
          data: {
            listingId: id,
            name: type.name,
            capacity: type.capacity,
          },
        });
        typeMap[type.name] = createdType.id;
      }
      for (const pricingObj of pricing) {
        await prisma.typePricing.create({
          data: {
            listingId: id,
            typeId: typeMap[pricingObj.typeName],
            defaultPrice: parseFloat(pricingObj.defaultPrice),
            weekendPrice: parseFloat(pricingObj.weekendPrice),
          },
        });
      }
    } else {
      // If TOTAL capacity, just add pricing without types
      if (pricing?.length > 0) {
        await prisma.typePricing.create({
          data: {
            listingId: id,
            typeId: null,
            defaultPrice: parseFloat(pricing[0]?.defaultPrice ?? 0),
            weekendPrice: parseFloat(pricing[0]?.weekendPrice ?? 0),
          },
        });
      }
    }

    return NextResponse.json(updatedListing);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { listingId } = body;

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid property ID");
  }

  const listing = await prisma.listing.deleteMany({
    where: {
      id: listingId,
      userId: currentUser.id,
    },
  });

  return NextResponse.json(listing);
}
