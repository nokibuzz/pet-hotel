export const dynamic = "force-dynamic";

import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById";
import getReservations from "@/app/actions/getReservations";
import ListingClient from "@/app/listing/[listingId]/ListingClient";
import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";
import getReviews from "@/app/actions/getReviews";
import { getTranslations } from "@/app/utils/getTranslations";

const ListingPage = async ({ params }) => {
  const listing = await getListingById(params);
  const reservations = await getReservations(params);
  const currentUser = await getCurrentUser();
  const awaitedParams = await params;
  const { reviews, totalReviews } = await getReviews({
    ...awaitedParams,
    userId: currentUser?.id,
  });

  const translation = await getTranslations(currentUser?.locale, "listing");

  if (!listing) {
    return (
      <ClientOnly>
        <EmptyState
          title={translation.EmptyState.listingTitle}
          subtitle={translation.EmptyState.listingSubtitle}
        />
      </ClientOnly>
    );
  }

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState
          title={translation.EmptyState.title}
          subtitle={translation.EmptyState.subtitle}
        />
        ;
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
        translation={translation}
      />
    </ClientOnly>
  );
};

export default ListingPage;
