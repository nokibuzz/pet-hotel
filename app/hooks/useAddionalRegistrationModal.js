import { create } from "zustand";

const useAddionalRegistrationModal = create((set) => ({
  isOpen: true,
  translation: {},
  onOpen: (translation) => set({ isOpen: true, translation }),
  onClose: () => set({ isOpen: false }),
}));

export default useAddionalRegistrationModal;
