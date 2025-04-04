import { create } from "zustand";

const useReservationInfoModal = create((set) => ({
  isOpen: false,
  reservation: null,
  step: 0,
  setStep: (step) => set(() => ({ step })),
  onNextStep: (step) => set({ step }),
  onOpen: (reservation = null, step = 0) =>
    set(() => ({
      isOpen: true,
      reservation: { ...(reservation || {}), step },
      step,
    })),
  onClose: () => set({ isOpen: false, reservation: null, step: 0 }),
}));

export default useReservationInfoModal;
