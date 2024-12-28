import { create } from "zustand";

const useRegisterModal = create((set) => ({
  isOpen: false,
  translation: {},
  onOpen: (translation) => set({ isOpen: true, translation }),
  onClose: () => set({ isOpen: false }),
}));

export default useRegisterModal;
