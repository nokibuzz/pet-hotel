import { prisma } from "@/app/libs/prismadb";

export default async function getListingById(params) {
  try {
    const { listingId } = await params;

    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
      },
      include: {
        user: true,
        types: true,
      },
    });

    if (!listing) {
      return null;
    }

    const location = await prisma.$queryRaw`
      SELECT 
      public.ST_X(location::public.geometry) as lng,
      public.ST_Y(location::public.geometry) as lat
      FROM "Listing"
      WHERE id = ${listingId}
    `;

    listing.location = location.length > 0 ? [location[0].lng, location[0].lat] : null; 

    return {
      ...listing,
      createdAt: listing.createdAt.toISOString(),
      user: {
        ...listing.user,
        id: listing?.user?.id || "",
        createdAt: listing?.user?.createdAt.toISOString() || null,
        updatedAt: listing?.user?.updatedAt.toISOString(),
        emailVerified: listing?.user?.emailVerified?.toISOString() || null,
      },
    };
  } catch (error) {
    throw new Error(error);
  }
}
