import { create } from "zustand";

const useReservationModal = create((set) => ({
  isOpen: false,
  listing: null,
  translation: {},
  onOpen: (listing = null) => set({ isOpen: true, listing }),
  onClose: () => set({ isOpen: false, listing: null }),
}));

export default useReservationModal;
