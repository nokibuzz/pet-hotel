import { prisma } from "@/app/libs/prismadb";

export default async function getReservations(params) {
  try {
    const { typeId, userId, authorId, reservationId, includeTypes } = await params;

    const query = {};

    if (typeId) {
      query.typeId = typeId;
    }

    if (userId) {
      query.userId = userId;
    }

    if (authorId) {
      query.type = {
        listing: {
          userId: authorId,
        },
      };
    }

    if (reservationId) {
      query.id = reservationId;
    }

    let reservations;

    if (includeTypes) {
      reservations = await prisma.reservation.findMany({
        include: {
          type: true,
          user: true,
        },
        where: query,
        orderBy: {
          createdAt: "desc",
        },
      });

      const listingIds = [...new Set(reservations.map(res => res.type.listingId))];

      const listings = await prisma.listing.findMany({
        where: {
          id: {
            in: listingIds,
          },
        },
        include: {
          user: true,
          types: true,
        },
      });
      
      const listingMap = new Map();

      listings.forEach(listing => {
        listingMap.set(listing.id, listing);
      });

      const enrichedReservations = reservations.map(reservation => ({
        ...reservation,
        type: {
          ...reservation.type,
          listing: listingMap.get(reservation.type.listingId),
        },
      }));

      reservations = enrichedReservations;
    }
    else {
      reservations = await prisma.reservation.findMany({
        include: {
          type: {
            include: {
              listing: true
            },
          },
          user: true,
        },
        where: query,
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    const safeReservations = reservations.map((reservation) => ({
      ...reservation,
      createdAt: reservation.createdAt.toISOString(),
      startDate: reservation.startDate.toISOString(),
      endDate: reservation.endDate.toISOString(),
      listingId: reservation.type.listingId,
      type: {
        ...reservation.type,
      },
    }));

    return safeReservations;
  } catch (error) {
    throw new Error(error);
  }
}
