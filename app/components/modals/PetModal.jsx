"use client";

import Modal from "./Modal";
import { useMemo, useState } from "react";
import Heading from "../Heading";
import { useForm } from "react-hook-form";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import ClickInput from "../inputs/ClickInput";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import usePetModal from "@/app/hooks/usePetModal";
import Radio from "../inputs/Radio";
import {
  PET_BREEDS,
  PET_DESCRIPTIONS,
  PET_TYPES,
} from "@/app/utils/PetConstants";
import Dropdown from "../inputs/Dropdown";
import ExplanationInfo from "../ExplanationInfo";

const STEPS = Object.freeze({
  BASIC: 0,
  BREED: 1,
  HEALTH: 2,
  FRIENDLY: 3,
  IMAGES: 4,
  DESCRIPTION: 5,
});

const MAX_IMAGES_FOR_PET = 3;

const PetModal = () => {
  const router = useRouter();
  const petModal = usePetModal();

  const [step, setStep] = useState(STEPS.BASIC);
  const [isLoading, setIsLoading] = useState(false);
  const [localImageSrc, setLocalImageSrc] = useState([]);
  const [breedOptions, setBreedOptions] = useState([]);
  const [breedDescriptionPlaceholder, setBreedDescriptionPlaceholder] =
    useState("");

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
      typeName: "",
      breed: "",
      description: "",
      friendly: 0,
      vaccinated: true,
      imageSrc: [],
      additionalInfo: "",
    },
  });

  const age = watch("age");
  const friendly = watch("friendly");
  const vaccinated = watch("vaccinated");
  const imageSrc = watch("imageSrc");
  const typeName = watch("typeName");
  const breed = watch("breed");

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
    if (step === STEPS.BASIC && typeName === "") {
      toast.error(
        petModal.translation.errorTypeNotSelected ||
          "Pet type must be selected!"
      );
      return;
    }
    setStep((value) => value + 1);
  };

  const uploadImages = async () => {
    if (
      !localImageSrc ||
      !Array.isArray(localImageSrc) ||
      localImageSrc.length === 0
    ) {
      toast.error(petModal.translation.noImages || "No images to upload!");
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
      toast.success(
        petModal.translation.imageUploadSuccessfully ||
          "All images uploaded successfully!"
      );
    } catch (error) {
      console.error(error);
      toast.error(
        petModal.translation.imageUploadError || "Error uploading images!"
      );
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
        toast.success(
          petModal.translation.successfullyCreated || "Successfully created!"
        );
        router.refresh();
        reset();
        setStep(STEPS.BASIC);
        petModal.onClose();
      })
      .catch(() =>
        toast.error(
          petModal.translation.someError || "Woof, woof, something went wrong!"
        )
      )
      .finally(() => setIsLoading(false));
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.DESCRIPTION) {
      return petModal.translation.submit || "Add friend";
    }

    return petModal.translation.next || "Next";
  }, [step]);

  const secondartActionLabel = useMemo(() => {
    if (step === STEPS.BASIC) {
      return undefined;
    }

    return petModal.translation.back || "Back";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title={
          petModal.translation.basicTitle || "What is the name of your pet?"
        }
        subtitle={
          petModal.translation.basicSubtitle ||
          "Give us some details about your pet!"
        }
      />
      <Input
        id="name"
        label={petModal.translation.name || "Pet name"}
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <span className="font-semibold text-neutral-500">
        {petModal.translation.labelType || "Pet type"}
      </span>
      {PET_TYPES.map((item) => (
        <div key={item.label} className="col-span-1">
          <ClickInput
            onClick={(type) => {
              setCustomValue("typeName", type);
              setBreedOptions(PET_BREEDS[type]?.breeds || []);
            }}
            selected={typeName === item.label}
            label={item.label}
            value={item.label}
            icon={item.icon}
            tooltip={item.description}
          />
        </div>
      ))}
      <Input
        id="birth"
        label={petModal.translation.petBirth || "Pet birth"}
        disabled={isLoading}
        register={register}
        errors={errors}
        type="month"
        required
      />
    </div>
  );

  const changeBreed = (value) => {
    setCustomValue("breed", value);
    const breedDescriptionPh = PET_DESCRIPTIONS[value] || "Breed Description";
    setBreedDescriptionPlaceholder(breedDescriptionPh);
  };

  if (step === STEPS.BREED) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title={petModal.translation.breedTitle || "Pet breed"}
          subtitle={
            petModal.translation.breedSubtitle ||
            "Let the object owner breed of your pet"
          }
        />
        <div className="flex flex-row gap-4 items-center">
          <Dropdown
            id="breed"
            label={petModal.translation.breed || "Breed"}
            placeholder={
              petModal.translation.breedPlaceholder || "Choose breed"
            }
            register={register}
            errors={errors}
            required
            options={breedOptions}
            onChange={(value) => changeBreed(value)}
          />
          <ExplanationInfo
            text={
              petModal.translation.breedExplanation ||
              "If the breed of your pet is not on the list, input it manually."
            }
          />
        </div>
        {breed !== "" && (
          <div className="flex flex-row gap-4 items-center">
            <Input
              id="description"
              label={petModal.translation.breedDescription || "Pet description"}
              placeholder={breedDescriptionPlaceholder}
              register={register}
            />
            <ExplanationInfo
              text={
                petModal.translation.breedDescriptionExplanation ||
                "Optional (one or two sentence) description of your pet. What it likes, how it behaves with strangers etc."
              }
            />
          </div>
        )}
      </div>
    );
  }

  if (step === STEPS.HEALTH) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title={petModal.translation.healthTitle || "Health"}
          subtitle={
            petModal.translation.healthSubtitle || "Is your pet vaccinated?"
          }
        />
        <Radio
          options={[
            { label: petModal.translation.yes || "Yes", value: true },
            { label: petModal.translation.no || "No", value: false },
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
          title={
            petModal.translation.friendlyTitle ||
            "How is your pet with strangers"
          }
          subtitle={
            petModal.translation.friendlySubtitle ||
            "Help us understand best way to take care of your pet"
          }
        />
        <Radio
          options={[
            {
              label: petModal.translation.friendlyOption || "Friendly",
              value: 0,
            },
            {
              label:
                petModal.translation.notSoFriendlyOption || "Not so friendly",
              value: 1,
            },
            {
              label: petModal.translation.scaredOption || "Scared",
              value: 2,
            },
            {
              label:
                petModal.translation.canBiteOption || "Can bite in some cases",
              value: 3,
            },
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
          title={
            petModal.translation.photosTitle || "Add some photos of your pet"
          }
          subtitle={
            petModal.translation.photosSubtitle ||
            "Beautify this page with a photo of your friend"
          }
        />
        <ImageUpload
          value={imageSrc}
          onChange={(value) => setLocalImageSrc(value)}
          maxImages={MAX_IMAGES_FOR_PET}
          translation={petModal.translation.ImageUpload}
        />
      </div>
    );
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title={
            petModal.translation.descriptionTitle || "Give us some more info"
          }
          subtitle={
            petModal.translation.descriptionSubtitle ||
            "Anything you think we forgot and is important to know"
          }
        />
        <Input
          id="additionalInfo"
          label={petModal.translation.descriptionInput || "Description"}
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
      title={petModal.translation.title || "Add my pet"}
      actionLabel={actionLabel}
      secondaryActionLabel={secondartActionLabel}
      secondaryAction={step === STEPS.BASIC ? undefined : onBack}
      body={bodyContent}
    />
  );
};

export default PetModal;
