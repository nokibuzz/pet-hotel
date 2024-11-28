"use client";

import useRentModal from "@/app/hooks/useRentModal";
import Modal from "./Modal";
import { useMemo, useState } from "react";
import Heading from "../Heading";
import { categories } from "../navbar/Categories";
import CategoryInput from "../inputs/CategoryInput";
import { useForm } from "react-hook-form";
import CountrySelect from "../inputs/CountrySelect";
import dynamic from "next/dynamic";
import Counter from "../inputs/Counter";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import usePetModal from "@/app/hooks/usePetModal";
import Radio from "../inputs/Radio";

const STEPS = Object.freeze({
  BASIC: 0,
  HEALTH: 1,
  FRIENDLY: 2,
  IMAGES: 3,
  DESCRIPTION: 4,
});

const PetModal = () => {
  const router = useRouter();
  const petModal = usePetModal();

  const [step, setStep] = useState(STEPS.BASIC);
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
      name: "",
      breed: "",
      age: 0,
      friendly: true,
      vaccinated: true,
      imageSrc: "",
      description: "",
    },
  });

  const age = watch("age");
  const friendly = watch("friendly");
  const vaccinated = watch("vaccinated");
  const imageSrc = watch("imageSrc");

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
    if (step == STEPS.IMAGES) {
      if (!data.imageSrc) {
        return;
      }
    }

    if (step !== STEPS.DESCRIPTION) {
      return onNext();
    }

    setIsLoading(true);

    axios
      .post("/api/pets", data)
      .then(() => {
        toast.success("Successfully created!");
        router.refresh();
        reset();
        setStep(STEPS.BASIC);
        petModal.onClose();
      })
      .catch(() => toast.error("Woof, woof, something went wrong!"))
      .finally(() => setIsLoading(false));
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.DESCRIPTION) {
      return "Add friend";
    }

    return "Next";
  }, [step]);

  const secondartActionLabel = useMemo(() => {
    if (step === STEPS.BASIC) {
      return undefined;
    }

    return "Back";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="What is the name of your pet?"
        subtitle="Give us some details about your pet!"
      />
      <Input
        id="name"
        label="Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <hr />
      <Input
        id="breed"
        label="Breed"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <hr />
      <Counter
        title="Age"
        subtitle="Tell us how many years your pet is celebrating?"
        value={age}
        onChange={(value) => setCustomValue("age", value)}
      />
    </div>
  );

  if (step === STEPS.HEALTH) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="How about health?" subtitle="Is your pet vaccinated?" />
        <Radio
          options={[
            { label: "Yes", value: true },
            { label: "No", value: false },
          ]}
          value={vaccinated}
          onChange={(value) => setCustomValue("vaccinated", value)}
        />
      </div>
    );
  }

  if (step === STEPS.FRIENDLY) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="How is your pet with strangers"
          subtitle="Help us understand best way to play with your dog"
        />
        <Radio
          options={[
            { label: "Yes", value: true },
            { label: "No", value: false },
          ]}
          value={friendly}
          onChange={(value) => setCustomValue("friendly", value)}
        />
      </div>
    );
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Add photos of your pet"
          subtitle="Beautify this page with a photo of your friend!"
        />
        <ImageUpload
          value={imageSrc}
          onChange={(value) => setCustomValue("imageSrc", value)}
        />
      </div>
    );
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Give us some more info"
          subtitle="Anything you think we forgot and is important to know!"
        />
        <Input
          id="description"
          label="Description"
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
      isOpen={petModal.isOpen}
      onClose={petModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      title="Add my pet"
      actionLabel={actionLabel}
      secondaryActionLabel={secondartActionLabel}
      secondaryAction={step === STEPS.BASIC ? undefined : onBack}
      body={bodyContent}
    />
  );
};

export default PetModal;
