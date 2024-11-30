import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import useLoginModal from "./useLoginModal";
import { useCallback, useMemo } from "react";

const useFavorite = ({ listingId, currentUser }) => {
  const router = useRouter();
  const loginModal = useLoginModal();

  const hasFavorited = useMemo(() => {
    const list = currentUser?.favouriteIds || [];

    return list.includes(listingId);
  }, [currentUser, listingId]);

  const toggleFavorite = useCallback(
    async (e) => {
      e.stopPropagation();

      if (!currentUser) {
        return loginModal.onOpen();
      }

      try {
        let request;
        let toastMessage = "";

        if (hasFavorited) {
          request = () => axios.delete("/api/favorites", { data: { listingId } });
          toastMessage = "Removed from favorites!";
        } else {
          request = () => axios.post("/api/favorites", { listingId: `${listingId}` });
          toastMessage = "Added to favorites!";
        }
        await request();        
        router.refresh();
        toast.success(toastMessage);
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong on favoriting!");
      }
    },
    [currentUser, hasFavorited, listingId, loginModal, router]
  );

  return {
    hasFavorited,
    toggleFavorite,
  };
};

export default useFavorite;
