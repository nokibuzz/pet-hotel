"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useLoginModal from "@/app/hooks/useLoginModal";
import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import toast from "react-hot-toast";
import Button from "../Button";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import { useRouter } from "next/navigation";

const LoginModal = () => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    setIsLoading(true);

    signIn("credentials", {
      ...data,
      redirect: false,
    }).then((callback) => {
      setIsLoading(false);

      if (callback?.ok) {
        toast.success(
          loginModal.translation.LoginModal?.successfullyLoggedIn ||
            "Successfully logged in"
        );
        router.refresh();
        loginModal.onClose();
      }

      if (callback?.error) {
        toast.error(callback.error);
      }
    });
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title={
          loginModal.translation.LoginModal?.title ||
          "Welcome back to Hotels for dogs"
        }
        subtitle={
          loginModal.translation.LoginModal?.subtitle ||
          "Login to your account!"
        }
      />
      <Input
        id="email"
        label={loginModal.translation.LoginModal?.email || "Email"}
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        type="password"
        label={loginModal.translation.LoginModal?.password || "Password"}
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
          loginModal.translation.LoginModal?.continueWithGoogle ||
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
            {loginModal.translation.LoginModal?.dontHaveAccount ||
              "Don't have an account?"}
          </div>
          <div
            onClick={() => {
              loginModal.onClose();
              registerModal.onOpen(translation);
            }}
            className="text-neutral-500 cursor-pointer hover:underline"
          >
            {loginModal.translation.LoginModal?.createOne || "Create one"}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="Login"
      actionLabel="Continue"
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default LoginModal;
