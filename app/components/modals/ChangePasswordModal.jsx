"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import useChangePasswordModal from "@/app/hooks/useChangePasswordModal";
import axios from "axios";

const ChangePasswordModal = () => {
  const router = useRouter();
  const changePasswordModal = useChangePasswordModal();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      oldPassword: "",
      password: "",
      repeatedPassword: "",
    },
  });

  const onSubmit = (data) => {
    setIsLoading(true);

    if (data.password !== data.repeatedPassword) {
      toast.error(
        changePasswordModal.translation.passwordsNotSame ||
          "Passwords are not the same!"
      );
      return;
    }

    axios
      .put("/api/register", data)
      .then(() => {
        toast.success(
          changePasswordModal.translation.updatedSuccessfully ||
            "Successfully updated password!"
        );
        router.refresh();
        reset();
        changePasswordModal.onClose();
      })
      .catch((error) => {
        toast.error(
          changePasswordModal.translation.updatedUnsuccessfully ||
            "Error on updating password"
        );
      })
      .finally(() => setIsLoading(false));
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title={changePasswordModal.translation.title || "Change your password"}
      />
      <Input
        id="oldPassword"
        type="password"
        label={changePasswordModal.translation.oldPassword || "Old Password"}
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        type="password"
        label={changePasswordModal.translation.newPassword || "New Password"}
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="repeatedPassword"
        type="password"
        label={
          changePasswordModal.translation.newPasswordAgain ||
          "New Password again"
        }
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
      <div className="text-neutral-500 text-center font-light">
        <div className="justify-center flex flex-row items-center gap-2">
          <div
            onClick={() => {
              toast.error("Not yet implemented!");
            }}
            className="text-neutral-500 cursor-pointer hover:underline"
          >
            {changePasswordModal.translation.forgotPassword ||
              "Forgot your password?"}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={changePasswordModal.isOpen}
      title={changePasswordModal.translation.modalTitle || "Change password"}
      actionLabel={changePasswordModal.translation.submit || "Change password"}
      onClose={changePasswordModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default ChangePasswordModal;
