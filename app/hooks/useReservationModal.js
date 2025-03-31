import { create } from "zustand";

const useReservationModal = create((set) => ({
  isOpen: false,
  listing: null,
  pets: [],
  translation: {},
  onOpen: (listing = null, pets) => set({ isOpen: true, listing, pets }),
  onClose: () => set({ isOpen: false, listing: null, pets: [] }),
}));

export default useReservationModal;
