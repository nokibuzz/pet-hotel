"use client";

import useReservationModal from "@/app/hooks/useReservationModal";
import Modal from "./Modal";
import { useMemo, useState, useEffect } from "react";
import Heading from "../Heading";
import {
  ALL_PET_CATEGORIES,
  PET_BREEDS,
  PET_DESCRIPTIONS,
  PET_TYPES,
  PAYMENT_OPTIONS,
} from "@/app/utils/PetConstants";
import ClickInput from "../inputs/ClickInput";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import Calendar from "../inputs/Calendar";
import ReservationInfoField from "../ReservationInfoField";
import ReservationInfoFieldView from "../ReservationInfoFieldView";
import Dropdown from "../inputs/Dropdown";
import ExplanationInfo from "../ExplanationInfo";
import Input from "../inputs/Input";
import { faOtter } from "@fortawesome/free-solid-svg-icons";
import ReservationInfoPaymentView from "../reservations/ReservationInfoPaymentView";
import TypeBreedView from "../TypeBreedView";

const STEPS = Object.freeze({
  TYPE: 0,
  BREED: 1,
  DATE: 2,
  PAYMENT: 3,
  OVERVIEW: 4,
});

const ReservationModal = () => {
  const router = useRouter();
  const reservationModal = useReservationModal();
  const searchParams = useSearchParams();

  const [step, setStep] = useState(STEPS.TYPE);
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalWorkDays, setTotalWorkDays] = useState(0);
  const [totalWeekendDays, setTotalWeekendDays] = useState(0);
  const [disabledDates, setDisabledDates] = useState(new Set()); // Store as Set for fast lookups
  const [fetchedRanges, setFetchedRanges] = useState([]); // Track already fetched periods
  const disabledDatesArray = [...disabledDates];
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [defaultPrice, setDefaultPrice] = useState(0);
  const [weekendPrice, setWeekendPrice] = useState(0);
  const [filteredPetTypes, setFilteredPetTypes] = useState([]);
  const [breedOptions, setBreedOptions] = useState([]);
  const [breedDescriptionPlaceholder, setBreedDescriptionPlaceholder] =
    useState("");

  const initialDateRange = {
    startDate: searchParams?.get("startDate")
      ? searchParams.get("startDate")
      : new Date(),
    endDate: searchParams?.get("endDate")
      ? searchParams.get("endDate")
      : new Date(),
    key: "selection",
  };

  const [dateRange, setDateRange] = useState(initialDateRange);

  const handleTotalPriceChange = (price) => {
    setTotalPrice(price);
  };

  const handeSelectedDatesChange = (workDays, weekendDays) => {
    setTotalWorkDays(workDays);
    setTotalWeekendDays(weekendDays);
  };

  const {
    handleSubmit,
    setValue,
    watch,
    register,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      typeId: "",
      breed: "",
      breedDescription: "",
      paymentMethod: "",
    },
  });

  const typeId = watch("typeId");
  const breed = watch("breed");
  const breedDescription = watch("breedDescription");
  const paymentMethod = watch("paymentMethod");

  useEffect(() => {
    const petTypesFiltered = PET_TYPES.filter((petType) =>
      reservationModal?.listing?.types?.some(
        (type) => type.name === petType.label
      )
    );

    setFilteredPetTypes(petTypesFiltered);
  }, [reservationModal?.listing?.types]);

  useEffect(() => {
    if (typeId) {
      const type = reservationModal?.listing?.types?.find(
        (type) => type.id === typeId
      );

      setDefaultPrice(type?.defaultPrice || 0);
      setWeekendPrice(type?.weekendPrice || 0);
    }
  }, [typeId]);

  useEffect(() => {
    setStartDate(dateRange.startDate);
    setEndDate(dateRange.endDate);

    async function fetchUnavailableDates() {
      if (!typeId) return; // Ensure typeId is selected

      setIsLoading(true);

      const startBuffer = new Date(startDate);
      startBuffer.setDate(startBuffer.getDate() - 30); // Start 30 days before startDate if possible

      const today = new Date();
      if (startBuffer < today) {
        // Ensure no past dates
        startBuffer.setDate(today.getDate());
        startBuffer.setMonth(today.getMonth());
        startBuffer.setFullYear(today.getFullYear());
      }

      const endBuffer = new Date(endDate);
      endBuffer.setDate(endBuffer.getDate() + 90); // End 90 days after endDate if possible

      // Check if the requested range is already covered by fetchedRanges
      const isAlreadyFetched = fetchedRanges.some(
        (range) =>
          range.typeId === typeId &&
          startBuffer >= range.startDate &&
          endBuffer <= range.endDate
      );

      if (isAlreadyFetched) {
        setIsLoading(false);
        return; // Skip API call if already fetched
      }

      try {
        const response = await fetch(
          `/api/disabled-dates?listingId=${
            reservationModal.listing.id
          }&typeId=${typeId}&startDate=${startBuffer.toISOString()}&endDate=${endBuffer.toISOString()}`
        );

        if (!response.ok) throw new Error("Failed to fetch disabled dates");

        const data = await response.json();
        const newDates = new Set(data.disabledDates.map((d) => new Date(d))); // Convert back to Date

        // If typeId has changed, reset unavailableDates. Otherwise, merge with existing dates.
        setDisabledDates((prev) => {
          if (fetchedRanges.some((range) => range.typeId === typeId)) {
            return new Set([...prev, ...newDates]); // Merge new dates
          }
          return newDates;
        });

        setIsLoading(false);

        setFetchedRanges((prev) => [
          ...prev,
          { typeId, startDate: startBuffer, endDate: endBuffer },
        ]);
      } catch (error) {
        console.error("Error fetching unavailable dates:", error);
      }
    }

    fetchUnavailableDates();
  }, [typeId, startDate, endDate, dateRange]); // Only re-run when these values change

  const setCustomValue = (id, value) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const setCustomTypeId = (typeName) => {
    const type = reservationModal.listing.types.find(
      (type) => type.name === typeName
    );
    setType(type);
    setCustomValue("typeId", type?.id);
    const breedOptionsForType = (PET_BREEDS[typeName]?.breeds || []).filter(
      (breed) => !reservationModal.listing?.blockedBreeds?.includes(breed)
    );
    setBreedOptions(breedOptionsForType);
  };

  const setAllPetTypes = () => {
    setCustomTypeId(ALL_PET_CATEGORIES);
    const breedOptionsAll = Object.values(PET_BREEDS).flatMap(
      (data) => data.breeds || []
    );

    setBreedOptions(breedOptionsAll);
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    if (step === STEPS.TYPE && typeId === "") {
      toast.error("Pet type should be selected!");
      return;
    }

    setStep((value) => value + 1);
  };

  const onSubmit = (data) => {
    if (step !== STEPS.OVERVIEW) {
      return onNext();
    }

    setIsLoading(true);

    axios
      .post("/api/reservations", {
        typeId,
        typeName: type?.name,
        totalPrice,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        breed,
        breedDescription: breedDescription === "" ? null : breedDescription,
        paymentMethod,
      })
      .then(() => {
        toast.success("Successfully reserved pet stay!");
        router.refresh();
        // Resetting form, from react-form-hook library
        setCustomTypeId("");
        setDateRange(initialDateRange);
        reset();
        setStep(STEPS.TYPE);
        reservationModal.onClose();
      })
      .catch(() => {
        toast.error("Something went wrong on reservation!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.OVERVIEW) {
      return "Reserve";
    }

    return "Next";
  }, [step]);

  const secondartActionLabel = useMemo(() => {
    if (step === STEPS.TYPE) {
      return undefined;
    }

    return "Back";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading title={"Choose type of your pet?"} subtitle={"Pick one"} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
        {filteredPetTypes.length === 0 && (
          <ClickInput
            onClick={() => setAllPetTypes()}
            selected={type?.name === ALL_PET_CATEGORIES}
            label="All Pets"
            value={ALL_PET_CATEGORIES}
            icon={faOtter}
          />
        )}
        {filteredPetTypes.length > 0 &&
          filteredPetTypes.map((item) => (
            <div key={item.label} className="col-span-1">
              <ClickInput
                onClick={(type) => {
                  setCustomTypeId(type);
                }}
                selected={type?.name === item.label}
                label={item.label}
                value={item.label}
                icon={item.icon}
                tooltip={item.description}
              />
            </div>
          ))}
      </div>
    </div>
  );

  const changeBreed = (value) => {
    setCustomValue("breed", value);
    const breedDescriptionPh = PET_DESCRIPTIONS[value] || "Breed Description";
    setBreedDescriptionPlaceholder(breedDescriptionPh);
  };

  if (step === STEPS.BREED) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Pet breed"
          subtitle="Let the object owner know the breed of your pet"
        />
        <div className="flex flex-row gap-4 items-center">
          <Dropdown
            id="breed"
            label="Pet breed"
            placeholder="Choose breed"
            register={register}
            errors={errors}
            required
            options={breedOptions}
            onChange={(value) => changeBreed(value)}
          />
          <ExplanationInfo text="If the breed of your pet is not on the list, input it manually." />
        </div>
        {breed !== "" && (
          <Input
            id="breedDescription"
            label="Breed Description"
            placeholder={breedDescriptionPlaceholder}
            register={register}
          />
        )}
      </div>
    );
  }

  const paymentOptions = () => {
    return PAYMENT_OPTIONS.filter(
      (option) => reservationModal.listing[option.key]
    );
  };

  if (step === STEPS.PAYMENT) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title={"Payment type"}
          subtitle={"Choose wanted payment type"}
        />
        <div className="grid grid-cols-1 w-1/2 self-center gap-3 max-h-[50vh] overflow-y-auto">
          {paymentOptions().map((item) => (
            <div key={item.label} className="col-span-1">
              <ClickInput
                onClick={(paymentMethod) => {
                  setCustomValue("paymentMethod", paymentMethod);
                }}
                selected={paymentMethod === item.label}
                label={item.label}
                value={item.label}
                icon={item.icon}
                tooltip={item.description}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const customDayRenderer = (date) => {
    const isWeekend = date.getDay() === 6 || date.getDay() === 0;
    const price = isWeekend ? weekendPrice : defaultPrice;

    // TODO: Check if the date has a special price

    return (
      <div style={{ position: "relative" }}>
        <span>{date.getDate()}</span>
        {
          <>
            <span
              style={{
                position: "absolute",
                top: 12,
                left: "50%",
                transform: "translateX(-100%)",
                fontSize: "10px",
                color: isWeekend ? "#6c757d" : "#a0a0a0",
              }}
            >
              {price}
            </span>
            <span
              style={{
                position: "absolute",
                top: 12,
                left: "50%",
                transform: "translateX(50%)",
                fontSize: "10px",
                color: isWeekend ? "#6c757d" : "#a0a0a0",
              }}
            >
              RSD
            </span>
          </>
        }
      </div>
    );
  };

  if (step === STEPS.DATE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title={"Choose a reservation date"}
          subtitle={"Choose a datefrom and to"}
        />
        <Calendar
          value={dateRange}
          disabledDates={disabledDatesArray}
          onChange={(value) => {
            const localStartDate = new Date(value.selection.startDate);
            localStartDate.setMinutes(
              localStartDate.getMinutes() - localStartDate.getTimezoneOffset()
            );

            const localEndDate = new Date(value.selection.endDate);
            localEndDate.setMinutes(
              localEndDate.getMinutes() - localEndDate.getTimezoneOffset()
            );

            setDateRange({
              startDate: localStartDate,
              endDate: localEndDate,
              key: value.selection.key,
            });
          }}
          locale={"sr"}
          customDayRenderer={customDayRenderer}
        />
        <ReservationInfoField
          dateFrom={dateRange?.startDate}
          dateTo={dateRange?.endDate}
          types={reservationModal?.listing?.types}
          typeId={typeId}
          onTotalPriceChange={handleTotalPriceChange}
          onSelectedDateChanged={handeSelectedDatesChange}
        />
      </div>
    );
  }

  if (step === STEPS.OVERVIEW) {
    bodyContent = (
      <div className="flex flex-col gap-4">
        <Heading
          title={"Reservation overview"}
          subtitle={"Details about your reservation"}
        />
        <TypeBreedView
          breed={breed}
          breedDescription={breedDescription}
          typeName={type.name}
        />
        <ReservationInfoPaymentView paymentMethod={paymentMethod} />
        <ReservationInfoFieldView
          dateFrom={dateRange?.startDate}
          dateTo={dateRange?.endDate}
          workDays={totalWorkDays}
          weekendDays={totalWeekendDays}
          totalPrice={totalPrice}
        />
      </div>
    );
  }

  return (
    <Modal
      isOpen={reservationModal.isOpen}
      onClose={() => {
        reset();
        setType(null);
        setDateRange(initialDateRange);
        setStep(STEPS.TYPE);
        reservationModal.onClose();
      }}
      onSubmit={handleSubmit(onSubmit)}
      title={"Reserve stay for pet"}
      actionLabel={actionLabel}
      secondaryActionLabel={secondartActionLabel}
      secondaryAction={step === STEPS.TYPE ? undefined : onBack}
      body={bodyContent}
      disabled={isLoading && step !== STEPS.TYPE}
      canCloseDisabled
    />
  );
};

export default ReservationModal;
