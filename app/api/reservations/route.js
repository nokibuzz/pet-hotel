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
    startDate,
    endDate,
    typeId,
    petId,
    typeName,
    totalPrice,
    breed,
    breedDescription,
    paymentMethod,
    usedForBlocking
  } = body;

  let payment = !usedForBlocking ? paymentMethod : 'Cash';

  if (
    !typeId ||
    !startDate ||
    !endDate ||
    !totalPrice ||
    !typeName ||
    !breed ||
    !payment
  ) {
    return NextResponse.error();
  }

  // Fetch Existing Availability for Selected Dates
  const existingAvailability = await prisma.availability.findMany({
    where: {
      typeId,
      date: { gte: startDate, lte: endDate },
    },
  });

  console.log("existingAvailability", JSON.stringify(existingAvailability));
  const hasNoSlotsLeft = existingAvailability.some(
    (item) => item.totalSlots <= 0
  );
  if (hasNoSlotsLeft) {
    console.error(
      "There are availability slots with no remaining slots available to book!"
    );
    return NextResponse.error();
  }

  return await prisma.$transaction(
    async (prisma) => {
      // Create the Reservation
      const reservationData = {
        userId: currentUser.id,
        typeId,
        petId,
        startDate,
        endDate,
        totalPrice,
        breed,
        breedDescription,
        paymentMethod: payment,
        status: !usedForBlocking ? "pending" : "approved",
      };

      console.log("reservationData", JSON.stringify(reservationData));

      const reservation = await prisma.reservation.create({
        data: reservationData,
      });

      // Determine Capacity if No Existing Availability
      let totalCapacity =
        existingAvailability?.length > 0
          ? null
          : (
              await prisma.type.findUnique({
                where: { id: typeId },
                select: { capacity: true },
              })
            )?.capacity || 0;

      console.log("totalCapacity", totalCapacity);

      // Prepare Availability Updates
      const availabilityUpdates = [];

      let currentDate = new Date(startDate);

      while (currentDate <= new Date(endDate)) {
        const dateKey = currentDate.toISOString().split("T")[0];
        const existingEntry = existingAvailability.find(
          (a) => a.date.toISOString().split("T")[0] === dateKey
        );

        if (existingEntry) {
          // Update existing availability
          console.log("updating existing availability");
          availabilityUpdates.push(
            prisma.availability.update({
              where: { id: existingEntry.id },
              data: {
                totalSlots: { decrement: 1 },
                available: existingEntry.totalSlots > 1,
              },
            })
          );
        } else {
          // Create new availability entry
          console.log(
            "creating new availability, totalCapacity ",
            totalCapacity
          );
          availabilityUpdates.push(
            prisma.availability.create({
              data: {
                typeId,
                typeName,
                date: new Date(currentDate),
                totalSlots: totalCapacity - 1,
                available: totalCapacity > 1,
              },
            })
          );
        }

        currentDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Execute all updates in parallel
      const avUpdates = await Promise.all(availabilityUpdates);
      console.log("Availability updated", JSON.stringify(avUpdates));

      return NextResponse.json(reservation);
    },
    {
      timeout: 10000, // 10 seconds timeout (default is 5s)
    }
  );
}

export async function DELETE(request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { reservationId } = body;

  if (!reservationId || typeof reservationId !== "string") {
    throw new Error("Invalid Reservation ID");
  }

  const reservation = await prisma.reservation.deleteMany({
    where: {
      id: reservationId,
      OR: [{ userId: currentUser.id }, { listing: { userId: currentUser.id } }],
    },
  });

  return NextResponse.json(reservation);
}
