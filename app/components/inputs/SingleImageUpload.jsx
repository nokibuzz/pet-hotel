"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { TbPhotoPlus } from "react-icons/tb";
import { AiOutlineClose } from "react-icons/ai";
import toast from "react-hot-toast";

const SingleImageUpload = ({ onChange, value = null }) => {
  const [uploadedImage, setUploadedImage] = useState(value);

  useEffect(() => {
    setUploadedImage(value);
  }, [value]);

  // Handle file selection and local preview
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      toast.error("Only JPEG and PNG files are allowed!");
      return;
    }

    const preview = URL.createObjectURL(file);
    setUploadedImage(preview);
    onChange(preview);
  };

  // Remove the uploaded image
  const handleRemoveImage = () => {
    setUploadedImage(null);
    onChange(null);
  };

  return (
    <div className="space-y-4">
      {/* Show Upload Space if No Image */}
      {!uploadedImage && (
        <label className="relative cursor-pointer hover:opacity-70 transition border-dashed border-2 p-20 border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600">
          <TbPhotoPlus size={30} />
          <div className="font-semibold text-lg">Click to add an image</div>
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </label>
      )}

      {/* Show Uploaded Image */}
      {uploadedImage && (
        <div className="relative justify-self-center w-60 h-60">
          <Image
            src={uploadedImage}
            alt="Uploaded image"
            width={1000}
            height={1000}
            className="w-full h-full rounded-md object-cover"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:scale-110 transition z-10"
          >
            <AiOutlineClose size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default SingleImageUpload;
