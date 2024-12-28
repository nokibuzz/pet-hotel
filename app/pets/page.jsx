export const dynamic = "force-dynamic";

import getCurrentUser from "../actions/getCurrentUser";
import getPets from "../actions/getPets";
import ClientOnly from "../components/ClientOnly";
import EmptyState from "../components/EmptyState";
import PetsClient from "./PetsClient";
import { getTranslations } from "@/app/utils/getTranslations";

const ProfilePage = async () => {
  const currentUser = await getCurrentUser();
  const pets = await getPets({ userId: currentUser?.id });

  const translation = await getTranslations(currentUser?.locale, "pets");

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

  return (
    <ClientOnly>
      <PetsClient pets={pets} translation={translation} />
    </ClientOnly>
  );
};

export default ProfilePage;
