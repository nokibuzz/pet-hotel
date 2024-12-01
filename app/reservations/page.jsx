export const dynamic = "force-dynamic";

import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";

import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";
import ReservationsClient from "./ReservationsClient";

const ListReservationsPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState title="Unauthorized" subtitle="Login to proceed!" />
      </ClientOnly>
    );
  }

  let reservations = [];

  if (currentUser.hotelOwner){
    reservations = await getReservations({
      authorId: currentUser.id,
    });
  } 
  else {
    reservations = await getReservations({
      userId: currentUser.id,
    });
  }

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
      <ReservationsClient
        reservations={reservations}
        currentUser={currentUser}
      />
    </ClientOnly>
  );
};

export default ListReservationsPage;
