import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";

import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";
import StaysClient from "./StaysClient";

const StaysPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState title="Unauthorized" subtitle="Login to proceed!" />
      </ClientOnly>
    );
  }

  const reservations = await getReservations({
    userId: currentUser.id,
  });

  if (reservations.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No reservations found"
          subtitle="Looks like you didn't reserve any pet care!"
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <StaysClient reservations={reservations} currentUser={currentUser} />
    </ClientOnly>
  );
};

export default StaysPage;
