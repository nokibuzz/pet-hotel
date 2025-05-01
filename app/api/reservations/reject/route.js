import { NextResponse } from "next/server";

import { prisma } from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { logInfo } from "@/app/libs/logtail.js";

export async function PUT(request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();

  const {
    reservationId,
    listingId,
    typeId,
    totalSlots,
    startDate,
    endDate,
    rejectReason,
  } = body;

  if (
    !reservationId ||
    !typeId ||
    !totalSlots ||
    !listingId ||
    !rejectReason ||
    !startDate ||
    !endDate
  ) {
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

  logInfo(request, currentUser.id, 'Owner of the listing:' + JSON.stringify(listingOwner));
  if (currentUser.id !== listingOwner.userId) {
    return NextResponse.error();
  }

  return await prisma.$transaction(
    async (prisma) => {
      // Update the Reservation
      const reservation = await prisma.reservation.update({
        where: {
          id: reservationId,
        },
        data: {
          status: "rejected",
          rejectReason,
        },
      });

      logInfo(request, currentUser.id, "Making reservation from dateTime available again!");
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Find all availability records in the specified date range and for the given typeId
      const availabilities = await prisma.availability.findMany({
        where: {
          typeId: typeId,
          date: {
            gte: start,
            lte: end,
          },
        },
      });

      logInfo(request, currentUser.id, "availability", availabilities);

      // Prepare the promises for the operations (delete, update, or reactivate)
      const availabilityUpdates = availabilities.map((availability) => {
        if (availability.totalSlots === totalSlots - 1) {
          // If totalSlots == passedParamTotalSlots - 1, delete the availability
          return prisma.availability.delete({
            where: {
              id: availability.id,
            },
          });
        } else {
          // If available is false, update the totalSlots and set available to true
          return prisma.availability.update({
            where: {
              id: availability.id,
            },
            data: {
              totalSlots: { increment: 1 },
              available: true,
            },
          });
        }
      });

      // Execute all updates in parallel
      const avUpdates = await Promise.all(availabilityUpdates);
      logInfo(request, currentUser.id, "Availabilities updated, deleted or reactivated", avUpdates);

      return NextResponse.json(reservation);
    },
    {
      timeout: 10000, // 10 seconds timeout (default is 5s)
    }
  );
}
