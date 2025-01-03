export const dynamic = "force-dynamic";

import getCurrentUser from "./actions/getCurrentUser";
import getListings from "./actions/getListings";
import AdSense from "./components/AdSense";
import ClientOnly from "./components/ClientOnly";
import Container from "./components/Container";
import EmptyState from "./components/EmptyState";
import ListingCard from "./components/listings/ListingCard";
import { getTranslations } from "./utils/getTranslations";

const adSlots = [
  // 6533344719
];

const Home = async ({ searchParams }) => {
  const listings = await getListings(searchParams);
  const currentUser = await getCurrentUser();

  const getRandomIndices = (arrayLength, adCount) => {
    const indices = new Set();
    let index = 0;
    while (indices.size < adCount) {
      const randomIndex = Math.floor(Math.random() * arrayLength);
      indices.add({ slot: adSlots[index++], position: randomIndex });
    }
    return Array.from(indices);
  };

  const adIndices = getRandomIndices(
    listings.length + adSlots.length,
    adSlots.length
  );

  const translation = await getTranslations(currentUser?.locale, "listings");

  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title={translation.EmptyState.title}
          subtitle={translation.EmptyState.subtitle}
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
          {listings.map((listing, index) => {
            const ad = adIndices.find((item) => item.position === index);
            if (ad) {
              return (
                <div key={`ad-${ad.position}`}>
                  <AdSense client="ca-pub-7467390618217637" slot={ad.slot} />
                </div>
              );
            }
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
