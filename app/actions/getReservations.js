import { prisma } from "@/app/libs/prismadb";

export default async function getReservations(params) {
  try {
    const { listingId, userId, authorId } = await params;

    const query = {};

    if (listingId) {
      query.listingId = listingId;
    }

    if (userId) {
      query.userId = userId;
    }

    if (authorId) {
      query.listing = { userId: authorId };
    }

    const reservations = await prisma.reservation.findMany({
      include: {
        listing: true,
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
      listing: {
        ...reservation.listing,
        createdAt: reservation?.listing?.createdAt.toISOString(),
      },
    }));

    return safeReservations;
  } catch (error) {
    throw new Error(error);
  }
}
