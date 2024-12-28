import { create } from "zustand";

const useChangePasswordModal = create((set) => ({
  isOpen: false,
  translation: {},
  onOpen: (translation) => set({ isOpen: true, translation }),
  onClose: () => set({ isOpen: false }),
}));

export default useChangePasswordModal;
