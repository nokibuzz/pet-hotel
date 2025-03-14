"use client";

import useReservationModal from "@/app/hooks/useReservationModal";
import Modal from "./Modal";
import { useMemo, useState, useEffect } from "react";
import Heading from "../Heading";
import { petTypes } from "../PetTypes";
import CategoryInput from "../inputs/CategoryInput";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import Calendar from "../inputs/Calendar";
import ReservationInfoField from "../ReservationInfoField";
import ReservationInfoFieldView from "../ReservationInfoFieldView";

const STEPS = Object.freeze({
  TYPE: 0,
  DATE: 1,
  OVERVIEW: 2,
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
  // Assuming `unavailableDates` is a Set containing the dates
  const disabledDatesArray = [...disabledDates];
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [defaultPrice, setDefaultPrice] = useState(0);
  const [weekendPrice, setWeekendPrice] = useState(0);

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
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      typeId: "",
    },
  });

  const typeId = watch("typeId");

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
        totalPrice,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
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
        {petTypes
          .filter((petType) =>
            reservationModal?.listing?.types?.some(
              (type) => type.name === petType.label
            )
          )
          .map((item) => (
            <div key={item.label} className="col-span-1">
              <CategoryInput
                onClick={(type) => {
                  setCustomTypeId(type);
                }}
                selected={type?.name === item.label}
                label={item.label}
                value={item.label}
                icon={item.icon}
              />
            </div>
          ))}
      </div>
    </div>
  );

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
      disabled={isLoading}
      canCloseDisabled
    />
  );
};

export default ReservationModal;
