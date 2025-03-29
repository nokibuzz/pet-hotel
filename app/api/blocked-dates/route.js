import { prisma } from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const listingId = searchParams.get("listingId");
  const typeId = searchParams.get("typeId");
  const startDate = searchParams.get("searchStart");
  const endDate = searchParams.get("searchEnd");

  if (!listingId || !typeId || !startDate || !endDate) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    let searchStart = new Date(startDate);
    let searchEnd = new Date(endDate);

    // Fetch blocked dates for the listing
    const blockedDates = await prisma.blockedDate.findMany({
      where: {
        listingId,
        typeId,
        OR: [{ startDate: { lte: searchEnd }, endDate: { gte: searchStart } }],
      },
      select: { id: true, startDate: true, endDate: true, reason: true },
    });

    // Fetch nonblocking dates for the given typeId
    const nonblockingDates = await prisma.availability.findMany({
      where: {
        typeId,
        date: { gte: searchStart, lte: searchEnd },
      },
      select: { date: true },
    });

    return NextResponse.json({ blockedDates: blockedDates, nonblockingDates: nonblockingDates.map((day) => new Date(day.date)) });
  } 
  catch (error) {
    return NextResponse.json({ error: "Failed to fetch blocked dates for listing:" }, { status: 500 });
  }
}

export async function PUT(request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
 
  const {
    property,
    type,
    addedDates,
    removedDates,
    updatedDates
  } = body;

  if (
    !property ||
    !type ||
    !addedDates ||
    !removedDates ||
    !updatedDates
  ) {
    return NextResponse.error();
  }

  return await prisma.$transaction(
    async (prisma) => {
     
      const dbUpdates = [];

      if (removedDates.length > 0) {
        const deletedDates = removedDates.map(date => date.id);

        console.log('Delete blocked dates: ', deletedDates);

        dbUpdates.push(
          prisma.blockedDate.deleteMany({
            where: { id: {
              in: deletedDates
            }},
          })
        );
      }

      if (addedDates.length > 0) {

        const dbType = await prisma.type.findFirst({
          where: { listingId: property, name:  type},
          select: { id: true },
        });

        addedDates.forEach((date) => {
          console.log('Add new blocked date: ', date);

          dbUpdates.push(
            prisma.blockedDate.create({
              data: {
                listingId: property,
                typeId: dbType.id,
                startDate: new Date(date.startDate),
                endDate: new Date(date.endDate),
                reason: ""
              },
            })
          );
        });
      }

      if (updatedDates.length > 0) {
        updatedDates.forEach((date) => {
          console.log('Update existing blocked date: ', date);

          dbUpdates.push(
            prisma.blockedDate.update({
              where: { id: date.id },
              data: {
                startDate: new Date(date.startDate),
                endDate: new Date(date.endDate),
              },
            })
          );
        });
      }

      await Promise.all(dbUpdates);

      return NextResponse.json({ message: "Block dates updated" });
    },
    {
      timeout: 10000
    }
  );
}
