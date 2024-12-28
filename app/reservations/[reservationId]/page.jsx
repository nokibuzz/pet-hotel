export const dynamic = "force-dynamic";

import getCurrentUser from "@/app/actions/getCurrentUser";
import getReservations from "@/app/actions/getReservations";
import ReservationClient from "@/app/reservations/[reservationId]/ReservationClient";
import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";
import { getTranslations } from "@/app/utils/getTranslations";

const ReservationPage = async ({ params }) => {
  const reservations = await getReservations(params);
  const currentUser = await getCurrentUser();

  const translation = await getTranslations(currentUser?.locale, "reservation");

  if (!reservations.values().next().value) {
    return (
      <ClientOnly>
        <EmptyState
          title={translation.EmptyState.reservationTitle}
          subtitle={translation.EmptyState.listingSubtitle}
        />
      </ClientOnly>
    );
  }

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState
          title={translation.EmptyState.title}
          subtitle={translation.EmptyState.subtitle}
        />
        ;
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ReservationClient
        currentUser={currentUser}
        reservation={reservations.values().next().value}
        translation={translation}
      />
    </ClientOnly>
  );
};

export default ReservationPage;
