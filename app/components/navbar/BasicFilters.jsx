"use client";

import Container from "../Container";
import BasicFilterOption from "../BasicFilterOption";
import AdvancedFiltersButton from "../AdvancedFiltersButton";
import useAdvancedFiltersModal from "@/app/hooks/useAdvancedFiltersModal";
import { usePathname, useSearchParams } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { faHouse, faHotel, faPerson } from "@fortawesome/free-solid-svg-icons";
import SortFiltersOption from "../SortFiltersOption";
import { formatISO } from "date-fns";

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

const BasicFilters = ({ translation }) => {
  const params = useSearchParams();
  const category = params?.get("category");
  const pathname = usePathname();
  const advancedFiltersModal = useAdvancedFiltersModal();

  const isMainPage = pathname === "/";
  const advancedFilters = params?.get("advancedFilters");

  const [visibleFilters, setVisibleFilters] = useState([]);
  const [hiddenFiltersCount, setHiddenFiltersCount] = useState(0);

  const filtersRef = useRef(null);

  const getCurrentFilters = () => {
    const petCount = params?.get("petCount");
    const startDate = params?.get("startDate");
    const endDate = params?.get("endDate");
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

    if (petCount) {
      filters.push({
        label: "Number of pets",
        value: `${
          translation.Basic?.numberOfPets || "Number of pets:"
        } [${petCount}]`,
      });
    }

    if (startDate && endDate) {
      filters.push({
        label: "Date Range",
        value: `${translation.Basic?.dateRange || "Date Range:"} [${
          formatISO(startDate).split("T")[0]
        }-${formatISO(endDate).split("T")[0]}]`,
      });
    }

    if (minPrice && maxPrice) {
      filters.push({
        label: "Price Range",
        value: `${
          translation.Basic?.priceRange || "Price Range:"
        } [${minPrice}-${maxPrice}]`,
      });
    } else if (minPrice) {
      filters.push({
        label: "Minimal Price",
        value: `${
          translation.Basic?.minimalPrice || "Minimal Price:"
        } ${minPrice}`,
      });
    } else if (maxPrice) {
      filters.push({
        label: "Maximal Price",
        value: `${
          translation.Basic?.maximalPrice || "Maximal Price:"
        } ${maxPrice}`,
      });
    }

    if (category) {
      filters.push({
        label: "Category",
        value: `${translation.Basic?.category || "Category:"} ${category}`,
      });
    }

    if (nearMe) {
      filters.push({
        label: "Distance",
        value: `${translation.Basic?.distance || "Distance:"} ${nearMe}km`,
      });
    }

    if (facility) {
      filters.push({
        label: "Facilities",
        value: `${translation.Basic?.facilities || "Facilities:"} ${facility}`,
      });
    }

    if (hasCancelation) {
      filters.push({
        label: "Has Cancelation",
        value: `${translation.Basic?.hasCancelation || "Has Cancelation"}`,
      });
    }

    if (paymentMethodsCards) {
      filters.push({
        label: "Accept cards",
        value: `${translation.Basic?.acceptCards || "Accept cards"}`,
      });
    }

    if (paymentMethodsCash) {
      filters.push({
        label: "Accept cash",
        value: `${translation.Basic?.acceptCach || "Accept cash"}`,
      });
    }

    if (review) {
      filters.push({ label: "Paws", value: `Paws: ${review}paw` });
    }

    return filters;
  };

  useEffect(() => {
    const filters = getCurrentFilters();

    const containerWidth = filtersRef.current?.clientWidth || 0;

    let totalWidth = 0;
    let visible = [];

    for (let i = 0; i < filters.length; i++) {
      const filterWidth = 200;
      if (totalWidth + filterWidth <= containerWidth) {
        visible.push(filters[i]);
        totalWidth += filterWidth;
      } else {
        setHiddenFiltersCount(filters.length - i);
        break;
      }
    }

    setVisibleFilters(visible);
  }, [params]);

  if (!isMainPage) {
    return null;
  }

  return (
    <Container>
      <div
        className="pt-4 flex flex-row items-center justify-between gap-3 overflow-x-auto overflow-y-hidden"
        ref={filtersRef}
      >
        {advancedFilters ? (
          <div className="flex justify-center items-center gap-4 mb-9">
            <div className="text-lg font-semibold text-gray-800">
              {translation.Basic?.currentSearch || "Current Search"}
            </div>
            <div className="flex flex-wrap justify-center items-center gap-4">
              {visibleFilters.map((filter) => (
                <div
                  key={filter.label}
                  className="px-4 py-1 rounded-full border-2 border-amber-800 text-amber-800 font-semibold text-center"
                >
                  {filter.value}
                </div>
              ))}
              {hiddenFiltersCount > 0 && (
                <div className="px-4 py-1 rounded-full border-2 border-amber-800 text-amber-800 font-semibold text-center">
                  +{hiddenFiltersCount} {translation.more || "more"}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-row gap-3 flex-grow justify-around">
            {options.map((item) => (
              <BasicFilterOption
                key={item.label}
                label={translation?.[item.label] || item.label}
                selected={category === item.label}
                icon={item.icon}
              />
            ))}
          </div>
        )}

        <div className="flex flex-row gap-4 justify-end items-center flex-grow mb-4">
          <div className="flex items-center">
            <SortFiltersOption translation={translation} />
          </div>

          <div className="flex items-center">
            <AdvancedFiltersButton
              selected={category === "Filters"}
              onClick={() => advancedFiltersModal.onOpen(translation)}
              translation={translation}
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default BasicFilters;
