import { create } from "zustand";

const useAdvancedFiltersModal = create((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useAdvancedFiltersModal;