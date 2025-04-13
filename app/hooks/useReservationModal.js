import { create } from "zustand";

const useReservationModal = create((set) => ({
  isOpen: false,
  listing: null,
  pets: [],
  usedForBlocking: false,
  onOpen: (listing = null, pets, usedForBlocking = false) => set({ isOpen: true, listing, pets, usedForBlocking }),
  onClose: () => set({ isOpen: false, listing: null, pets: [], usedForBlocking: false }),
}));

export default useReservationModal;
