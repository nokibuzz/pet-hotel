export const dynamic = "force-dynamic";

import getCurrentUser from "./actions/getCurrentUser";
import getListings from "./actions/getListings";
import ClientOnly from "./components/ClientOnly";
import Container from "./components/Container";
import EmptyState from "./components/EmptyState";
import ListingCard from "./components/listings/ListingCard";
import { getTranslations } from "./utils/getTranslations";

const Home = async ({ searchParams }) => {
  const listings = await getListings(searchParams);
  const currentUser = await getCurrentUser();

  const translation = await getTranslations(currentUser?.locale, "listings");

  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title={translation.EmptyState.reservationTitle}
          subtitle={translation.EmptyState.listingSubtitle}
          resetButtonLabel={translation.EmptyState.resetFilters}
          showReset
        />
      </ClientOnly>
    );
  }
  return (
    <ClientOnly>
      <Container>
        <div className="pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          {listings.map((listing) => {
            return (
              <ListingCard
                key={listing.id}
                actionId={listing.id}
                data={listing}
                currentUser={currentUser}
                currentSearchParams={searchParams}
                translation={translation.ListingCard}
              />
            );
          })}
        </div>
      </Container>
    </ClientOnly>
  );
};

export default Home;
