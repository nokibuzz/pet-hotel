export const dynamic = "force-dynamic";

import getCurrentUser from "./actions/getCurrentUser";
import getTypes from "./actions/getTypes";
import AdSense from "./components/AdSense";
import ClientOnly from "./components/ClientOnly";
import CustomContainer from "./components/CustomContainer";
import EmptyState from "./components/EmptyState";
import ListingCard from "./components/listings/ListingCard";
import AddionalRegistrationModal from "./components/modals/AddionalRegistrationModal";
import { getTranslations } from "./utils/getTranslations";

const adSlots = [6533344719];

const adClient = "ca-pub-7467390618217637";

const Home = async ({ searchParams }) => {
  const listingTypes = await getTypes(searchParams);
  const currentUser = await getCurrentUser();

  const translation = await getTranslations(currentUser?.locale, "listings");

  let currentSlot = 0;

  if (listingTypes.length === 0) {
    return (
      <ClientOnly>
        {
        currentUser?.isNewUser && 
        (
          <AddionalRegistrationModal translations={translation.AddionalRegistrationModal}/>
        )
      }
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
      {
        currentUser?.isNewUser && 
        (
          <AddionalRegistrationModal translations={translation.AddionalRegistrationModal}/>
        )
      }
      <CustomContainer>
        <div className="pt-20 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
          {listingTypes.flatMap((listingType, index) => {
            const elements = [
              <ListingCard
                key={`listing-${listingType.listing.id}`}
                actionId={listingType.listing.id}
                data={listingType.listing}
                types={listingType.types}
                currentUser={currentUser}
                currentSearchParams={searchParams}
                translation={translation.ListingCard}
              />,
            ];

            if (index != 0 && index % 5 === 0 && currentSlot < adSlots.length) {
              elements.push(
                <AdSense
                  key={`ad-${index}`}
                  client={adClient}
                  slot={adSlots[currentSlot]}
                />
              );
              currentSlot = currentSlot + 1;
            }

            return elements;
          })}
        </div>
      </CustomContainer>
    </ClientOnly>
  );
};

export default Home;
