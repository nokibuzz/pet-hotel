import { create } from "zustand";

const useLoginModal = create((set) => ({
  isOpen: false,
  translation: {},
  onOpen: (translation) => set({ isOpen: true, translation }),
  onClose: () => set({ isOpen: false }),
}));

export default useLoginModal;
