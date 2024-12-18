"use client";

import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "../Avatar";
import { useCallback, useState } from "react";
import MenuItem from "./MenuItem";

import { signOut } from "next-auth/react";

import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import useRentModal from "@/app/hooks/useRentModal";
import { useRouter } from "next/navigation";

const UserMenu = ({ currentUser }) => {
  const router = useRouter();
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const rentModal = useRentModal();
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const closeMenu = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 500);
  };

  return (
    <div className="relative">
      <div className="flex flex-row items-center">
        <div
          onClick={toggleOpen}
          className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center justify-between gap-3 rounded-full cursor-pointer hover:shadow-md transition"
        >
          <AiOutlineMenu />
          {currentUser?.name}
          <div className="hidden md:block">
            <Avatar src={currentUser?.image} />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute rounded-xl shadow-md w-[35vw] bg-white overflow-hidden right-0 top-12 text-sm">
          <div className="flex flex-col cursor-pointer ">
            {currentUser ? (
              <>
                <MenuItem
                  onClick={() => {
                    router.push("/profile");
                    closeMenu();
                  }}
                  label="Profile"
                />
                {currentUser?.hotelOwner === false && (
                  <MenuItem
                    onClick={() => {
                      router.push("/reservations");
                      closeMenu();
                    }}
                    label="My reservations"
                  />
                )}
                {currentUser?.hotelOwner && (
                  <MenuItem
                    onClick={() => {
                      router.push("/reservations");
                      closeMenu();
                    }}
                    label="Booked Reservations (my place)"
                  />
                )}
                {currentUser?.hotelOwner === false && (
                  <MenuItem
                    onClick={() => {
                      router.push("/pets");
                      closeMenu();
                    }}
                    label="My pets"
                  />
                )}
                {currentUser?.hotelOwner && (
                  <MenuItem
                    onClick={() => {
                      router.push("/properties");
                      closeMenu();
                    }}
                    label="My properties"
                  />
                )}
                {currentUser?.hotelOwner && (
                  <MenuItem
                    onClick={() => {
                      rentModal.onOpen();
                      closeMenu();
                    }}
                    label="Add property"
                  />
                )}
                <MenuItem
                  onClick={() => {
                    signOut();
                    closeMenu();
                  }}
                  label="Logout"
                />
              </>
            ) : (
              <>
                <MenuItem
                  onClick={() => {
                    loginModal.onOpen();
                    closeMenu();
                  }}
                  label="Login"
                />
                <MenuItem
                  onClick={() => {
                    registerModal.onOpen();
                    closeMenu();
                  }}
                  label="Sign Up"
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
