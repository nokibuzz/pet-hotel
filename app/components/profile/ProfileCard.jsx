"use client";

import Image from "next/image";
import Heading from "../Heading";
import Button from "../Button";
import useChangePasswordModal from "@/app/hooks/useChangePasswordModal";
import useUploadImageModal from "@/app/hooks/useUploadImageModal";
import { useState } from "react";

const ProfileCard = ({ currentUser, translation }) => {
  const [isHovering, setIsHovering] = useState(false);

  const changePasswordModal = useChangePasswordModal();
  const uploadImageModal = useUploadImageModal();

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6 md:mb-0 md:w-1/2 md:mr-4 flex flex-col justify-between hover:bg-gray-50">
      <Heading title={translation.ProfileCard.title || "User Profile"} />
      <div className="flex items-center space-x-4 mb-6">
        <div
          className="relative w-24 h-24"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div
            className="relative w-full h-full cursor-pointer"
            onClick={() => uploadImageModal.onOpen(currentUser?.image)}
          >
            <Image
              width={1000}
              height={1000}
              src={currentUser?.image ?? "/images/placeholder.png"}
              alt="User Avatar"
              className="w-24 h-24 rounded-full object-cover cursor-pointer"
            />
            {/* Overlay text visible only on hover */}
            {isHovering && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                <span className="text-white text-sm font-semibold">
                  {translation.ProfileCard.updateAvatar || "Update avatar"}
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
        <div className="text-lg font-semibold mb-2 text-gray-600">
          {translation.ProfileCard.address || "Address"}
        </div>
        <div className="text-gray-600">TODO: add to user db table</div>
      </div>
      <div className="mt-2 flex justify-end">
        <Button
          label={translation.ChangePasswordModal?.onOpen || "Change password"}
          small
          outline
          onClick={() =>
            changePasswordModal.onOpen(translation.ChangePasswordModal)
          }
        />
      </div>
    </div>
  );
};

export default ProfileCard;
