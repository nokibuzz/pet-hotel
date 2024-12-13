import { create } from "zustand";

const useRentModal = create((set) => ({
  isOpen: false,
  listing: null,
  isEdit: false,
  onOpen: (listing = null, isEdit = false) =>
    set({ isOpen: true, isEdit, listing }),
  onClose: () => set({ isOpen: false, isEdit: false, listing: null }),
}));

export default useRentModal;
