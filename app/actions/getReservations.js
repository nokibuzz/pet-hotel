import { prisma } from "@/app/libs/prismadb";

export default async function getReservations(params) {
  try {
    const { typeId, userId, authorId, reservationId } = await params;

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

    const reservations = await prisma.reservation.findMany({
      include: {
        type: {
          include: {
            listing: true, // Fetch the listing associated with the type,
            // TODO: finetune, to return only needed values
          },
        },
        user: true,
      },
      where: query,
      orderBy: {
        createdAt: "desc",
      },
    });

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
