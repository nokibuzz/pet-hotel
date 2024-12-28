export const dynamic = "force-dynamic";

import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";

import getCurrentUser from "../actions/getCurrentUser";
import PropertiesClient from "./PropertiesClient";
import getProperties from "../actions/getProperties";
import { getTranslations } from "../utils/getTranslations";

const PropertiesPage = async () => {
  const currentUser = await getCurrentUser();

  const translation = await getTranslations(currentUser?.locale, "properties");

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState
          title={translation.EmptyState.title}
          subtitle={translation.EmptyState.subtitle}
        />
      </ClientOnly>
    );
  }

  const listings = await getProperties({
    userId: currentUser.id,
  });

  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title={translation.EmptyState.propertiesTitle}
          subtitle={translation.EmptyState.propertiesSubtitle}
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <PropertiesClient
        listings={listings}
        currentUser={currentUser}
        translation={translation}
      />
    </ClientOnly>
  );
};

export default PropertiesPage;
