import { NextResponse } from "next/server";

import { prisma } from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { randomUUID } from 'crypto';
import { logError, logInfo } from "@/app/libs/logtail.js";

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
    paymentMethodsAccount,
    hasFood,
    hasGrooming,
    hasVet,
    addionalInformation,
    locationLongitude,
    locationLatitude,
    addressLabel,
    capacityType, // TOTAL or ADVANCED
    types, // Array of { typeName, capacity } (if ADVANCED)
    blockedBreeds,
  } = body;

  const newId = randomUUID();

  return await prisma.$transaction(
    async (prisma) => {
      await prisma.$queryRaw`
        INSERT INTO "Listing" (
          "id", "title", "description", "imageSrc", "category",
          "totalPlaces", "price", "userId", "checkInTime",
          "checkOutTime", "hasCancelation", "allowBooking",
          "paymentMethodsCards", "paymentMethodsCash", "paymentMethodsAccount",
          "hasFood", "hasGrooming", "hasVet", "addionalInformation",
          "addressLabel", "capacityType", "blockedBreeds", "location"
        ) VALUES (
          ${newId}, ${title}, ${description}, ${imageSrc}, ${category},
          ${parseInt(totalPlaces)}, 10, ${currentUser.id}, ${checkInTime},
          ${checkOutTime}, ${hasCancelation}, ${allowBooking},
          ${paymentMethodsCards}, ${paymentMethodsCash}, ${paymentMethodsAccount},
          ${hasFood}, ${hasGrooming}, ${hasVet}, ${addionalInformation},
          ${addressLabel}, ${capacityType}::"CapacityType", ${blockedBreeds},
          public.ST_SetSRID(
            public.ST_Point(
              ${locationLongitude}::double precision,
              ${locationLatitude}::double precision
            ),
            4326
          )
        )
      `;

      logInfo(request, currentUser.id, 'Created listing with title' + title);

      for (const type of types) {
        logInfo(request, currentUser.id, "Creating type: " + JSON.stringify(type));
        await prisma.type.create({
          data: {
            listingId: newId,
            name: type.name,
            capacity: type.capacity,
            defaultPrice: type.defaultPrice,
            weekendPrice: type.weekendPrice,
          },
        });
      }

      return NextResponse.json(newId);
    },
    {
      timeout: 10000, // 10 seconds timeout (default is 5s)
    }
  );
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
    paymentMethodsAccount,
    hasFood,
    hasGrooming,
    hasVet,
    addionalInformation,
    locationLongitude,
    locationLatitude,
    addressLabel,
    capacityType,
  } = body;

  if (!id) {
    return NextResponse.json(
      { error: "Listing ID is required." },
      { status: 400 }
    );
  }

  try {
    await prisma.$queryRaw`
      UPDATE dev."Listing"
      SET
        "title" = ${title},
        "description" = ${description},
        "imageSrc" = ${imageSrc},
        "category" = ${category},
        "totalPlaces" =${parseInt(totalPlaces)},
        "checkInTime" = ${checkInTime},
        "checkOutTime" = ${checkOutTime},
        "hasCancelation" = ${hasCancelation},
        "allowBooking" = ${allowBooking},
        "paymentMethodsCards" = ${paymentMethodsCards},
        "paymentMethodsCash" = ${paymentMethodsCash},
        "paymentMethodsAccount" = ${paymentMethodsAccount},
        "hasFood" = ${hasFood},
        "hasGrooming" = ${hasGrooming},
        "hasVet" = ${hasVet},
        "addionalInformation" = ${addionalInformation},
        "location" = public.ST_SetSRID(
            public.ST_Point(
              ${locationLongitude}::double precision,
              ${locationLatitude}::double precision
            ),
            4326
          ),
        "addressLabel" = ${addressLabel},
        "capacityType" = ${capacityType}::"CapacityType"
      WHERE
        "id" = ${id}
    `;

    return NextResponse.json(id);
  } catch (error) {
    logError(request, currentUser.id, error);
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
