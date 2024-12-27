export const dynamic = "force-dynamic";

import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";

import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";
import ReservationsClient from "./ReservationsClient";
import { getTranslations } from "../utils/getTranslations";

const ListReservationsPage = async () => {
  const currentUser = await getCurrentUser();

  const translation = await getTranslations(
    currentUser?.locale,
    "reservations"
  );

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

  let reservations = [];

  if (currentUser.hotelOwner) {
    reservations = await getReservations({
      authorId: currentUser.id,
    });
  } else {
    reservations = await getReservations({
      userId: currentUser.id,
    });
  }

  if (reservations.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title={translation.EmptyState.reservationTitle}
          subtitle={translation.EmptyState.listingSubtitle}
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ReservationsClient
        reservations={reservations}
        currentUser={currentUser}
        translation={translation}
      />
    </ClientOnly>
  );
};

export default ListReservationsPage;
