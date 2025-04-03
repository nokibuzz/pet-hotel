"use client";

import { useGlobal } from "@/app/hooks/GlobalContext";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useEffect, useState } from "react";

const Logo = ({ currentUser }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const { selectedPet, setSelectedPet, pets, setPetChanged, fetchPetsForUser } =
    useGlobal();

  useEffect(() => {
    if (currentUser) {
      fetchPetsForUser(currentUser.id);
    }
  }, [currentUser]);

  const handlePetClick = () => {
    if (pets.length > 1) {
      setIsDropdownOpen(!isDropdownOpen);
    } else {
      setIsTooltipOpen(!isTooltipOpen);
      setTimeout(() => setIsTooltipOpen(false), 2000); // Auto-hide after 2s
    }
  };

  const handlePetSelect = (petSelected) => {
    setSelectedPet(petSelected);
    setIsDropdownOpen(false);
    setPetChanged(true);
  };

  const returnToHome = () => {
    const currentQuery = {};
    currentQuery.petType = selectedPet.typeName;

    const url = qs.stringifyUrl(
      {
        url: `/`,
        query: currentQuery,
      },
      { skipNull: true }
    );

    router.push(url);
  };

  return (
    <div className="relative flex items-center w-full justify-between px-4">
      <Image
        onClick={() => returnToHome()}
        alt="Logo"
        className="md:block cursor-pointer flex-shrink-0"
        height="48"
        width="48"
        src="/images/logo.png"
      />

      {selectedPet && currentUser && (
        <div className="flex items-center flex-shrink-0">
          <div className="separator hidden md:block"></div>

          <div
            className="flex items-center ml-2 gap-2 sm:px-2 sm:py-3 md:border md:rounded-full md:shadow-sm bg-white cursor-pointer"
            onClick={handlePetClick}
          >
            <Image
              alt="Pet"
              height="40"
              width="40"
              className="rounded-full object-cover flex-shrink-0"
              src={selectedPet?.imageSrc?.[0]}
            />
            {/* Name is hidden on smaller screens */}
            <span className="hidden md:block text-sm font-medium truncate max-w-[120px]">
              {selectedPet?.name}
            </span>
          </div>

          {/* Tooltip for single pet */}
          {isTooltipOpen && pets.length === 1 && (
            <div className="absolute top-full right-1 transform translate-x-1/2 mt-2 bg-gray-800 text-white text-xs p-2 rounded-md shadow-md">
              {selectedPet?.name}
            </div>
          )}

          {/* Dropdown for multiple pets */}
          {isDropdownOpen && pets.length > 1 && (
            <div className="absolute top-full right-1 transform translate-x-1/2 mt-2 bg-white border rounded-lg shadow-lg w-48 max-h-60 overflow-y-auto z-50">
              {pets.map((p) => (
                <div
                  key={p.id}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                    selectedPet.id === p.id ? "bg-gray-200" : ""
                  }`}
                  onClick={() => handlePetSelect(p)}
                >
                  <div className="flex items-center gap-2">
                    <Image
                      alt={p.name}
                      height="24"
                      width="24"
                      className="rounded-full object-cover"
                      src={p?.imageSrc?.[0]}
                    />
                    <span className="truncate max-w-[100px]">{p.name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
