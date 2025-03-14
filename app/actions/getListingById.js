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
