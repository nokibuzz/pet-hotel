export const dynamic = "force-dynamic";

import getCurrentUser from "../actions/getCurrentUser";
import getPets from "../actions/getPets";
import ClientOnly from "../components/ClientOnly";
import EmptyState from "../components/EmptyState";
import PetsClient from "./PetsClient";

const ProfilePage = async () => {
  const currentUser = await getCurrentUser();
  const pets = await getPets();

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState title="Unauthorized" subtitle="Login to proceed!" />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <PetsClient pets={pets} />
    </ClientOnly>
  );
};

export default ProfilePage;
