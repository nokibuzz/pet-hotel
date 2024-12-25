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
    guestCount,
    price,
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
      guestCount,
      price: parseInt(price, 10),
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
    },
  });

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
    guestCount,
    price,
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
        guestCount,
        price: parseInt(price, 10),
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
      },
    });

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
