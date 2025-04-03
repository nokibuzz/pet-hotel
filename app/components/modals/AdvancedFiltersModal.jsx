"use client";

import qs from "query-string";
import useAdvancedFiltersModal from "@/app/hooks/useAdvancedFiltersModal";
import Modal from "./Modal";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import RangeInput from "../inputs/RangeInput";
import { options } from "../navbar/BasicFilters";
import AdvancedFiltersOption from "../AdvancedFiltersOption";
import DescreteSlider from "../inputs/DiscreteSlider";
import {
  faBone,
  faShower,
  faUserDoctor,
} from "@fortawesome/free-solid-svg-icons";
import Toggle from "../inputs/Toggle";
import Calendar from "../inputs/Calendar";
import { formatISO } from "date-fns";
import { PET_TYPES } from "@/app/utils/PetConstants";
import { useGlobal } from "@/app/hooks/GlobalContext";
import Button from "../Button";

export const facilityOptions = [
  {
    label: "Food",
    icon: faBone,
  },
  {
    label: "Grooming",
    icon: faShower,
  },
  {
    label: "Veterinarian",
    icon: faUserDoctor,
  },
];

const AdvancedFiltersModal = ({ currentUser }) => {
  const router = useRouter();
  const params = useSearchParams();
  const advancedFiltersModal = useAdvancedFiltersModal();

  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [category, setCategory] = useState("");
  const [petType, setPetType] = useState("");
  const [nearMe, setNearMe] = useState("");
  const [facility, setFacility] = useState("");
  const [hasCancelation, setHasCancelation] = useState(false);
  const [paymentMethodsCards, setPaymentMethodsCards] = useState(false);
  const [paymentMethodsCash, setPaymentMethodsCash] = useState(false);
  const [review, setReview] = useState("");
  const [includeDateRange, setIncludeDateRange] = useState(false);

  const {
    selectedPet,
    setSelectedPet,
    pets,
    petChanged,
    setPetChanged,
    fetchPetsForUser,
  } = useGlobal();

  useEffect(() => {
    if (currentUser) {
      fetchPetsForUser(currentUser.id);
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedPet && petChanged) {
      setPetType(selectedPet.typeName);
      setPetChanged(false);
      const currentQuery = buildQueryParams();
      currentQuery.petType = selectedPet.typeName;

      const url = qs.stringifyUrl(
        {
          url: "/",
          query: currentQuery,
        },
        { skipNull: true }
      );

      router.push(url);
    }
  }, [selectedPet, petChanged]);

  useEffect(() => {
    if (advancedFiltersModal.isOpen) {
      setDateRange({
        startDate: new Date(params?.get("startDate") || new Date()),
        endDate: new Date(params?.get("endDate") || new Date()),
        key: "selection",
      });
      setPriceRange([
        parseInt(params?.get("minPrice") || 0),
        parseInt(params?.get("maxPrice") || 1000000),
      ]);
      setCategory(params?.get("category") || "");
      setNearMe(params?.get("nearMe") || "");
      setFacility(params?.get("facility") || "");
      setHasCancelation(JSON.parse(params?.get("hasCancelation")) || false);
      setPaymentMethodsCards(
        JSON.parse(params?.get("paymentMethodsCards")) || false
      );
      setPaymentMethodsCash(
        JSON.parse(params?.get("paymentMethodsCash")) || false
      );
      setReview(params?.get("review") || "");
    }
  }, [advancedFiltersModal.isOpen, params]);

  const changeCategory = (value, isSelected) => {
    if (isSelected) {
      setCategory((previousValue) => {
        if (!previousValue) {
          return value;
        }

        return `${previousValue},${value}`;
      });
    } else {
      setCategory((previousValue) => {
        const updated = previousValue
          .split(",")
          .filter((item) => item !== value)
          .join(",");

        return updated;
      });
    }
  };

  const changePet = (value, isSelected) => {
    if (isSelected) {
      setSelectedPet(value);
      setPetType(value.typeName);
    } else {
      setSelectedPet(null);
      setPetType("");
    }
  };

  const changePetType = (value, isSelected) => {
    if (isSelected) {
      setPetType(value);
    } else {
      setPetType("");
    }
  };

  const changeFacility = (value, isSelected) => {
    if (isSelected) {
      setFacility((previousValue) => {
        if (!previousValue) {
          return value;
        }

        return `${previousValue},${value}`;
      });
    } else {
      setFacility((previousValue) => {
        const updated = previousValue
          .split(",")
          .filter((item) => item !== value)
          .join(",");

        return updated;
      });
    }
  };

  const buildQueryParams = () => {
    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
      delete currentQuery.advancedFilters;
    }

    if (includeDateRange) {
      if (dateRange.startDate) {
        currentQuery.startDate = formatISO(dateRange.startDate);
      }

      if (dateRange.endDate) {
        currentQuery.endDate = formatISO(dateRange.endDate);
      }
    } else {
      delete currentQuery.startDate;
      delete currentQuery.endDate;
    }

    if (parseInt(params?.get("minPrice") || 0) != priceRange[0]) {
      currentQuery.minPrice = priceRange[0];
    }

    if (parseInt(params?.get("maxPrice") || 1000000) != priceRange[1]) {
      currentQuery.maxPrice = priceRange[1];
    }

    if (category && category != "") {
      currentQuery.category = category;
    }

    if (petType && petType != "") {
      currentQuery.petType = petType;
    }

    if (nearMe != "") {
      if (nearMe == 0.1) {
        delete currentQuery.nearMe;
      } else {
        currentQuery.nearMe = nearMe;
      }
    }

    if (facility && facility != "") {
      currentQuery.facility = facility;
    }

    if (hasCancelation) {
      currentQuery.hasCancelation = hasCancelation;
    } else {
      delete currentQuery.hasCancelation;
    }

    if (paymentMethodsCards) {
      currentQuery.paymentMethodsCards = paymentMethodsCards;
    } else {
      delete currentQuery.paymentMethodsCards;
    }

    if (paymentMethodsCash) {
      currentQuery.paymentMethodsCash = paymentMethodsCash;
    } else {
      delete currentQuery.paymentMethodsCash;
    }

    if (review != "") {
      if (review == 0.1) {
        delete currentQuery.review;
      } else {
        currentQuery.review = review;
      }
    }

    if (Object.keys(currentQuery).length !== 0 && advancedFiltersModal.isOpen) {
      currentQuery.advancedFilters = true;
    }

    return currentQuery;
  };

  const onSubmit = useCallback(async () => {
    const currentQuery = buildQueryParams();

    const url = qs.stringifyUrl(
      {
        url: "/",
        query: currentQuery,
      },
      { skipNull: true }
    );

    advancedFiltersModal.onClose();

    router.push(url);
  }, [
    advancedFiltersModal,
    router,
    params,
    dateRange,
    priceRange,
    category,
    petType,
    nearMe,
    facility,
    hasCancelation,
    paymentMethodsCards,
    paymentMethodsCash,
    review,
  ]);

  const onReset = useCallback(async () => {
    advancedFiltersModal.onClose();
    router.push("/");
  });

  let bodyContent = (
    <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-scroll scrollbar-hide p-6 hide-scrollbar">
      <div className="border-b pb-4">
        <h3 className="font-semibold text-lg mb-2">
          {advancedFiltersModal.translation.Advanced?.dateRange || "Date Range"}
        </h3>
        <Calendar
          value={dateRange}
          onChange={(value) => {
            setDateRange(value.selection);
            setIncludeDateRange(true);
          }}
          locale={advancedFiltersModal.translation.Advanced?.locale || "sr"}
        />
        {includeDateRange && (
          <Button
            outline
            label={
              advancedFiltersModal.translation.Advanced?.disableDates ||
              "Clear date range"
            }
            onClick={() => {
              setDateRange({
                startDate: new Date(),
                endDate: new Date(),
                key: "selection",
              });
              setIncludeDateRange(false);
            }}
          />
        )}
      </div>

      {pets?.length > 0 && (
        <div className="border-b pb-4">
          <h3 className="font-semibold text-lg mb-2">Your pets</h3>
          <div className="flex flex-row overflow-x-auto gap-3 justify-around hide-scrollbar">
            {pets.map((item) => (
              <AdvancedFiltersOption
                key={item.id}
                label={item.name}
                value={item}
                selected={selectedPet === item}
                image={item.imageSrc?.[0]}
                onClick={(value, isSelected) => changePet(value, isSelected)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="border-b pb-4">
        <h3 className="font-semibold text-lg mb-2">Pet Type</h3>
        <div className="flex flex-row overflow-x-auto gap-3 justify-around hide-scrollbar">
          {PET_TYPES.map((item) => (
            <AdvancedFiltersOption
              key={item.label}
              label={item.label}
              value={item.label}
              selected={petType === item.label}
              icon={item.icon}
              onClick={(value, isSelected) => changePetType(value, isSelected)}
            />
          ))}
        </div>
      </div>

      <div className="border-b pb-4">
        <h3 className="font-semibold text-lg mb-2">
          {advancedFiltersModal.translation.Advanced?.pricePerNight ||
            "Price (per night)"}
        </h3>
        <RangeInput
          min={0}
          max={1000000}
          value={priceRange}
          onChange={setPriceRange}
          rangeElementLabel={"$"}
        />
      </div>

      <div className="border-b pb-4">
        <h3 className="font-semibold text-lg mb-2">
          {advancedFiltersModal.translation.Advanced?.accomodationType ||
            "Accommodation Type"}
        </h3>
        <div className="flex flex-row gap-3 flex-grow justify-around">
          {options.map((item) => (
            <AdvancedFiltersOption
              key={item.label}
              label={
                advancedFiltersModal.translation?.[item.label] || item.label
              }
              value={item.label}
              selected={category.includes(item.label)}
              icon={item.icon}
              onClick={(value, isSelected) => changeCategory(value, isSelected)}
            />
          ))}
        </div>
      </div>

      <div className="border-b pb-10">
        <h3 className="font-semibold text-lg mb-2">
          {advancedFiltersModal.translation.Advanced?.distanceFromMe ||
            "Distance from me"}
        </h3>
        <DescreteSlider
          values={{
            0.1: "X",
            1: "1km",
            3: "3km",
            5: "5km",
            10: "10km",
          }}
          value={nearMe}
          onChange={setNearMe}
        />
      </div>

      <div className="border-b pb-4">
        <h3 className="font-semibold text-lg mb-2">
          {advancedFiltersModal.translation.Advanced?.facilities ||
            "Facilities"}
        </h3>
        <div className="flex flex-row gap-3 flex-grow justify-around">
          {facilityOptions.map((item) => (
            <AdvancedFiltersOption
              key={item.label}
              label={
                advancedFiltersModal.translation.Advanced?.[item.label] ||
                item.label
              }
              value={item.label}
              selected={facility.includes(item.label)}
              icon={item.icon}
              onClick={(value, isSelected) => changeFacility(value, isSelected)}
            />
          ))}
        </div>
      </div>

      <div className="border-b pb-10">
        <h3 className="font-semibold text-lg mb-2">
          {advancedFiltersModal.translation.Advanced?.reviews || "Reviews"}
        </h3>
        <DescreteSlider
          values={{
            0.1: "X",
            1: advancedFiltersModal.translation.Advanced?.onePaw || "1 paw",
            2: advancedFiltersModal.translation.Advanced?.twoPaw || "2 paws",
            3: advancedFiltersModal.translation.Advanced?.threePaw || "3 paws",
            4: advancedFiltersModal.translation.Advanced?.fourPaw || "4 paws",
            5: advancedFiltersModal.translation.Advanced?.fivePaw || "5 paws",
          }}
          value={review}
          onChange={setReview}
        />
      </div>

      <div className="border-b pb-4">
        <h3 className="font-semibold text-lg mb-2">
          {advancedFiltersModal.translation.Advanced?.houseRules ||
            "House rules"}
        </h3>
        <div className="flex flex-row gap-3 flex-grow justify-around">
          <Toggle
            id="hasCancelation"
            label={
              advancedFiltersModal.translation.Advanced?.hasCancelation ||
              "Has cancelation policy"
            }
            value={hasCancelation}
            onChange={setHasCancelation}
            col={true}
          />

          <Toggle
            id="paymentMethodsCards"
            label={
              advancedFiltersModal.translation.Advanced?.paymentMethodsCards ||
              "Accept cards"
            }
            value={paymentMethodsCards}
            onChange={setPaymentMethodsCards}
            col={true}
          />

          <Toggle
            id="paymentMethodsCash"
            label={
              advancedFiltersModal.translation.Advanced?.paymentMethodsCash ||
              "Accept cash"
            }
            value={paymentMethodsCash}
            onChange={setPaymentMethodsCash}
            col={true}
          />
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={advancedFiltersModal.isOpen}
      onClose={advancedFiltersModal.onClose}
      onSubmit={onSubmit}
      title={
        advancedFiltersModal.translation.Advanced?.title || "Advanced Filters"
      }
      actionLabel={
        advancedFiltersModal.translation.Advanced?.submit || "Search"
      }
      secondaryAction={onReset}
      secondaryActionLabel={
        advancedFiltersModal.translation.Advanced?.reset || "Reset filters"
      }
      body={bodyContent}
    />
  );
};

export default AdvancedFiltersModal;
