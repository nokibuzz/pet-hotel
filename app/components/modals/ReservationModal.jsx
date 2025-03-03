"use client";

import useReservationModal from "@/app/hooks/useReservationModal";
import Modal from "./Modal";
import { useMemo, useState } from "react";
import Heading from "../Heading";
import { petTypes } from "../PetTypes";
import CategoryInput from "../inputs/CategoryInput";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import Calendar from "../inputs/Calendar";

const STEPS = Object.freeze({
  TYPE: 0,
  DATE: 1,
  OVERVIEW: 2,
});

const ReservationModal = () => {
  const router = useRouter();
  const reservationModal = useReservationModal();

  const [step, setStep] = useState(STEPS.TYPE);
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState(null);

  console.log("res", JSON.stringify(reservationModal.listing));

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

    // TODO: do not forget to reduce capacity in types field
    // TODO: also for ADVANCED capacitType autocalculate totalPlaces field and reduce it as well

    axios
      .post("/api/reservations", {
        typeId,
        totalPrice,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        listingId: reservationModal.listing?.id,
      })
      .then(() => {
        toast.success("Successfully reserved pet stay!");
        router.refresh();
        // Resetting form, from react-form-hook library
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
        {petTypes.map((item) => (
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

  const searchParams = useSearchParams();
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

  // TODO: add from listingClient in other task
  const disabledDates = useMemo(() => {
    return [];
  });

  //   const customDayRenderer = (date) => {
  //     const formattedDate = date.toISOString().split("T")[0];

  //     // Check if the date is blocked
  //     if (disabledDates.includes(formattedDate)) {
  //       return (
  //         <div
  //           style={{
  //             backgroundColor: "#d9534f",
  //             color: "white",
  //             borderRadius: "50%",
  //           }}
  //         >
  //           {date.getDate()}
  //         </div>
  //       );
  //     }

  //     // Check if the date has a special price
  //     const priceForDate = availability.find((period) => {
  //       return (
  //         period.startDate <= formattedDate && period.endDate >= formattedDate
  //       );
  //     });

  //     return (
  //       <div style={{ position: "relative" }}>
  //         <span>{date.getDate()}</span>
  //         {priceForDate && (
  //           <span
  //             style={{
  //               position: "absolute",
  //               top: -10,
  //               left: "50%",
  //               transform: "translateX(-50%)",
  //               fontSize: "10px",
  //               color: "blue",
  //             }}
  //           >
  //             ${priceForDate.price}
  //           </span>
  //         )}
  //       </div>
  //     );
  //   };

  if (step === STEPS.DATE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title={"Choose a reservation date"}
          subtitle={"Choose a datefrom and to"}
        />
        {/* TODO: add calculated price here as well, so user can see real time updates on price */}
        <Calendar
          value={dateRange}
          disabledDates={disabledDates}
          onChange={(value) => setDateRange(value.selection)}
          locale={"sr"}
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
        {/* TODO: add all the informations about booking, pet type, date from-date to, final price */}
      </div>
    );
  }

  return (
    <Modal
      isOpen={reservationModal.isOpen}
      onClose={() => {
        reset();
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
