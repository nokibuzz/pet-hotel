"use client";

import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "../Avatar";
import { useCallback, useState, useEffect } from "react";
import MenuItem from "./MenuItem";
import { signOut } from "next-auth/react";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import useRentModal from "@/app/hooks/useRentModal";
import { useRouter } from "next/navigation";
import LanguageSelector from "./LanguageSelector";
import axios from "axios";

const UserMenu = ({ currentUser, translation }) => {
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

  const handleLanguageChange = (locale) => {
    const id = currentUser?.id;
    if (currentUser?.locale !== locale) {
      axios.put(`/api/user/${id}/${locale}`).then(() => {
        closeMenu();
        router.refresh();
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-menu-container")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative z-50">
      <div className="flex flex-row items-center">
        <div
          onClick={toggleOpen}
          className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center justify-between gap-3 rounded-full cursor-pointer hover:shadow-md transition"
        >
          <AiOutlineMenu />
          <div
            className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
            title={currentUser?.name}
          >
            {currentUser?.name}
          </div>
          <div className="hidden md:block">
            <Avatar src={currentUser?.image} />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute rounded-xl shadow-md w-[35vw] bg-white overflow-hidden right-0 top-12 text-sm user-menu-container">
          {currentUser && (
            <LanguageSelector
              value={currentUser.locale}
              onChange={handleLanguageChange}
            />
          )}
          <div className="flex flex-col cursor-pointer ">
            {currentUser ? (
              <>
                <MenuItem
                  onClick={() => {
                    router.push("/profile");
                    closeMenu();
                  }}
                  label={translation.UserMenu.profile || "Profile"}
                />
                {currentUser?.hotelOwner === false && (
                  <MenuItem
                    onClick={() => {
                      router.push("/reservations");
                      closeMenu();
                    }}
                    label={
                      translation.UserMenu.reservationsUser || "My reservations"
                    }
                  />
                )}
                {currentUser?.hotelOwner && (
                  <MenuItem
                    onClick={() => {
                      router.push("/reservations");
                      closeMenu();
                    }}
                    label={
                      translation.UserMenu.reservationsOwner ||
                      "Booked Reservations (my place)"
                    }
                  />
                )}
                {currentUser?.hotelOwner === false && (
                  <MenuItem
                    onClick={() => {
                      router.push("/pets");
                      closeMenu();
                    }}
                    label={translation.UserMenu.myPets || "My pets"}
                  />
                )}
                {currentUser?.hotelOwner && (
                  <MenuItem
                    onClick={() => {
                      router.push("/properties");
                      closeMenu();
                    }}
                    label={translation.UserMenu.myProperties || "My properties"}
                  />
                )}
                {currentUser?.hotelOwner && (
                  <MenuItem
                    onClick={() => {
                      rentModal.onOpen();
                      closeMenu();
                    }}
                    label={translation.UserMenu.addProperty || "Add property"}
                  />
                )}
                <MenuItem
                  onClick={() => {
                    signOut();
                    closeMenu();
                  }}
                  label={translation.UserMenu.logout || "Logout"}
                />
              </>
            ) : (
              <>
                <MenuItem
                  onClick={() => {
                    loginModal.onOpen(translation);
                    closeMenu();
                  }}
                  label={translation.UserMenu.login || "Login"}
                />
                <MenuItem
                  onClick={() => {
                    registerModal.onOpen(translation);
                    closeMenu();
                  }}
                  label={translation.UserMenu.signUp || "Sign Up"}
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
