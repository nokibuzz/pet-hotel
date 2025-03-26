"use client";

import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import toast from "react-hot-toast";
import Button from "../Button";
import useLoginModal from "@/app/hooks/useLoginModal";
import Toggle from "../inputs/Toggle";
import { signIn } from "next-auth/react";
import sendEmail from "@/app/utils/sendEmail";

const RegisterModal = () => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      businessName: "",
      hotelOwner: false,
    },
  });

  const email = watch("email");
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
      .post("/api/register", data)
      .then(() => {
        toast.success(
          registerModal.translation.RegisterModal?.successfullyRegistrated ||
            "Successfully registered!"
        );
        registerModal.onClose();
        sendEmail.sendRegistrationVerificationMail(email);
        // loginModal.onOpen();
        // TODO: redirect to go to your email address
      })
      .catch(() =>
        toast.error(
          registerModal.translation.RegisterModal?.registrationError ||
            "Woof, woof, something went wrong on registration!"
        )
      )
      .finally(() => setIsLoading(false));
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title={
          registerModal.translation.RegisterModal?.title ||
          "Welcome to Hotels for dogs"
        }
        subtitle={
          registerModal.translation.RegisterModal?.subtitle ||
          "Create an account!"
        }
        rightComponent={
          <Toggle
            id="hotelOwner"
            label={
              registerModal.translation.RegisterModal?.registerHotel ||
              "I'm an owner"
            }
            value={hotelOwner}
            onChange={(value) => setCustomValue("hotelOwner", value)}
            col={true}
            errors={errors}
          />
        }
      />
      <Input
        id="email"
        label={registerModal.translation.RegisterModal?.email || "Email"}
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="name"
        label={registerModal.translation.RegisterModal?.name || "Name"}
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      {hotelOwner && (
        <Input
          id="businessName"
          label={
            registerModal.translation.RegisterModal?.businessName ||
            "Business Name"
          }
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      )}
      <Input
        id="password"
        type="password"
        label={registerModal.translation.RegisterModal?.password || "Password"}
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <Button
        outline
        label={
          registerModal.translation.RegisterModal?.continueWithGoogle ||
          "Continue with Google"
        }
        icon={FcGoogle}
        onClick={() => {
          signIn("google");
        }}
      />
      <div className="text-neutral-500 text-center mt-4 font-light">
        <div className="justify-center flex flex-row items-center gap-2">
          <div>
            {registerModal.translation.RegisterModal?.alreadyHaveAccount ||
              "Already have an account?"}
          </div>
          <div
            onClick={() => {
              registerModal.onClose();
              loginModal.onOpen();
            }}
            className="text-neutral-500 cursor-pointer hover:underline"
          >
            {registerModal.translation.RegisterModal?.login || "Log In"}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title={registerModal.translation.RegisterModal?.modalTitle || "Register"}
      actionLabel={
        registerModal.translation.RegisterModal?.submit || "Continue"
      }
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default RegisterModal;
