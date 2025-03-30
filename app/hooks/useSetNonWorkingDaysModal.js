import { create } from "zustand";

const useSetNonWorkingDaysModal = create((set) => ({
    isOpen: false,
    translation: {},
    properties: [],
    onOpen: (properties, translation) => set({ isOpen: true, properties, translation }),
    onClose: () => set({ isOpen: false }),
  }));

export default useSetNonWorkingDaysModal;
