import { prisma } from "@/app/libs/prismadb";
import { Prisma } from "@prisma/client";

export default async function getReservations(params) {
  try {
    const { typeId, userId, authorId, reservationId, includeTypes } =
      await params;

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

      const listingIds = [
        ...new Set(reservations.map((res) => res.type.listingId)),
      ];

      let enrichedReservations;

      if (listingIds.length > 0) {
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

        const joinedIds = Prisma.join(
          listingIds.map((id) => Prisma.sql`${id}`),
          Prisma.raw(", ")
        );

        const locations = await prisma.$queryRaw`
          SELECT 
          id,
          public.ST_X(location::public.geometry) as lng,
          public.ST_Y(location::public.geometry) as lat
          FROM "Listing"
          WHERE id IN (${joinedIds})
        `;

        const locationMap = new Map(
          locations.map((location) => [
            location.id,
            [location.lng, location.lat],
          ])
        );

        const listingMap = new Map();

        listings.forEach((listing) => {
          listing.location = locationMap.get(listing.id);
          listingMap.set(listing.id, listing);
        });

        enrichedReservations = reservations.map((reservation) => ({
          ...reservation,
          type: {
            ...reservation.type,
            listing: listingMap.get(reservation.type.listingId),
          },
        }));
      } else {
        enrichedReservations = reservations.map((reservation) => ({
          ...reservation,
          type: {
            ...reservation.type,
          },
        }));
      }

      reservations = enrichedReservations;
    } else {
      reservations = await prisma.reservation.findMany({
        include: {
          type: {
            include: {
              listing: true,
            },
          },
          user: true,
        },
        where: query,
        orderBy: {
          createdAt: "desc",
        },
      });

      const listingIds = [
        ...new Set(reservations.map((res) => res.type.listingId)),
      ];

      if (listingIds.length > 0) {
        const joinedIds = Prisma.join(
          listingIds.map((id) => Prisma.sql`${id}`),
          Prisma.raw(", ")
        );
  
        const locations = await prisma.$queryRaw`
          SELECT 
          id,
          public.ST_X(location::public.geometry) as lng,
          public.ST_Y(location::public.geometry) as lat
          FROM "Listing"
          WHERE id IN (${joinedIds})
        `;
  
        const locationMap = new Map(
          locations.map((location) => [location.id, [location.lng, location.lat]])
        );
  
        reservations.forEach((reservation) => {
          reservation.type.listing.location = locationMap.get(
            reservation.type.listingId
          );
        });
      }
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
