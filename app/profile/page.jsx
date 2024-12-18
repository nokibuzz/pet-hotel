export const dynamic = "force-dynamic";

import getCurrentUser from "../actions/getCurrentUser";
import getPets from "../actions/getPets";
import getReservations from "../actions/getReservations";
import ClientOnly from "../components/ClientOnly";
import EmptyState from "../components/EmptyState";
import ProfileClient from "./ProfileClient";

const ProfilePage = async () => {
  const currentUser = await getCurrentUser();
  const profileParams = { userId: currentUser.id };
  const reservations = await getReservations(profileParams);
  const pets = await getPets(profileParams);

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState title="Unauthorized" subtitle="Login to proceed!" />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ProfileClient
        currentUser={currentUser}
        reservations={reservations}
        pets={pets}
      />
    </ClientOnly>
  );
};

export default ProfilePage;
