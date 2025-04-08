import { create } from "zustand";

const usePetViewModal = create((set) => ({
  isOpen: false,
  pet: {},
  onOpen: (pet) => set({ isOpen: true, pet }),
  onClose: () => set({ isOpen: false, pet: {} }),
}));

export default usePetViewModal;
