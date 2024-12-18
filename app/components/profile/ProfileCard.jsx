"use client";

import { useState } from "react";
import Image from "next/image";
import Heading from "../Heading";
import Button from "../Button";
import useChangePasswordModal from "@/app/hooks/useChangePasswordModal";
import ImageUpload from "../inputs/ImageUpload";

const ProfileCard = ({ currentUser }) => {
  const changePasswordModal = useChangePasswordModal();

  const [isHovering, setIsHovering] = useState(false);
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(
    currentUser?.image ?? "/images/placeholder.png"
  );

  const handleImageClick = () => {
    setImageModalOpen(true);
  };

  const handleModalClose = () => {
    setImageModalOpen(false);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6 md:mb-0 md:w-1/2 md:mr-4 flex flex-col justify-between hover:bg-gray-50">
      <Heading title="User Profile" />
      <div className="flex items-center space-x-4 mb-6">
        <div
          className="relative w-24 h-24"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div
            className="relative w-full h-full cursor-pointer"
            onClick={handleImageClick}
          >
            <Image
              width={1000}
              height={1000}
              src={uploadedImage}
              alt="User Avatar"
              className="w-24 h-24 rounded-full object-cover cursor-pointer"
            />
            {/* Overlay text visible only on hover */}
            {isHovering && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                <span className="text-white text-sm font-semibold">
                  Update avatar
                </span>
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="text-lg font-semibold text-gray-600">
            {currentUser?.name ?? ""}
          </div>
          <div className="text-gray-400">{currentUser?.email ?? ""}</div>
        </div>
      </div>
      <div>
        <div className="text-lg font-semibold mb-2 text-gray-600">Address</div>
        <div className="text-gray-600">TODO: add to user db table</div>
      </div>
      <div className="mt-2 flex justify-end">
        <Button
          label="Change password"
          small
          outline
          onClick={changePasswordModal.onOpen}
        />
      </div>

      {/* Image Upload Modal / Temp Solution */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">
                Change Profile Image
              </h2>
              <button
                onClick={handleModalClose}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            {/* Image Upload Component */}
            <div className="flex flex-col gap-4">
              <ImageUpload
                value={uploadedImage}
                onChange={(value) => setUploadedImage(value)}
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
