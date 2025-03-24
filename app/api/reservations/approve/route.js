// export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

import { prisma } from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function PUT(request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();

  const { reservationId, listingId } = body;

  if (!reservationId || !listingId) {
    return NextResponse.error();
  }

  const listingOwner = await prisma.listing.findUnique({
    where: {
      id: listingId,
    },
    select: {
      userId: true,
    },
  });

  console.log("Owner of the listing: ", JSON.stringify(listingOwner));
  if (currentUser.id !== listingOwner.userId) {
    return NextResponse.error();
  }

  const approvedReservation = await prisma.reservation.update({
    where: {
      id: reservationId,
    },
    data: {
      status: "approved",
    },
  });

  return NextResponse.json(approvedReservation);
}
