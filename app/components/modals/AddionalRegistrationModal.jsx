"use client";

import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useAddionalRegistrationModal from "@/app/hooks/useAddionalRegistrationModal";
import Modal from "./Modal";
import Input from "../inputs/Input";
import toast from "react-hot-toast";
import Toggle from "../inputs/Toggle";
import { useRouter } from "next/navigation";

const AddionalRegistrationModal = ({translations}) => {
  const addionalRegistrationModal = useAddionalRegistrationModal();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      businessName: "",
      hotelOwner: false,
    },
  });

  const hotelOwner = watch("hotelOwner");

  const setCustomValue = (id, value) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const onSubmit = (data) => {
    setIsLoading(true);

    axios
      .patch("/api/register", data)
      .then(() => {
        toast.success(
          translations?.successfullyRegistrated ||
            "Successfully registered!"
        );
        addionalRegistrationModal.onClose();
        router.refresh();
      })
      .catch(() =>
        toast.error(
          translations?.registrationError ||
            "Woof, woof, something went wrong on registration!"
        )
      )
      .finally(() => setIsLoading(false));
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Toggle
        id="hotelOwner"
        label={
          translations?.businessAccount ||
          "Business account"
        }
        value={hotelOwner}
        onChange={(value) => setCustomValue("hotelOwner", value)}
        errors={errors}
      />
      {hotelOwner && (
        <Input
          id="businessName"
          label={
            translations?.businessName ||
            "Business Name"
          }
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      )}
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={addionalRegistrationModal.isOpen}
      title={translations?.modalTitle || "Welcome to Hotels for dogs"}
      actionLabel={
        translations?.submit || "Complete your account"
      }
      onClose={addionalRegistrationModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
    />
  );
};

export default AddionalRegistrationModal;
