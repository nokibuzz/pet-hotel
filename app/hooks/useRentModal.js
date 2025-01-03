import { create } from "zustand";

const useRentModal = create((set) => ({
  isOpen: false,
  listing: null,
  isEdit: false,
  translation: {},
  onOpen: (translation, listing = null, isEdit = false) =>
    set({ isOpen: true, isEdit, listing, translation }),
  onClose: () => set({ isOpen: false, isEdit: false, listing: null }),
}));

export default useRentModal;
