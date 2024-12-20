import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

const useUploadImageModal = create((set) => ({
  isOpen: false,
  imageSrc: null,
  onOpen: (imageSrc = null) => set({ isOpen: true, imageSrc }),
  onClose: () => set({ isOpen: false }),
  uploadUserImage: async (data) => {
    try {
      await axios.put("/api/user/image", data);
      set({ isOpen: false });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  },
}));

export default useUploadImageModal;
