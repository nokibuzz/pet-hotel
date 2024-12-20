"use client";

import { useState } from "react";
import Modal from "./Modal";
import Heading from "../Heading";
import toast from "react-hot-toast";
import useUploadImageModal from "@/app/hooks/useUploadImageModal";
import SingleImageUpload from "../inputs/SingleImageUpload";
import { useRouter } from "next/navigation";

const UploadImageModal = () => {
  const router = useRouter();
  const uploadImageModal = useUploadImageModal();

  const [imageSrc, setImageSrc] = useState(null);

  const uploadImage = async () => {
    if (!imageSrc) {
      toast.error("No image to upload!");
      return;
    }

    try {
      // Convert Blob URL to File
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const file = new File([blob], "image.jpg", { type: blob.type });

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "oqa81fsw");

      const uploadResponse = await fetch(
        "https://api.cloudinary.com/v1_1/dyjrsi5h4/image/upload",
        { method: "POST", body: formData }
      );

      if (!uploadResponse.ok) {
        throw new Error("Image upload failed");
      }

      const data = await uploadResponse.json();
      toast.success("All images uploaded successfully!");

      return data.secure_url;
    } catch (error) {
      console.error(error);
      toast.error("Error uploading images!");
    }
  };

  const onSubmit = async () => {
    if (!imageSrc) {
      return;
    }

    try {
      const imageSrcToUpload = await uploadImage();
      const data = { imageSrc: imageSrcToUpload };
      uploadImageModal.uploadUserImage(data).then(() => {
        router.refresh();
        toast.success("Successfully updated!");
      });
    } catch (error) {
      console.error("Woof, woof, image not uploaded!", error);
    }
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Upload image" center />
      <SingleImageUpload
        value={imageSrc}
        onChange={(value) => setImageSrc(value)}
      />
    </div>
  );

  return (
    <Modal
      disabled={imageSrc === null}
      canCloseDisabled
      isOpen={uploadImageModal.isOpen}
      title="Change image"
      actionLabel="Upload"
      onClose={uploadImageModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
    />
  );
};

export default UploadImageModal;
