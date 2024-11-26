"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useCallback, useState } from "react";
import { TbPhotoPlus } from "react-icons/tb";
import toast from "react-hot-toast";

const ImageUpload = ({ onChange, value }) => {
  const [isValid, setIsValid] = useState(true);

  const handleUpload = useCallback(
    (result) => {
      if (isValid) {
        onChange(result.info.secure_url);
      }
    },
    [onChange]
  );

  const handleValidation = (event) => {
    if (!event || !event.info || !event.info.file) {
      setIsValid(false);
      toast.error("Image is not present!");
    }

    if (
      !event.info.file.type ||
      (!event.info.file.type.match("image/jpeg") &&
        !event.info.file.type.match("image/png"))
    ) {
      setIsValid(false);
      toast.error("Image is not in a right format!");
    }

    setIsValid(true);
  };

  return (
    <CldUploadWidget
      onSuccess={handleUpload}
      uploadPreset="oqa81fsw"
      options={{ maxFiles: 1 }}
      onUploadAddedAction={(file) => handleValidation(file)}
    >
      {({ open }) => {
        return (
          <div
            onClick={() => open?.()}
            className="relative cursor-pointer hover:opacity-70 transition border-dashed border-2 p-20 border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600"
          >
            <TbPhotoPlus size={30} />
            <div className="font-semibold text-lg">Click to upload</div>
            {value && (
              <div className="absolute inset-0 w-full h-full">
                <Image
                  alt="Upload"
                  fill
                  style={{ objectFit: "cover" }}
                  src={value}
                />
              </div>
            )}
          </div>
        );
      }}
    </CldUploadWidget>
  );
};

export default ImageUpload;
