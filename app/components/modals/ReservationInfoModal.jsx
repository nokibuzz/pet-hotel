"use client";

import useReservationInfoModal from "@/app/hooks/useReservationInfoModal";
import Modal from "./Modal";
import { useEffect, useState } from "react";
import Heading from "../Heading";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ReservationInfoFieldView from "../ReservationInfoFieldView";
import UserInfoView from "../UserInfoView";
import ActionButton from "../ActionButton";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import TextArea from "../inputs/TextArea";
import { eachDayOfInterval, isWeekend } from "date-fns";
import ReservationStatusField from "../reservations/ReservationStatusField";
import TypeBreedView from "../TypeBreedView";
import ReservationInfoPaymentView from "../reservations/ReservationInfoPaymentView";

export const RESERVATION_INFO_STEPS = Object.freeze({
  OVERVIEW: 0,
  REJECT: 1,
  CONFIRMATION: 2,
});

const ReservationInfoModal = ({ currentUser }) => {
  const router = useRouter();
  const reservationInfoModal = useReservationInfoModal();

  const [step, setStep] = useState(RESERVATION_INFO_STEPS.OVERVIEW);
  const [confirmReservationExecuted, setConfirmReservationExecuted] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const [totalWorkDays, setTotalWorkDays] = useState(0);
  const [totalWeekendDays, setTotalWeekendDays] = useState(0);

  const {
    handleSubmit,
    setValue,
    register,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      rejectReason: "",
    },
  });

  useEffect(() => {
    if (
      reservationInfoModal.isOpen &&
      reservationInfoModal.reservation?.step !== undefined
    ) {
      setStep(reservationInfoModal.reservation.step);
      if (
        reservationInfoModal.reservation.step ===
          RESERVATION_INFO_STEPS.REJECT ||
        reservationInfoModal.reservation.step ===
          RESERVATION_INFO_STEPS.CONFIRMATION
      ) {
        setShowFooter(true);
      }
    }
  }, [reservationInfoModal.isOpen]);

  useEffect(() => {
    if (
      !reservationInfoModal?.reservation?.startDate ||
      !reservationInfoModal?.reservation?.endDate
    )
      return;

    const allDays = eachDayOfInterval({
      start: new Date(reservationInfoModal.reservation.startDate),
      end: new Date(reservationInfoModal.reservation.endDate),
    });

    const workDays = allDays.filter((day) => !isWeekend(day)).length;
    const weekendDays = allDays.length - workDays;

    setTotalWorkDays(workDays);
    setTotalWeekendDays(weekendDays);
  }, [
    reservationInfoModal.reservation?.startDate,
    reservationInfoModal.reservation?.endDate,
  ]);

  const onConfirm = () => {
    setStep(RESERVATION_INFO_STEPS.CONFIRMATION);
    setShowFooter(true);
  };

  const onReject = () => {
    setStep(RESERVATION_INFO_STEPS.REJECT);
    setShowFooter(true);
  };

  const onConfirmReservation = () => {
    if (!confirmReservationExecuted) {
      setConfirmReservationExecuted(true);

      const data = {
        reservationId: reservationInfoModal.reservation.id,
        listingId: reservationInfoModal.reservation.listingId,
      };

      axios
        .put("/api/reservations/approve", data)
        .then(() => {
          toast.success("Successfully approved reservation!");
          router.refresh();
          reset();
          setStep(RESERVATION_INFO_STEPS.OVERVIEW);
          reservationInfoModal.onClose();
          setConfirmReservationExecuted(false);
        })
        .catch(() => {
          toast.error("Something went wrong on approving reservation!");
        });
    }
  };

  const onSubmit = (d) => {
    setIsLoading(true);

    const data = {
      reservationId: reservationInfoModal.reservation.id,
      listingId: reservationInfoModal.reservation.listingId,
      typeId: reservationInfoModal.reservation.typeId,
      startDate: reservationInfoModal.reservation.startDate,
      endDate: reservationInfoModal.reservation.endDate,
      totalSlots: reservationInfoModal.reservation.type.capacity,
      rejectReason: d.rejectReason,
    };

    axios
      .put("/api/reservations/reject", data)
      .then(() => {
        toast.success("Successfully rejected reservation!");
        router.refresh();
        reset();
        setStep(RESERVATION_INFO_STEPS.OVERVIEW);
        setShowFooter(false);
        reservationInfoModal.onClose();
        setConfirmReservationExecuted(false);
      })
      .catch(() => {
        toast.error("Something went wrong on approving reservation!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  let bodyContent;

  if (step === RESERVATION_INFO_STEPS.OVERVIEW) {
    bodyContent = (
      <div className="flex flex-col gap-4">
        <Heading
          title={"Reservation overview"}
          subtitle={"Details about your reservation"}
        />
        <UserInfoView user={reservationInfoModal?.reservation?.user} />
        <TypeBreedView
          typeName={reservationInfoModal?.reservation?.type?.name}
          breed={reservationInfoModal?.reservation?.breed}
          breedDescription={reservationInfoModal?.reservation?.breedDescription}
        />
        <ReservationInfoPaymentView
          paymentMethod={reservationInfoModal.reservation?.paymentMethod}
        />
        <ReservationInfoFieldView
          dateFrom={reservationInfoModal?.reservation?.startDate}
          dateTo={reservationInfoModal?.reservation?.endDate}
          workDays={totalWorkDays}
          weekendDays={totalWeekendDays}
          totalPrice={reservationInfoModal?.reservation?.totalPrice}
        />

        {reservationInfoModal.reservation?.type?.listing?.userId ===
          currentUser?.id &&
          reservationInfoModal.reservation?.status === "pending" && (
            <>
              <hr />
              <div className="flex flex-row self-center items-center justify-between min-w-[200px] p-2 w-[80%] mt-4 sm:mt-0 pt-4 sm:pt-0">
                <ActionButton
                  onClick={onConfirm}
                  disabled={isLoading}
                  icon={AiOutlineCheck}
                  tooltip="Approve"
                  variant="approve"
                  className="w-full sm:w-auto"
                  title="Approve"
                />
                <ActionButton
                  onClick={onReject}
                  disabled={isLoading}
                  icon={AiOutlineClose}
                  tooltip="Dismiss"
                  variant="reject"
                  className="w-full sm:w-auto"
                  title="Reject"
                />
              </div>
            </>
          )}
        {(reservationInfoModal.reservation?.status !== "pending" ||
          reservationInfoModal.reservation?.type?.listing?.userId !==
            currentUser?.id) && (
          <div>
            <ReservationStatusField
              status={reservationInfoModal.reservation?.status}
            />
          </div>
        )}
      </div>
    );
  }

  if (step === RESERVATION_INFO_STEPS.CONFIRMATION) {
    bodyContent = (
      <div className="flex flex-col gap-4">
        <Heading title={"Processing..."} />
        {/* <ConfirmationTimer
          onConfirm={() => onConfirmReservation()}
          onCancel={() => {
            setShowFooter(false);
            setStep(RESERVATION_INFO_STEPS.OVERVIEW);
            reset();
            reservationInfoModal.onClose();
          }}
        /> */}
      </div>
    );
  }

  if (step === RESERVATION_INFO_STEPS.REJECT) {
    bodyContent = (
      <div>
        <Heading
          title="Reject Reason"
          subtitle="Let the user know the reason of rejection"
        />
        <TextArea
          id="rejectReason"
          label="Reject Reason"
          defaultNumberOfRows={5}
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  return (
    <Modal
      isOpen={reservationInfoModal.isOpen}
      onClose={() => {
        setStep(RESERVATION_INFO_STEPS.OVERVIEW);
        setShowFooter(false);
        reset();
        reservationInfoModal.onClose();
      }}
      title={
        reservationInfoModal?.reservation?.type?.listing?.title +
        " | " +
        reservationInfoModal?.reservation?.type?.listing?.category
      }
      onSubmit={handleSubmit(onSubmit)}
      actionLabel="Confirm"
      secondaryActionLabel="Cancel"
      secondaryAction={() => {
        setStep(RESERVATION_INFO_STEPS.OVERVIEW);
        setShowFooter(false);
        reset();
        reservationInfoModal.onClose();
      }}
      showFooter={showFooter}
      body={bodyContent}
      disabled={isLoading}
      canCloseDisabled
    />
  );
};

export default ReservationInfoModal;
