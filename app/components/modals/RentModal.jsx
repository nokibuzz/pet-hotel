"use client";

import useRentModal from "@/app/hooks/useRentModal";
import Modal from "./Modal";
import { useMemo, useState, useEffect } from "react";
import Heading from "../Heading";
import { options } from "../navbar/BasicFilters";
import { petTypes } from "../PetTypes";
import CategoryInput from "../inputs/CategoryInput";
import { useForm } from "react-hook-form";
import InputWithSeparateLabel from "../inputs/InputWithSeparateLabel";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import TextArea from "../inputs/TextArea";
import Dropdown from "../inputs/Dropdown";
import Toggle from "../inputs/Toggle";
import MapSelect from "../MapSelect";
import CustomInput from "../inputs/CustomInput";
import { faOtter } from "@fortawesome/free-solid-svg-icons";

const STEPS = Object.freeze({
  CATEGORY: 0,
  LOCATION: 1,
  PET_TYPES: 2,
  INFO: 3,
  PRICE: 4,
  IMAGES: 5,
  DESCRIPTION: 6,
  HOUSE_RULES: 7,
  ADDIONAL_OPTIONS: 8,
});

const MAX_IMAGES_FOR_RENT = 10;

const RentModal = ({ currentUser }) => {
  const router = useRouter();
  const rentModal = useRentModal();

  const [step, setStep] = useState(STEPS.CATEGORY);
  const [isLoading, setIsLoading] = useState(false);
  const [localImageSrc, setLocalImageSrc] = useState([]);

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
      totalPlaces: 0,
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
      capacityType: "",
      types: [],
    },
  });

  // cause we have customer categoryInput, we need to check if the category value is valid
  const title = watch("title");
  const description = watch("description");
  const category = watch("category");
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
  const capacityType = watch("capacityType");
  const totalPlaces = watch("totalPlaces");
  const types = watch("types");

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
    if (step === STEPS.CATEGORY && category === "") {
      toast.error(
        rentModal.translation?.errorCategoryNotSelected ||
          "Category should be selected!"
      );
      return;
    }
    if (
      step === STEPS.LOCATION &&
      locationLongitude === "" &&
      locationLatitude === ""
    ) {
      toast.error(
        rentModal.translation?.errorLocationNotSelected ||
          "Location should be selected!"
      );
      return;
    }
    if (step === STEPS.INFO) {
      if (totalPlaces === 0) {
        toast.error(
          rentModal.translation?.errorCapacityNotSelected ||
            "Capacity should be entered!"
        );
        return;
      }
    }
    setStep((value) => value + 1);
  };

  const uploadImages = async () => {
    if (
      !localImageSrc ||
      !Array.isArray(localImageSrc) ||
      localImageSrc.length === 0
    ) {
      toast.error(
        rentModal.translation?.errorNoImagesToUpload || "No images to upload!"
      );
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
        rentModal.translation?.imagesUploadedSuccessfully ||
          "All images uploaded successfully!"
      );
    } catch (error) {
      console.error(error);
      toast.error(
        rentModal.translation?.errorImagesNotUploaded ||
          "Error uploading images!"
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
        // no update images on edit
        if (rentModal.isEdit) {
          return onNext();
        }

        return;
      }

      uploadImages()
        .then((response) => {})
        .catch((e) => console.error("Woof, woof, images not uploaded!", e));
    }

    if (step === STEPS.PET_TYPES) {
      setCustomValue(
        "capacityType",
        petTypesSupported.length === 1 && petTypesSupported[0]?.name === "TOTAL"
          ? "TOTAL"
          : "ADVANCED"
      );

      if (rentModal.isEdit) {
        return onNext();
      }
    }

    if (step !== STEPS.ADDIONAL_OPTIONS) {
      return onNext();
    }

    setIsLoading(true);
    setLocalImageSrc([]);
    setPetTypesSupported([]);

    if (rentModal.isEdit) {
      const updatedData = { ...data, id: rentModal.listing.id };
      axios
        .put("/api/listing", updatedData)
        .then(() => {
          toast.success(
            rentModal.translation?.successfullyUpdated ||
              "Successfully updated!"
          );
          router.refresh();
          // Resetting form, from react-form-hook library
          reset();
          setStep(STEPS.CATEGORY);
          rentModal.onClose();
        })
        .catch(() =>
          toast.error(rentModal.translation?.error || "Something went wrong!")
        )
        .finally(() => setIsLoading(false));
    } else {
      axios
        .post("/api/listing", data)
        .then(() => {
          toast.success(
            rentModal.translation?.successfullyCreated ||
              "Successfully created!"
          );
          router.refresh();
          // reseting form, from react-form-hook library
          reset();
          setStep(STEPS.CATEGORY);
          rentModal.onClose();
        })
        .catch(() =>
          toast.error(rentModal.translation?.error || "Something went wrong!")
        )
        .finally(() => setIsLoading(false));
    }
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.ADDIONAL_OPTIONS) {
      return rentModal.isEdit
        ? rentModal.translation?.submitUpdate || "Update"
        : rentModal.translation?.submitCreate || "Create";
    }

    return rentModal.translation?.next || "Next";
  }, [step]);

  const secondartActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined;
    }

    return rentModal.translation?.back || "Back";
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
    if (Array.isArray(rentModal.listing?.imageSrc) && imageSrc.length === 0) {
      setCustomValue("imageSrc", rentModal.listing.imageSrc);
    }
    if (rentModal.listing?.addionalInformation && !addionalInformation) {
      setCustomValue(
        "addionalInformation",
        rentModal.listing.addionalInformation
      );
    }
    if (rentModal.listing?.capacityType && !capacityType) {
      const capType = rentModal.listing.capacityType;
      setCustomValue("capacityType", capType);

      if (rentModal?.listing?.types?.length) {
        const types = rentModal.listing.types.map((type) => ({
          id: type.id,
          name: type.name,
          capacity: type.capacity,
          defaultPrice: type.defaultPrice,
          weekendPrice: type.weekendPrice,
        }));

        setCustomValue("types", types);
        setPetTypesSupported(types);
        setCustomValue("totalPlaces", rentModal.listing?.totalPlaces);
      }
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
    imageSrc,
    addionalInformation,
    capacityType,
    setCustomValue,
  ]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title={
          rentModal.translation?.categoryTitle ||
          "Which of these best describe you pet care?"
        }
        subtitle={rentModal.translation?.categorySubtitle || "Pick one"}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
        {options.map((item) => (
          <div key={item.label} className="col-span-1">
            <CategoryInput
              onClick={(category) => {
                setCustomValue("category", category);
              }}
              selected={category === item.label}
              label={rentModal.translation?.[item.label] || item.label}
              value={item.label}
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
        title={
          rentModal.translation?.locationTitle ||
          "Where is your pet house located?"
        }
        subtitle={
          rentModal.translation?.locationSubtitle || "Help dog lovers find you"
        }
        defaultCoordinates={defaultCoordinates}
        onSelect={(location) => onLocationSelect(location)}
      />
    );
  }

  const handleTypeChange = (index, field, value) => {
    if (value !== null && value !== undefined && value !== "") {
      value = parseInt(value);
    }
    const updatedTypes = [...petTypesSupported];
    updatedTypes[index][field] = value;
    setPetTypesSupported(updatedTypes);
    setCustomValue("types", updatedTypes);

    calculateTotalCapacity(updatedTypes);
  };

  const calculateTotalCapacity = (types) => {
    const totalPlaces = types.reduce(
      (total, item) => total + (item.capacity || 0),
      0
    );
    setCustomValue("totalPlaces", totalPlaces);
  };

  const [petTypesSupported, setPetTypesSupported] = useState([]);

  const updatePetTypes = (typeName) => {
    setPetTypesSupported(
      (prevSelected) =>
        prevSelected.some((item) => item.name === typeName)
          ? prevSelected.filter((item) => item.name !== typeName) // Remove item by name
          : [...prevSelected, { name: typeName, capacity: 1 }] // Add new item
    );
  };

  if (step === STEPS.PET_TYPES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title={"Choose type of your pet?"} subtitle={"Pick one"} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
          <div className="col-span-1">
            <CategoryInput
              onClick={() => {
                setPetTypesSupported([{ name: "TOTAL", capacity: 1 }]);
              }}
              selected={
                petTypesSupported.length === 1 &&
                petTypesSupported[0]?.name === "TOTAL"
              }
              label="All Pets"
              value="TOTAL"
              icon={faOtter}
            />
          </div>
          {petTypes.map((item) => (
            <div key={item.label} className="col-span-1">
              <CategoryInput
                onClick={(type) => {
                  updatePetTypes(type);
                }}
                selected={petTypesSupported.some(
                  (selectedItem) => selectedItem.name === item.label
                )}
                label={item.label}
                value={item.label}
                icon={item.icon}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title={
            rentModal.translation?.capacityTitle || "What are your capacity"
          }
          subtitle={
            rentModal.translation?.capacitySubtitle ||
            "How many pets can you take care of"
          }
        />

        {/* {petTypesSupported.length === 1 &&
          petTypesSupported[0]?.name === "TOTAL" && (
            <InputWithSeparateLabel
              title={rentModal.translation?.petsCounterTitle || "Pets"}
              subtitle={
                rentModal.translation?.petCounterSubtitle ||
                "How many pets you can take in your object?"
              }
              value={totalPlaces}
              onChange={(e) => {
                let value = e.target.value;
                if (value !== null && value !== undefined && value !== "") {
                  value = parseInt(value);
                }
                setCustomValue("totalPlaces", value);
              }}
            />
          )} */}

        {petTypesSupported.length > 0 && (
          <div className="flex flex-col gap-4">
            {petTypesSupported.map((type, index) => (
              <div key={index} className="flex items-center gap-4">
                <InputWithSeparateLabel
                  title={type.name}
                  subtitle="Pets of type"
                  value={type.capacity}
                  onChange={(e) =>
                    handleTypeChange(index, "capacity", e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-4">
        <Heading
          title={
            rentModal.translation?.imagesTitle ||
            "Add photos of your home/hotel"
          }
          subtitle={
            rentModal.translation?.imagesSubtitle ||
            "Let owners know how your pet care looks like"
          }
        />
        <ImageUpload
          value={imageSrc}
          onChange={(value) => setLocalImageSrc(value)}
          maxImages={MAX_IMAGES_FOR_RENT}
          translation={rentModal.translation?.ImageUpload}
        />
      </div>
    );
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title={
            rentModal.translation?.descriptionTitle || "Describe your object"
          }
          subtitle={
            rentModal.translation?.descriptionSubtitle ||
            "Simple explanation works the best"
          }
        />
        <Input
          id="title"
          label={rentModal.translation?.descriptionInputTitle || "Title"}
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <TextArea
          id="description"
          label={
            rentModal.translation?.descriptionInputDescription || "Description"
          }
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
          title={rentModal.translation?.houseRulesTitle || "House rules"}
          subtitle={
            rentModal.translation?.houseRulesSubtitle ||
            "House rules are a set of guidelines or regulations that outline expected behaviors, responsibilities, and standards within a specific property or environment to ensure a respectful, safe, and harmonious experience for all occupants or visitors."
          }
        />

        <div className="flex flex-row gap-4">
          <Dropdown
            id="checkInTime"
            label={
              category === "Petgarten"
                ? rentModal.translation?.houseRulesChechInPetgarden ||
                  "Earliest pet stay"
                : rentModal.translation?.houseRulesChechIn || "Check-In"
            }
            placeholder={
              rentModal.translation?.houseRulesChechInPlaceholder ||
              "Select time..."
            }
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
              category === "Petgarten"
                ? rentModal.translation?.houseRulesChechOutPetgarden ||
                  "Leatest pet pick up"
                : rentModal.translation?.houseRulesChechOut || "Check-Out"
            }
            placeholder={
              rentModal.translation?.houseRulesChechOutPlaceholder ||
              "Select time..."
            }
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
                label={
                  rentModal.translation?.houseRulesCancelationPolicy ||
                  "Has cancelation policy"
                }
                value={hasCancelation}
                onChange={(value) => setCustomValue("hasCancelation", value)}
                errors={errors}
              />
              <Toggle
                id="allowBooking"
                label={
                  rentModal.translation?.houseRulesAllowBooking ||
                  "Allow booking"
                }
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
            label={
              rentModal.translation?.houseRulesAcceptCards || "Accept cards"
            }
            value={paymentMethodsCards}
            onChange={(value) => setCustomValue("paymentMethodsCards", value)}
            errors={errors}
          />
          <Toggle
            id="paymentMethodsCash"
            label={rentModal.translation?.houseRulesAcceptCash || "Accept cash"}
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
          title={
            rentModal.translation?.additionalOptionsTitle || "Addional options"
          }
          subtitle={
            rentModal.translation?.additionalOptionsSubtitle ||
            "Extra customizable services or amenities for pets, such as grooming, feeding, and extended care, enhancing the overall experience and comfort during stay."
          }
        />
        <Toggle
          id="hasFood"
          label={
            rentModal.translation?.additionalOptionsHasFood ||
            "Has food option (alergies)"
          }
          value={hasFood}
          onChange={(value) => setCustomValue("hasFood", value)}
          errors={errors}
        />
        <Toggle
          id="hasGrooming"
          label={
            rentModal.translation?.additionalOptionsHasGrooming ||
            "Has grooming"
          }
          value={hasGrooming}
          onChange={(value) => setCustomValue("hasGrooming", value)}
          errors={errors}
        />
        <Toggle
          id="hasVet"
          label={
            rentModal.translation?.additionalOptionsHasVeterinarian ||
            "Has veterinarian"
          }
          value={hasVet}
          onChange={(value) => setCustomValue("hasVet", value)}
          errors={errors}
        />
        <hr />
        <div className="flex flex-row gap-4">
          <TextArea
            id="addionalInformation"
            label={
              rentModal.translation?.additionalOptionsInfo ||
              "Addional information"
            }
            defaultNumberOfRows={2}
            disabled={isLoading}
            register={register}
            errors={errors}
          />
        </div>
      </div>
    );
  }

  const handlePriceChange = (index, field, value) => {
    if (value !== null && value !== undefined && value !== "") {
      value = parseFloat(value);
    }
    const updatedTypes = [...petTypesSupported];
    updatedTypes[index][field] = value || 0;
    setPetTypesSupported(updatedTypes);
    setCustomValue("types", updatedTypes);
  };

  const getPriceByName = (name, priceType) => {
    const item = petTypesSupported?.find((entry) => entry.name === name);
    return item && item.hasOwnProperty(priceType)
      ? item[priceType] > 0
        ? item[priceType]
        : null
      : null;
  };

  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title={rentModal.translation?.priceTitle || "Price"}
          subtitle={
            rentModal.translation?.priceSubtitle ||
            "How much would it cost per night?"
          }
        />
        {/* If NOT using Advanced Options, show basic Week/Weekend Price */}
        {capacityType === "TOTAL" ? (
          <>
            <CustomInput
              id="weekPrice"
              label={rentModal.translation?.weekPriceInput || "Week Price"}
              formatPrice
              type="number"
              disabled={isLoading}
              onChange={(e) =>
                handlePriceChange(0, "defaultPrice", e.target.value)
              }
            />
            <CustomInput
              id="weekendPrice"
              label={
                rentModal.translation?.weekendPriceInput || "Weekend Price"
              }
              formatPrice
              type="number"
              disabled={isLoading}
              onChange={(e) =>
                handlePriceChange(0, "weekendPrice", e.target.value)
              }
            />
          </>
        ) : (
          <>
            {/* Show Prices Per Type When Advanced Options are Enabled */}
            {petTypesSupported.map((type, index) => (
              <div
                key={index}
                className="flex flex-col gap-4 border p-4 rounded-md"
              >
                <h3 className="text-lg font-semibold">
                  {type.name || `Type ${index + 1}`}
                </h3>
                <CustomInput
                  id={`price-${type.name || index}-week`}
                  label={`Week Price (${type.name || `Type ${index + 1}`})`}
                  formatPrice
                  type="number"
                  value={getPriceByName(type.name, "defaultPrice")}
                  disabled={isLoading}
                  onChange={(e) =>
                    handlePriceChange(index, "defaultPrice", e.target.value)
                  }
                />
                <CustomInput
                  id={`price-${type.name || index}-weekend`}
                  label={`Weekend Price (${type.name || `Type ${index + 1}`})`}
                  formatPrice
                  type="number"
                  value={getPriceByName(type.name, "weekendPrice")}
                  disabled={isLoading}
                  onChange={(e) =>
                    handlePriceChange(index, "weekendPrice", e.target.value)
                  }
                />
              </div>
            ))}
          </>
        )}
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
      title={
        rentModal.isEdit
          ? rentModal.translation?.edit || "Edit property"
          : rentModal.translation?.submit || "Add property"
      }
      actionLabel={actionLabel}
      secondaryActionLabel={secondartActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      body={bodyContent}
      disabled={isLoading}
      canCloseDisabled
    />
  );
};

export default RentModal;
