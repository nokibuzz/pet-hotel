"use client";

import Container from "../Container";
import BasicFilterOption from "../BasicFilterOption";
import AdvancedFiltersButton from "../AdvancedFiltersButton";
import useAdvancedFiltersModal from "@/app/hooks/useAdvancedFiltersModal";
import { usePathname, useSearchParams } from "next/navigation";
import { faHouse, faHotel, faPerson } from '@fortawesome/free-solid-svg-icons';

export const options = [
  {
    label: "Private",
    icon: faHouse,
    description: "This is private home, that takes care of pets",
  },
  {
    label: "Hotel",
    icon: faHotel,
    description: "This is a verified hotel, that will take care of your pets",
  },
  {
    label: "Petgarten",
    icon: faPerson,
    description: "This is a petgarten, for your pets",
  },
];

const BasicFilters = () => {
  const params = useSearchParams();
  const category = params?.get("category");
  const pathname = usePathname();
  const advancedFiltersModal = useAdvancedFiltersModal();

  const isMainPage = pathname === "/";
  const advancedFilters = params?.get("advancedFilters");
    
  const getCurrentFilters = () => {

    const minPrice = params?.get("minPrice");
    const maxPrice = params?.get("maxPrice");
    const category = params?.get("category");
    const nearMe = params?.get("nearMe");
    const facility = params?.get("facility");
    const hasCancelation = params?.get("hasCancelation");
    const paymentMethodsCards = params?.get("paymentMethodsCards");
    const paymentMethodsCash = params?.get("paymentMethodsCash");
    const review = params?.get("review");

    let filters = [];

    if (minPrice && maxPrice) {
      filters.push({ label: "Price Range", value: `Price Range: [${minPrice}-${maxPrice}]` });
    }
    else if (minPrice) {
      filters.push({ label: "Minimal Price", value: `Minimal Price: ${minPrice}` });
    }
    else if (maxPrice) {
      filters.push({ label: "Maximal Price", value: `Maximal Price: ${maxPrice}` });
    }

    if (category) {
      filters.push({ label: "Category", value: `Category: ${category}` });
    }

    if (nearMe) {
      filters.push({ label: "Distance", value: `Distance: ${nearMe}km` });
    }

    if (facility) {
      filters.push({ label: "Facilities", value: `Facilities: ${facility}` });
    }

    if (hasCancelation) {
      filters.push({ label: "Has Cancelation", value: "Has Cancelation" });
    }

    if (paymentMethodsCards) {
      filters.push({ label: "Accept cards", value: "Accept cards" });
    }

    if (paymentMethodsCash) {
      filters.push({ label: "Accept cash", value: "Accept cash" });
    }

    if (review) {
      filters.push({ label: "Paws", value: `Paws: ${review}paw` });
    }

    return filters;
  };

  if (!isMainPage) {
    return null;
  }

  return (
    <Container>
      <div className="pt-4 flex flex-row items-center justify-between gap-3 overflow-x-auto">
      {
      advancedFilters? 
      (
<div className="flex justify-center items-center gap-4 mb-9">
  <div className="text-lg font-semibold text-gray-800">Current Search</div>
  <div className="flex flex-wrap justify-center items-center gap-4">
    {getCurrentFilters().map((filter) => (
      <div
        key={filter.label}
        className="px-4 py-1 rounded-full border-2 border-amber-800 text-amber-800 font-semibold text-center"
      >
        {filter.value}
      </div>
    ))}
  </div>
</div>
      ) : 
      ( 
        <div className="flex flex-row gap-3 flex-grow justify-around">
          {options.map((item) => (
            <BasicFilterOption
              key={item.label}
              label={item.label}
              selected={category === item.label}
              icon={item.icon}
            />
          ))}
        </div>
      )}

        <div className="flex-shrink-0 flex items-center justify-center -mt-4">
          <AdvancedFiltersButton
            selected={category === "Filters"}
            onClick={advancedFiltersModal.onOpen}
          />
        </div>
      </div>
    </Container>
  );
};

export default BasicFilters;
