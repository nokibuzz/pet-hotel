"use client";

import Modal from "./Modal";
import { useMemo, useState } from "react";
import Heading from "../Heading";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import TextArea from "../inputs/TextArea";
import useReviewModal from "@/app/hooks/useReviewModal";
import Rating from "../inputs/Rating";
import Toggle from "../inputs/Toggle";
import Input from "../inputs/Input";
import { useListingIdByPath } from "@/app/actions/getListingIdFromPath";

const STEPS = Object.freeze({
  RATING: 0,
  FEEDBACK: 1,
  OVERALL: 2,
});

const ReviewModal = ({ currentUser }) => {
  const router = useRouter();
  const reviewModal = useReviewModal();
  const listingId = useListingIdByPath();

  const [step, setStep] = useState(STEPS.RATING);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      overallRating: 1,
      locationRating: 1,
      serviceRating: 1,
      checkInRating: 1,
      title: "",
      positiveReview: "",
      negativeReview: "",
      likes: 0,
      dislikes: 0,
      suggestUs: false,
    },
  });

  const locationRating = watch("locationRating");
  const serviceRating = watch("serviceRating");
  const checkInRating = watch("checkInRating");
  const overallRating = watch("overallRating");
  const suggestUs = watch("suggestUs");

  const setCustomValue = (id, value) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const onSubmit = (data) => {
    if (step !== STEPS.OVERALL) {
      return onNext();
    }
    setIsLoading(true);

    data.userId = currentUser?.id;
    data.listingId = listingId;

    axios
      .post("/api/reviews", data)
      .then(() => {
        toast.success("Successfully created!");
        router.refresh();
        reset();
        setStep(STEPS.RATING);
        reviewModal.onClose();
      })
      .catch(() => toast.error("Something went wrong!"))
      .finally(() => setIsLoading(false));
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.OVERALL) {
      return "Leave Review";
    }

    return "Next";
  }, [step]);

  const secondartActionLabel = useMemo(() => {
    if (step === STEPS.RATING) {
      return undefined;
    }

    return "Back";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Tell us about your pet experience?"
        subtitle="How would you rate us, per:"
      />
      <Rating
        label="Location"
        value={locationRating}
        onChange={(value) => setCustomValue("locationRating", value)}
        errors={errors}
        disabled={isLoading}
      />
      <hr />
      <Rating
        label="Service"
        value={serviceRating}
        onChange={(value) => setCustomValue("serviceRating", value)}
        errors={errors}
        disabled={isLoading}
      />
      <hr />
      <Rating
        label="Check In"
        value={checkInRating}
        onChange={(value) => setCustomValue("checkInRating", value)}
        errors={errors}
        disabled={isLoading}
      />
    </div>
  );

  if (step === STEPS.FEEDBACK) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Describe your object"
          subtitle="Simple explanation works the best"
        />
        <TextArea
          id="positiveReview"
          label="What was the things you liked?"
          defaultNumberOfRows={3}
          disabled={isLoading}
          register={register}
          errors={errors}
        />
        <hr />
        <TextArea
          id="negativeReview"
          label="What can we do better?"
          defaultNumberOfRows={3}
          disabled={isLoading}
          register={register}
          errors={errors}
        />
      </div>
    );
  }

  if (step === STEPS.OVERALL) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="Overall" subtitle="How would you rate us?" />
        <Input
          id="title"
          label="Sumarise your review"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <Rating
          label="Overall"
          value={overallRating}
          onChange={(value) => setValue("overallRating", value)}
          errors={errors}
          disabled={isLoading}
        />
        <hr />
        <Toggle
          id="suggestUs"
          label="Would you suggest us?"
          value={suggestUs}
          onChange={(value) => setCustomValue("suggestUs", value)}
          errors={errors}
        />
      </div>
    );
  }

  return (
    <Modal
      isOpen={reviewModal.isOpen}
      onClose={reviewModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      title="Your review"
      actionLabel={actionLabel}
      secondaryActionLabel={secondartActionLabel}
      secondaryAction={step === STEPS.RATING ? undefined : onBack}
      body={bodyContent}
    />
  );
};

export default ReviewModal;
