export const dynamic = "force-dynamic";

import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById";
import getReservations from "@/app/actions/getReservations";
import ListingClient from "@/app/listing/[listingId]/ListingClient";
import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";
import getReviews from "@/app/actions/getReviews";

const ListingPage = async ({ params }) => {
  const listing = await getListingById(params);
  const reservations = await getReservations(params);
  const currentUser = await getCurrentUser();
  const awaitedParams = await params;
  const { reviews, totalReviews } = await getReviews({
    ...awaitedParams,
    userId: currentUser?.id,
  });

  if (!listing) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState title="Unauthorized" subtitle="Login to proceed!" />;
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ListingClient
        listing={listing}
        currentUser={currentUser}
        reservations={reservations}
        reviews={reviews}
        totalReviews={totalReviews}
      />
    </ClientOnly>
  );
};

export default ListingPage;
