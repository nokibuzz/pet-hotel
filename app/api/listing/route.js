// export const dynamic = "force-dynamic";

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
    roomCount,
    guestCount,
    location,
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
  } = body;

  const listing = await prisma.listing.create({
    data: {
      title,
      description,
      imageSrc,
      category,
      roomCount,
      guestCount,
      locationValue: location.value,
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
    },
  });

  return NextResponse.json(listing);
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
