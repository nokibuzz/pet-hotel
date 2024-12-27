"use client";

import Image from "next/image";
import { useState } from "react";
import { TbPhotoPlus } from "react-icons/tb";
import { AiOutlineClose } from "react-icons/ai";
import toast from "react-hot-toast";

const ImageUpload = ({ onChange, value = [], maxImages, translation }) => {
  const [localImages, setLocalImages] = useState(value);

  // Handle file selection and local preview
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter((file) =>
      ["image/jpeg", "image/png", "image/jpg"].includes(file.type)
    );

    if (validFiles.length !== files.length) {
      toast.error(
        translation.wrongFormat || "Only JPEG and PNG files are allowed!"
      );
    }

    const totalImages = localImages.length + validFiles.length;

    if (totalImages > maxImages) {
      const allowedFiles = validFiles.slice(0, maxImages - localImages.length);
      const previews = allowedFiles.map((file) => URL.createObjectURL(file));
      setLocalImages((prev) => [...prev, ...previews]);
      onChange([...localImages, ...previews]);
      toast.error(
        translation.limitImagesExceeded + maxImages ||
          `You can only upload up to ${maxImages} images.`
      );
    } else {
      const previews = validFiles.map((file) => {
        return URL.createObjectURL(file);
      });
      setLocalImages((prev) => [...prev, ...previews]);
      onChange([...localImages, ...previews]);
    }
  };

  // Remove an image locally
  const handleRemoveImage = (index) => {
    const updatedImages = localImages.filter((_, i) => i !== index);
    setLocalImages(updatedImages);
    onChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      {/* Add Image Input */}
      <div
        className={`relative cursor-pointer hover:opacity-70 transition border-dashed border-2 p-10 border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600 ${
          localImages.length >= maxImages
            ? "opacity-50 pointer-events-none"
            : ""
        }`}
      >
        <TbPhotoPlus size={30} />
        <div className="font-semibold text-lg">
          {translation.addImages || "Click to add images"}
        </div>
        <input
          type="file"
          accept="image/jpeg,image/png"
          multiple
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
          disabled={localImages.length >= maxImages}
        />
      </div>

      {/* Display locally added images */}
      <div className="flex gap-4 justify-center overflow-x-auto hide-scrollbar max-h-40 pr-4">
        {localImages.map((image, index) => (
          <div key={index} className="relative flex-shrink-0 w-42 h-42">
            <Image
              src={image}
              alt={`Selected image ${index + 1}`}
              width={1000}
              height={1000}
              className="w-40 h-40 rounded-md object-cover"
            />
            <button
              onClick={() => handleRemoveImage(index)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-sm hover:scale-110 transition"
            >
              <AiOutlineClose />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
