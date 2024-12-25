"use client";

import useRentModal from "@/app/hooks/useRentModal";
import Modal from "./Modal";
import { useMemo, useState, useEffect } from "react";
import Heading from "../Heading";
import { options } from "../navbar/BasicFilters";
import CategoryInput from "../inputs/CategoryInput";
import { useForm } from "react-hook-form";
import Counter from "../inputs/Counter";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import TextArea from "../inputs/TextArea";
import Dropdown from "../inputs/Dropdown";
import Toggle from "../inputs/Toggle";
import MapSelect from "../MapSelect";

const STEPS = Object.freeze({
  CATEGORY: 0,
  LOCATION: 1,
  INFO: 2,
  IMAGES: 3,
  DESCRIPTION: 4,
  HOUSE_RULES: 5,
  ADDIONAL_OPTIONS: 6,
  PRICE: 7,
});

const MAX_IMAGES_FOR_RENT = 10;

const RentModal = ({ currentUser }) => {
  const router = useRouter();
  const rentModal = useRentModal();

  const [step, setStep] = useState(STEPS.CATEGORY);
  const [isLoading, setIsLoading] = useState(false);
  const [localImageSrc, setLocalImageSrc] = useState([]);
  const [imagesUploaded, setImagesUploaded] = useState(false);
  const [guestChanged, setGuestChanged] = useState(false);
  const [priceChanged, setPriceChanged] = useState(false);

  const hours = Array.from({ length: 24 }, (_, index) =>
    index < 10 ? `0${index}:00` : `${index}:00`
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      category: "",
      guestCount: 1,
      imageSrc: [],
      price: 1,
      title: "",
      description: "",
      checkInTime: "12:00",
      checkOutTime: "12:00",
      hasCancelation: false,
      allowBooking: true,
      paymentMethodsCards: true,
      paymentMethodsCash: true,
      hasFood: false,
      hasGrooming: false,
      hasVet: false,
      addionalInformation: "",
      locationLongitude: "",
      locationLatitude: "",
      addressLabel: "",
    },
  });

  // cause we have customer categoryInput, we need to check if the category value is valid
  const title = watch("title");
  const description = watch("description");
  const category = watch("category");
  const guestCount = watch("guestCount");
  const price = watch("price");
  const imageSrc = watch("imageSrc");
  const checkInTime = watch("checkInTime");
  const checkOutTime = watch("checkOutTime");
  const hasCancelation = watch("hasCancelation");
  const allowBooking = watch("allowBooking");
  const paymentMethodsCards = watch("paymentMethodsCards");
  const paymentMethodsCash = watch("paymentMethodsCash");
  const hasFood = watch("hasFood");
  const hasGrooming = watch("hasGrooming");
  const hasVet = watch("hasVet");
  const addionalInformation = watch("addionalInformation");
  const locationLongitude = watch("locationLongitude");
  const locationLatitude = watch("locationLatitude");

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
      setImagesUploaded(false);
      if (
        !localImageSrc ||
        !Array.isArray(localImageSrc) ||
        localImageSrc.length === 0
      ) {
        // no update images on edit
        if (rentModal.isEdit) {
          return onNext();
        }

        return;
      }

      uploadImages()
        .then((response) => {
          setImagesUploaded(true);
        })
        .catch((e) => console.error("Woof, woof, images not uploaded!", e));
    }

    if (step !== STEPS.PRICE) {
      return onNext();
    }

    setIsLoading(true);
    setLocalImageSrc([]);

    if (rentModal.isEdit) {
      const updatedData = { ...data, id: rentModal.listing.id };
      axios
        .put("/api/listing", updatedData)
        .then(() => {
          toast.success("Successfully updated!");
          router.refresh();
          // Resetting form, from react-form-hook library
          reset();
          setStep(STEPS.CATEGORY);
          rentModal.onClose();
        })
        .catch(() => toast.error("Something went wrong!"))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
      axios
        .post("/api/listing", data)
        .then(() => {
          toast.success("Successfully created!");
          router.refresh();
          // reseting form, from react-form-hook library
          reset();
          setStep(STEPS.CATEGORY);
          rentModal.onClose();
        })
        .catch(() => toast.error("Something went wrong!"))
        .finally(() => setIsLoading(false));
    }
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.PRICE) {
      return rentModal.isEdit ? "Update" : "Create";
    }

    return "Next";
  }, [step]);

  const secondartActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined;
    }

    return "Back";
  }, [step]);

  // for edit modal, prepopulate values
  useEffect(() => {
    if (rentModal.listing?.title && !title) {
      setCustomValue("title", rentModal.listing.title);
    }
    if (rentModal.listing?.description && !description) {
      setCustomValue("description", rentModal.listing.description);
    }
    if (rentModal.listing?.category && !category) {
      setCustomValue("category", rentModal.listing.category);
    }
    if (rentModal.listing?.checkInTime && !checkInTime) {
      setCustomValue("checkInTime", rentModal.listing.checkInTime);
    }
    if (rentModal.listing?.checkOutTime && !checkOutTime) {
      setCustomValue("checkOutTime", rentModal.listing.checkOutTime);
    }
    if (rentModal.listing?.location?.coordinates && !locationLongitude) {
      setCustomValue(
        "locationLongitude",
        rentModal.listing.location.coordinates?.[0]
      );
    }
    if (rentModal.listing?.location?.coordinates && !locationLatitude) {
      setCustomValue(
        "locationLatitude",
        rentModal.listing.location.coordinates?.[1]
      );
    }
    if (
      rentModal.listing?.guestCount &&
      guestCount !== rentModal.listing.guestCount &&
      !guestChanged
    ) {
      setGuestChanged(true);
      setCustomValue("guestCount", rentModal.listing.guestCount);
    }
    if (
      rentModal.listing?.price &&
      price !== rentModal.listing.price &&
      !priceChanged
    ) {
      setPriceChanged(true);
      setCustomValue("price", rentModal.listing.price);
    }
    if (Array.isArray(rentModal.listing?.imageSrc) && imageSrc.length === 0) {
      setCustomValue("imageSrc", rentModal.listing.imageSrc);
    }
    if (rentModal.listing?.addionalInformation && !addionalInformation) {
      setCustomValue(
        "addionalInformation",
        rentModal.listing.addionalInformation
      );
    }
  }, [
    rentModal.listing,
    title,
    description,
    category,
    checkInTime,
    checkOutTime,
    locationLatitude,
    locationLongitude,
    guestCount,
    imageSrc,
    addionalInformation,
    setCustomValue,
  ]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Which of these best describe you pet care?"
        subtitle="Pick one"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
        {options.map((item) => (
          <div key={item.label} className="col-span-1">
            <CategoryInput
              onClick={(category) => {
                setCustomValue("category", category);
              }}
              selected={category === item.label}
              label={item.label}
              icon={item.icon}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const onLocationSelect = (event) => {
    const { location, addressLabel } = event;
    setCustomValue("locationLongitude", location.longitude);
    setCustomValue("locationLatitude", location.latitude);
    setCustomValue("addressLabel", addressLabel);
  };

  if (step === STEPS.LOCATION) {
    const defaultCoordinates = currentUser?.defaultLocation ?? {
      latitude: locationLatitude,
      longitude: locationLongitude,
    };

    bodyContent = (
      <MapSelect
        title="Where is your pet house located?"
        subtitle="Help dog lovers find you"
        defaultCoordinates={defaultCoordinates}
        onSelect={(location) => onLocationSelect(location)}
      />
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="What are your capacity"
          subtitle="How many pets can you take care of"
        />
        <Counter
          title="Pets"
          subtitle="How many pets you can take?"
          value={guestCount}
          onChange={(value) => setCustomValue("guestCount", value)}
        />
      </div>
    );
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-4">
        <Heading
          title="Add photos of your home/hotel"
          subtitle="Let owners know how your pet care looks like"
        />
        <ImageUpload
          value={imageSrc}
          onChange={(value) => setLocalImageSrc(value)}
          maxImages={MAX_IMAGES_FOR_RENT}
        />
      </div>
    );
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Describe your object"
          subtitle="Simple explanation works the best"
        />
        <Input
          id="title"
          label="Title"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <TextArea
          id="description"
          label="Description"
          defaultNumberOfRows={5}
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  if (step === STEPS.HOUSE_RULES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="House rules"
          subtitle="House rules are a set of guidelines or regulations that outline expected behaviors, responsibilities, and standards within a specific property or environment to ensure a respectful, safe, and harmonious experience for all occupants or visitors."
        />

        <div className="flex flex-row gap-4">
          <Dropdown
            id="checkInTime"
            label={category === "Petgarten" ? "Earliest pet stay" : "Check-In"}
            placeholder="Select time..."
            onChange={(value) => setCustomValue("checkInTime", value)}
            options={hours}
            register={register}
            errors={errors}
            required
            defaultValue={"12:00"}
          />
          <Dropdown
            id="checkOutTime"
            label={
              category === "Petgarten" ? "Leatest pet pick up" : "Check-In"
            }
            placeholder="Select time..."
            onChange={(value) => setCustomValue("checkOutTime", value)}
            options={hours}
            register={register}
            errors={errors}
            required
            defaultValue={"12:00"}
          />
        </div>
        <hr />
        {category !== "Petgarten" && (
          <>
            <div className="flex flex-row gap-4">
              <Toggle
                id="hasCancelation"
                label="Has cancelation policy"
                value={hasCancelation}
                onChange={(value) => setCustomValue("hasCancelation", value)}
                errors={errors}
              />
              <Toggle
                id="allowBooking"
                label="Allow booking"
                value={allowBooking}
                onChange={(value) => setCustomValue("allowBooking", value)}
                errors={errors}
              />
            </div>
            <hr />
          </>
        )}
        <div className="flex flex-row gap-4">
          <Toggle
            id="paymentMethodsCards"
            label="Accept cards"
            value={paymentMethodsCards}
            onChange={(value) => setCustomValue("paymentMethodsCards", value)}
            errors={errors}
          />
          <Toggle
            id="paymentMethodsCash"
            label="Accept cash"
            value={paymentMethodsCash}
            onChange={(value) => setCustomValue("paymentMethodsCash", value)}
            errors={errors}
          />
        </div>
      </div>
    );
  }

  if (step === STEPS.ADDIONAL_OPTIONS) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Addional options"
          subtitle="Extra customizable services or amenities for pets, such as grooming, feeding, and extended care, enhancing the overall experience and comfort during stay."
        />
        <Toggle
          id="hasFood"
          label="Has food option (alergies)"
          value={hasFood}
          onChange={(value) => setCustomValue("hasFood", value)}
          errors={errors}
        />
        <Toggle
          id="hasGrooming"
          label="Has grooming"
          value={hasGrooming}
          onChange={(value) => setCustomValue("hasGrooming", value)}
          errors={errors}
        />
        <Toggle
          id="hasVet"
          label="Has veterinarian"
          value={hasVet}
          onChange={(value) => setCustomValue("hasVet", value)}
          errors={errors}
        />
        <hr />
        <div className="flex flex-row gap-4">
          <TextArea
            id="addionalInformation"
            label="Addional information"
            defaultNumberOfRows={2}
            disabled={isLoading}
            register={register}
            errors={errors}
          />
        </div>
      </div>
    );
  }

  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="Price" subtitle="How much would it cost per night?" />
        <Input
          id="price"
          label="Price"
          formatPrice
          type="number"
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
      isOpen={rentModal.isOpen}
      onClose={() => {
        reset();
        setStep(STEPS.CATEGORY);
        rentModal.onClose();
      }}
      onSubmit={handleSubmit(onSubmit)}
      title={rentModal.isEdit ? "Edit property" : "Add property"}
      actionLabel={actionLabel}
      secondaryActionLabel={secondartActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      body={bodyContent}
    />
  );
};

export default RentModal;
