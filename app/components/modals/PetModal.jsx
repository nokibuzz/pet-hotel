"use client";

import Modal from "./Modal";
import { useMemo, useState } from "react";
import Heading from "../Heading";
import { useForm } from "react-hook-form";
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

const MAX_IMAGES_FOR_PET = 7;

const PetModal = () => {
  const router = useRouter();
  const petModal = usePetModal();

  const [step, setStep] = useState(STEPS.BASIC);
  const [isLoading, setIsLoading] = useState(false);
  const [localImageSrc, setLocalImageSrc] = useState([]);

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
      imageSrc: [],
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

  const uploadImages = async () => {
    if (
      !localImageSrc ||
      !Array.isArray(localImageSrc) ||
      localImageSrc.length === 0
    ) {
      toast.error("No images to upload!");
      return;
    }

    try {
      const uploaded = [];
      for (const localImage of localImageSrc) {
        // Convert Blob URL to File
        const response = await fetch(localImage);
        const blob = await response.blob();
        const file = new File([blob], "image.jpg", { type: blob.type });

        // Upload to Cloudinary
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "oqa81fsw");

        const uploadResponse = await fetch(
          "https://api.cloudinary.com/v1_1/dyjrsi5h4/image/upload",
          { method: "POST", body: formData }
        );

        if (!uploadResponse.ok) {
          throw new Error("Image upload failed");
        }

        const data = await uploadResponse.json();
        uploaded.push(data.secure_url);
      }

      setCustomValue("imageSrc", uploaded);
      toast.success("All images uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error uploading images!");
    }
  };

  const onSubmit = (data) => {
    if (step == STEPS.IMAGES) {
      if (
        !localImageSrc ||
        !Array.isArray(localImageSrc) ||
        localImageSrc.length === 0
      ) {
        return;
      }

      uploadImages()
        .then((response) => {
          console.log("Uploaded successfully");
        })
        .catch((e) => console.error("Woof, woof, images not uploaded!", e));
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
          onChange={(value) => setLocalImageSrc(value)}
          maxImages={MAX_IMAGES_FOR_PET}
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
