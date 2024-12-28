"use client";

import { useRouter } from "next/navigation";
import Container from "../components/Container";
import Heading from "../components/Heading";
import { useCallback, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ListingCard from "../components/listings/ListingCard";

const PropertiesClient = ({ listings, currentUser, translation }) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState("");

  const onCancel = useCallback(
    (listingId) => {
      setDeletingId(listingId);

      axios
        .delete(`/api/listing?listingId=${listingId}`)
        .then(() => {
          toast.success(
            translation.PropertiesClient.deletedSuccessfully ||
              "Successfully deleted property!"
          );
          router.refresh();
        })
        .catch((error) => toast.error(error?.response?.data?.error))
        .finally(() => setDeletingId(""));
    },
    [router]
  );

  return (
    <Container>
      <Heading
        title={translation.PropertiesClient.title || "Properties"}
        subtitle={
          translation.PropertiesClient.subtitle ||
          "The properties you owe and offer reservations"
        }
      />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            data={listing}
            actionId={listing.id}
            // onAction={onCancel}
            disabled={deletingId === listing.id}
            // actionLabel={translation.ListingCard.deleteProperty || "Delete property"}
            currentUser={currentUser}
            translation={translation.ListingCard}
          />
        ))}
      </div>
    </Container>
  );
};

export default PropertiesClient;
