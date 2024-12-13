import { create } from "zustand";

const useRentModal = create((set) => ({
  isOpen: false,
  listing: null,
  onOpen: (listing = null) => set({ isOpen: true, listing }),
  onClose: () => set({ isOpen: false, listing: null }),
}));

export default useRentModal;
