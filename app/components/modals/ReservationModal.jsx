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
import PetInfoView from "../pets/PetInfoView";
import sendEmail from "@/app/utils/sendEmail";
import { logEvent } from "@/app/utils/clientLogger";

const STEPS = Object.freeze({
  PET: 0,
  PET_OVERVIEW: 1,
  TYPE: 2,
  BREED: 3,
  DATE: 4,
  PAYMENT: 5,
  OVERVIEW: 6,
});

const ReservationModal = ({ currentUser, translation }) => {
  const router = useRouter();
  const reservationModal = useReservationModal();
  const searchParams = useSearchParams();

  const [step, setStep] = useState(!reservationModal.usedForBlocking ? STEPS.PET : STEPS.TYPE);
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

  const [pet, setPet] = useState({});

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
    if (reservationModal.pets == []) {
      setStep(STEPS.TYPE);
    }
  }, [reservationModal.pets, reservationModal.isOpen]);

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

        if (!response.ok)
          throw new Error(
            translation.error.failedToFetchDisabledDates ||
              "Failed to fetch disabled dates"
          );

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
        logEvent({ message: "Error fetching unavailable dates:", level: 'error', userId: currentUser?.id, error: error });
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

  const findType = (typeName) => {
    const type = reservationModal.listing.types.find(
      (type) => type.name === typeName
    );

    return type;
  };

  const onBack = () => {
    if (!reservationModal.usedForBlocking) {
      if (step === STEPS.TYPE) {
        setStep(STEPS.PET);
      }
      setStep((value) => value - 1);
    } 
    else {
      if (step == STEPS.BREED) {
        setStep(STEPS.PET);
      }
      if (step == STEPS.DATE) {
        setStep(STEPS.BREED);
      }
      if (step == STEPS.TYPE) {
        setStep(STEPS.BREED);
      }
      if (step == STEPS.OVERVIEW) {
        setStep(STEPS.DATE);
      }
    }
  };

  const onNext = () => {
    if (!reservationModal.usedForBlocking) {
      if (step === STEPS.PET && typeId === "") {
        setStep(STEPS.TYPE);
        return;
      }
      if (step === STEPS.PET_OVERVIEW) {
        setStep(STEPS.DATE);
        return;
      }
      if (step === STEPS.TYPE && typeId === "") {
        toast.error(
          translation.error?.petTypeShouldBeSelected ||
            "Pet type should be selected!"
        );
        return;
      }

      setStep((value) => value + 1);

    } else {
      if (step == STEPS.PET) {
        setStep(STEPS.BREED);
      }
      if (step == STEPS.BREED) {
        setStep(STEPS.DATE);
      }
      if (step == STEPS.DATE) {
        setStep(STEPS.OVERVIEW);
      }
    }
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
        petId: pet?.id,
        usedForBlocking: reservationModal.usedForBlocking
      })
      .then(() => {
        toast.success(
          translation.success?.reserved || "Successfully reserved pet stay!"
        );
        sendEmail.sendReservationMade(
          reservationModal.listing?.user?.email,
          reservationModal.listing?.title,
          currentUser?.name,
          currentUser?.email,
          breed,
          totalPrice,
          new Date(dateRange.startDate).toLocaleDateString("sr-RS"),
          new Date(dateRange.endDate).toLocaleDateString("sr-RS")
        );
        router.refresh();
        setCustomTypeId("");
        setDateRange(initialDateRange);
        reset();
        setStep(STEPS.PET);
        reservationModal.onClose();
      })
      .catch(() => {
        toast.error(
          translation.error?.reservationError ||
            "Something went wrong on reservation!"
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.OVERVIEW) {
      return translation.button?.reserve || "Reserve";
    }

    return translation.button?.next || "Next";
  }, [step]);

  const secondartActionLabel = useMemo(() => {
    if (
      (step === STEPS.TYPE && reservationModal.pets == []) ||
      step === STEPS.PET
    ) {
      return undefined;
    }

    return translation.button?.back || "Back";
  }, [step]);

  const setCustomPet = (petValue) => {
    setPet(petValue);
    if (petValue) {
      const typeName = petValue.typeName;
      const type = findType(typeName);
      setType(type);
      setCustomValue("typeId", type?.id);
      setCustomValue("breed", petValue.breed);
      setCustomValue("breedDesription", petValue.description);
      const breedOptionsForType = (PET_BREEDS[typeName]?.breeds || []).filter(
        (breed) => !reservationModal.listing?.blockedBreeds?.includes(breed)
      );
      setBreedOptions(breedOptionsForType);
    } else {
      setType(null);
      setCustomValue("typeId", "");
      setCustomValue("breed", "");
      setCustomValue("breedDesription", "");
      setBreedOptions([]);
    }
  };

  const setTypeContent = () => {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title={!reservationModal.usedForBlocking ? translation.Type.title : translation.Type.blockingTitle}
          subtitle={translation.Type?.subtitle || "Pick one"}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
          {filteredPetTypes.length === 0 && (
            <ClickInput
              onClick={() => setAllPetTypes()}
              selected={type?.name === ALL_PET_CATEGORIES}
              label={translation.Type?.allPets || "All Pets"}
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
                  label={translation.Type?.[item.label] || item.label}
                  value={item.label}
                  icon={item.icon}
                  tooltip={
                    translation.Type?.description?.[item.label] ||
                    item.description
                  }
                />
              </div>
            ))}
        </div>
      </div>
    );
  }

  let bodyContent;

  if (!reservationModal.usedForBlocking) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title={translation.Pet?.title || "Select your pet"}
          subtitle={translation.Pet?.subtitle || "...or insert custom values"}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
          {reservationModal.pets?.map((item) => (
            <div key={item.id} className="col-span-1">
              <ClickInput
                onClick={(pet) => {
                  setCustomPet(pet);
                }}
                selected={pet?.name === item.name}
                label={item.name}
                value={item}
                image={item.imageSrc?.[0]}
              />
            </div>
          ))}
          <ClickInput
            onClick={() => setCustomPet(null)}
            selected={pet === null}
            label={translation.Pet?.insertManually || "Insert manually"}
            value={null}
            image="/images/pet-custom.png"
          />
        </div>
      </div>
    );
  } 
  else {
    setTypeContent();
  }

  if (step === STEPS.PET_OVERVIEW) {
    bodyContent = (
      <div className="flex flex-col gap-4">
        <Heading
          title={translation.PetOverview?.title || "Pet overview"}
          subtitle={
            translation.PetOverview?.subtitle ||
            "Check details about your pet. If they are ok, continue with process."
          }
        />
        <PetInfoView pet={pet} />
        <TypeBreedView
          originalTypeName={type.name}
          breed={translation.breed?.[breed] || breed}
          breedDescription={
            pet.description ||
            translation.breedDescription?.[breed] ||
            breedDescription
          }
          typeName={translation.Type?.[type.name] || type.name}
        />
      </div>
    );
  }

  const setCustomTypeId = (typeName) => {
    const type = findType(typeName);
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

  if (step === STEPS.TYPE) {
    setTypeContent();
  }

  const changeBreed = (value) => {
    setCustomValue("breed", value);
    const breedDescriptionPh =
      translation.breedDescription?.[value] ||
      PET_DESCRIPTIONS[value] ||
      "Breed Description";

    setBreedDescriptionPlaceholder(breedDescriptionPh);
  };

  if (step === STEPS.BREED) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title={translation.Breed.title || "Pet breed"}
          subtitle={
            translation.Breed.subtitle ||
            "Let the object owner know the breed of your pet"
          }
        />
        <div className="flex flex-row gap-4 items-center">
          <Dropdown
            id="breed"
            label={translation.Breed.breedLabel || "Pet breed"}
            placeholder={translation.Breed.breedPlaceholder || "Choose breed"}
            register={register}
            errors={errors}
            required
            options={breedOptions}
            translate={translation}
            onChange={(value) => changeBreed(value)}
          />
          <ExplanationInfo
            text={
              translation.Breed.breedExplanation ||
              "If the breed of your pet is not on the list, input it manually."
            }
          />
        </div>
        {breed !== "" && (
          <Input
            id="breedDescription"
            label={translation.Breed.breedDescription || "Breed Description"}
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
          title={translation.Payment.title || "Payment type"}
          subtitle={
            translation.Payment.subtitle || "Choose wanted payment type"
          }
        />
        <div className="grid grid-cols-1 w-1/2 self-center gap-3 max-h-[50vh] overflow-y-auto">
          {paymentOptions().map((item) => (
            <div key={item.label} className="col-span-1">
              <ClickInput
                onClick={(paymentMethod) => {
                  setCustomValue("paymentMethod", paymentMethod);
                }}
                selected={paymentMethod === item.label}
                label={
                  translation.Payment?.paymentOptions?.[item.label] ||
                  item.label
                }
                value={item.label}
                icon={item.icon}
                tooltip={
                  translation.paymentDescription?.Payment?.[item.label] ||
                  item.description
                }
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
          title={translation.Date.title || "Choose a reservation date"}
          subtitle={translation.Date.subtitle || "Choose a date from and to"}
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
          locale={translation.locale || "sr"}
          customDayRenderer={customDayRenderer}
        />
        <ReservationInfoField
          dateFrom={dateRange?.startDate}
          dateTo={dateRange?.endDate}
          types={reservationModal?.listing?.types}
          typeId={typeId}
          onTotalPriceChange={handleTotalPriceChange}
          onSelectedDateChanged={handeSelectedDatesChange}
          translation={translation.Date}
        />
      </div>
    );
  }

  if (step === STEPS.OVERVIEW) {
    bodyContent = (
      <div className="flex flex-col gap-4">
        <Heading
          title={translation.Overview.title || "Reservation overview"}
          subtitle={
            translation.Overview.subtitle || "Details about your reservation"
          }
        />

        {!reservationModal?.usedForBlocking && (
          <>
            <TypeBreedView
              originalTypeName={type.name}
              breed={translation.breed?.[breed] || breed}
              breedDescription={breedDescription}
              typeName={translation.Type?.[type.name] || type.name}
            />
            <ReservationInfoPaymentView
              paymentMethod={paymentMethod}
              translation={translation}
            />
          </>
        )}
        <ReservationInfoFieldView
          dateFrom={dateRange?.startDate}
          dateTo={dateRange?.endDate}
          workDays={totalWorkDays}
          weekendDays={totalWeekendDays}
          totalPrice={totalPrice}
          translation={translation.Date}
        />
      </div>
    );
  }

  const getTitle = () => {
    return !reservationModal.usedForBlocking ? translation.title : translation.blockingTitle
  }

  return (
    <Modal
      isOpen={reservationModal.isOpen}
      onClose={() => {
        reset();
        setType(null);
        setDateRange(initialDateRange);
        setStep(STEPS.PET);
        reservationModal.onClose();
      }}
      onSubmit={handleSubmit(onSubmit)}
      title={getTitle()}
      actionLabel={actionLabel}
      secondaryActionLabel={secondartActionLabel}
      secondaryAction={
        step === STEPS.PET ||
        (reservationModal.pets == [] && step === STEPS.TYPE)
          ? undefined
          : onBack
      }
      body={bodyContent}
      disabled={isLoading && step !== STEPS.TYPE}
      canCloseDisabled
    />
  );
};

export default ReservationModal;
