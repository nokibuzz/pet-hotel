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
import { PAYMENT_OPTION_ACCOUNT_PAYMENT } from "@/app/utils/PetConstants";
import ConfirmationTimer from "../ConfirmationTimer";
import Input from "../inputs/Input";
import Button from "../Button";
import ExplanationInfo from "../ExplanationInfo";
import sendEmail from "@/app/utils/sendEmail";

export const RESERVATION_INFO_STEPS = Object.freeze({
  OVERVIEW: 0,
  REJECT: 1,
  CONFIRMATION: 2,
});

const ReservationInfoModal = ({ currentUser, translation }) => {
  const router = useRouter();
  const reservationInfoModal = useReservationInfoModal();

  const [step, setStep] = useState(RESERVATION_INFO_STEPS.OVERVIEW);
  const [confirmReservationExecuted, setConfirmReservationExecuted] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const [totalWorkDays, setTotalWorkDays] = useState(0);
  const [totalWeekendDays, setTotalWeekendDays] = useState(0);
  const [banConfirmed, setBanConfirmed] = useState(false);

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      rejectReason: "",
      ban: null,
    },
  });

  const ban = watch("ban");

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

      const banToSend = ban;

      axios
        .put("/api/reservations/approve", data)
        .then(() => {
          toast.success(
            translation.success.approved || "Successfully approved reservation!"
          );
          router.refresh();
          reset();
          setStep(RESERVATION_INFO_STEPS.OVERVIEW);
          reservationInfoModal.onClose();
          sendEmail.sendApprovedReservation(
            reservationInfoModal?.reservation?.user?.email,
            reservationInfoModal?.reservation?.type?.listing?.title,
            reservationInfoModal?.reservation?.totalPrice,
            reservationInfoModal?.reservation?.type?.listing?.imageSrc?.[0],
            new Date(
              reservationInfoModal?.reservation?.startDate
            ).toLocaleDateString("sr-RS"),
            new Date(
              reservationInfoModal?.reservation?.endDate
            ).toLocaleDateString("sr-RS"),
            banToSend
          );
          setConfirmReservationExecuted(false);
        })
        .catch(() => {
          toast.error(
            translation.error.approve ||
              "Something went wrong on approving reservation!"
          );
        });
    }
  };

  const onSubmit = (d) => {
    setIsLoading(true);

    const reasonOfRejection = d.rejectReason;

    const data = {
      reservationId: reservationInfoModal.reservation.id,
      listingId: reservationInfoModal.reservation.listingId,
      typeId: reservationInfoModal.reservation.typeId,
      startDate: reservationInfoModal.reservation.startDate,
      endDate: reservationInfoModal.reservation.endDate,
      totalSlots: reservationInfoModal.reservation.type.capacity,
      rejectReason: reasonOfRejection,
    };

    axios
      .put("/api/reservations/reject", data)
      .then(() => {
        toast.successtranslation.success.reject ||
          "Successfully rejected reservation!";
        router.refresh();
        reset();
        setStep(RESERVATION_INFO_STEPS.OVERVIEW);
        setShowFooter(false);
        reservationInfoModal.onClose();
        sendEmail.sendRejectedReservation(
          reservationInfoModal?.reservation?.user?.email,
          reservationInfoModal?.reservation?.type?.listing?.title,
          reservationInfoModal?.reservation?.type?.listing?.imageSrc?.[0],
          new Date(
            reservationInfoModal?.reservation?.startDate
          ).toLocaleDateString("sr-RS"),
          new Date(
            reservationInfoModal?.reservation?.endDate
          ).toLocaleDateString("sr-RS"),
          reasonOfRejection
        );
        setConfirmReservationExecuted(false);
      })
      .catch(() => {
        toast.error(
          toast.successtranslation.error.reject ||
            "Something went wrong on rejecting reservation!"
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const isConfirmation = () => {
    return (
      (reservationInfoModal?.reservation?.paymentMethod ===
        PAYMENT_OPTION_ACCOUNT_PAYMENT &&
        !banConfirmed) ||
      reservationInfoModal?.reservation?.paymentMethod !==
        PAYMENT_OPTION_ACCOUNT_PAYMENT
    );
  };

  let bodyContent;

  if (step === RESERVATION_INFO_STEPS.OVERVIEW) {
    bodyContent = (
      <div className="flex flex-col gap-4">
        <Heading
          title={translation.Overview.title || "Reservation overview"}
          subtitle={
            translation.Overview.subtitle || "Details about your reservation"
          }
        />
        <UserInfoView
          user={reservationInfoModal?.reservation?.user}
          translate={translation?.Overview?.UserInfoView}
        />
        <TypeBreedView
          typeName={
            translation.Type?.[reservationInfoModal?.reservation?.type?.name] ||
            reservationInfoModal?.reservation?.type?.name
          }
          breed={
            translation.breed?.[reservationInfoModal?.reservation?.breed] ||
            reservationInfoModal?.reservation?.breed
          }
          breedDescription={reservationInfoModal?.reservation?.breedDescription}
        />
        <ReservationInfoPaymentView
          paymentMethod={reservationInfoModal.reservation?.paymentMethod}
          translation={translation?.Overview?.Payment}
        />
        <ReservationInfoFieldView
          dateFrom={reservationInfoModal?.reservation?.startDate}
          dateTo={reservationInfoModal?.reservation?.endDate}
          workDays={totalWorkDays}
          weekendDays={totalWeekendDays}
          totalPrice={reservationInfoModal?.reservation?.totalPrice}
          translation={translation?.Overview?.Date}
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
                  tooltip={
                    translation?.Overview?.approveTooltip ||
                    "Approve Reservation"
                  }
                  variant="approve"
                  className="w-full sm:w-auto"
                  title={translation?.Overview?.approve || "Approve"}
                />
                <ActionButton
                  onClick={onReject}
                  disabled={isLoading}
                  icon={AiOutlineClose}
                  tooltip={
                    translation?.Overview?.rejectTooltip || "Reject Reservation"
                  }
                  variant="reject"
                  className="w-full sm:w-auto"
                  title={translation?.Overview?.reject || "Reject"}
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
              translate={translation?.Overview}
            />
          </div>
        )}
      </div>
    );
  }

  if (step === RESERVATION_INFO_STEPS.CONFIRMATION) {
    bodyContent = (
      <div className="flex flex-col gap-4">
        <Heading
          title={translation.Confirmation.title || "Confirmation"}
          subtitle={
            isConfirmation()
              ? translation?.Confirmation?.subtitlePaymentAccount ||
                "Insert and confirm bank account number"
              : translation?.Confirmation?.subtitleProcessing || "Processing..."
          }
        />
        {reservationInfoModal?.reservation?.paymentMethod ===
          PAYMENT_OPTION_ACCOUNT_PAYMENT && (
          <>
            <div className="flex flex-row gap-4 items-center">
              <Input
                id="ban"
                label={translation?.Confirmation?.ban || "Bank Account Number"}
                placeholder={
                  translation?.Confirmation?.banPlaceholder ||
                  "Insert your bank account number"
                }
                type="text"
                register={register}
                required={isConfirmation}
                disabled={banConfirmed}
              />
              <ExplanationInfo
                text={
                  translation?.Confirmation?.banExplanation ||
                  "Insert your bank account number to the user, so it will be able to pay you."
                }
              />
            </div>

            {!banConfirmed && (
              <Button
                disabled={banConfirmed}
                label={translation?.Confirmation?.banButton || "Confirm BAN"}
                onClick={() => setBanConfirmed(true)}
              />
            )}
          </>
        )}

        <ConfirmationTimer
          enabled={!isConfirmation()}
          onConfirm={() => onConfirmReservation()}
          onCancel={() => {
            setShowFooter(false);
            setBanConfirmed(false);
            setStep(RESERVATION_INFO_STEPS.OVERVIEW);
            reset();
            reservationInfoModal.onClose();
          }}
        />
      </div>
    );
  }

  if (step === RESERVATION_INFO_STEPS.REJECT) {
    bodyContent = (
      <div>
        <Heading
          title={translation?.Reject?.title || "Reject Reason"}
          subtitle={
            translation?.Reject?.subtitle ||
            "Let the user know the reason of rejection"
          }
        />
        <TextArea
          id="rejectReason"
          label={translation?.Reject?.label || "Reject Reason"}
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
        setBanConfirmed(false);
        reset();
        reservationInfoModal.onClose();
      }}
      title={
        reservationInfoModal?.reservation?.type?.listing?.title +
        " | " +
        reservationInfoModal?.reservation?.type?.listing?.category
      }
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={translation?.actionLabel || "Confirm"}
      secondaryActionLabel={translation?.secondaryActionLabel || "Cancel"}
      secondaryAction={() => {
        setStep(RESERVATION_INFO_STEPS.OVERVIEW);
        setShowFooter(false);
        setBanConfirmed(false);
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
