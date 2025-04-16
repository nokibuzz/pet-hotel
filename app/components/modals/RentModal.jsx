"use client";

import useRentModal from "@/app/hooks/useRentModal";
import Modal from "./Modal";
import { useMemo, useState, useEffect } from "react";
import Heading from "../Heading";
import { options } from "../navbar/BasicFilters";
import {
  ALL_PET_CATEGORIES,
  PET_BREEDS,
  PET_TYPES,
} from "@/app/utils/PetConstants";
import ClickInput from "../inputs/ClickInput";
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
import ExplanationInfo from "../ExplanationInfo";

const STEPS = Object.freeze({
  CATEGORY: 0,
  DESCRIPTION: 1,
  IMAGES: 2,
  LOCATION: 3,
  PET_TYPES: 4,
  BLOCKED_BREEDS: 5,
  INFO: 6,
  PRICE: 7,
  ADDIONAL_OPTIONS: 8,
  HOUSE_RULES: 9,
});

const MAX_IMAGES_FOR_RENT = 10;

const RentModal = ({ currentUser, translation }) => {
  const router = useRouter();
  const rentModal = useRentModal();

  const [step, setStep] = useState(STEPS.CATEGORY);
  const [isLoading, setIsLoading] = useState(false);
  const [localImageSrc, setLocalImageSrc] = useState([]);
  const [petTypesSupported, setPetTypesSupported] = useState([]);
  const [haveBlockedBreeds, setHaveBlockedBreeds] = useState(false);

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
      paymentMethodsAccount: true,
      hasFood: false,
      hasGrooming: false,
      hasVet: false,
      addionalInformation: "",
      locationLongitude: "",
      locationLatitude: "",
      addressLabel: "",
      capacityType: "",
      types: [],
      blockedBreeds: [],
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
  const paymentMethodsAccount = watch("paymentMethodsAccount");
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
        translation?.error?.categoryNotSelected ||
          "Category should be selected!"
      );
      return;
    }
    if (step === STEPS.PET_TYPES && petTypesSupported.length === 0) {
      toast.error(
        translation?.error?.petTypeNotSelected || "Pet type should be selected"
      );
      return;
    }
    if (step === STEPS.PRICE) {
      for (let pts of petTypesSupported) {
        if (
          pts["defaultPrice"] === undefined ||
          pts["defaultPrice"] === 0 ||
          pts["weekendPrice"] === undefined ||
          pts["weekendPrice"] === 0
        ) {
          toast.error(
            translation?.error?.priceTagNotAdded ||
              "Need to insert valid price tag"
          );
          return;
        }
      }
    }
    if (
      step === STEPS.LOCATION &&
      locationLongitude === "" &&
      locationLatitude === ""
    ) {
      toast.error(
        translation?.error?.locationNotSelected ||
          "Location should be selected!"
      );
      return;
    }
    if (step === STEPS.INFO) {
      calculateTotalCapacity(petTypesSupported);
      if (
        petTypesSupported.reduce(
          (total, item) => total + (item.capacity || 0),
          0
        ) === 0
      ) {
        toast.error(
          translation?.error?.capacityNotSelected ||
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
        translation?.error?.noImagesToUpload || "No images to upload!"
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
          throw new Error(
            translation?.error?.imageUploadFailed || "Image upload failed"
          );
        }

        const data = await uploadResponse.json();
        uploaded.push(data.secure_url);
      }

      setCustomValue("imageSrc", uploaded);
      toast.success(
        translation?.imagesUploadedSuccessfully ||
          "All images uploaded successfully!"
      );
    } catch (error) {
      console.error(error);
      toast.error(
        translation?.error?.imagesNotUploaded || "Error uploading images!"
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
        petTypesSupported.length === 1 &&
          petTypesSupported[0]?.name === ALL_PET_CATEGORIES
          ? ALL_PET_CATEGORIES
          : "ADVANCED"
      );

      if (rentModal.isEdit) {
        return onNext();
      }
    }

    if (step !== STEPS.HOUSE_RULES) {
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
            translation?.successfullyUpdated || "Successfully updated!"
          );
          router.refresh();
          // Resetting form, from react-form-hook library
          reset();
          setStep(STEPS.CATEGORY);
          rentModal.onClose();
        })
        .catch(() =>
          toast.error(translation?.error?.error || "Something went wrong!")
        )
        .finally(() => setIsLoading(false));
    } else {
      axios
        .post("/api/listing", data)
        .then(() => {
          toast.success(
            translation?.successfullyCreated || "Successfully created!"
          );
          router.refresh();
          // reseting form, from react-form-hook library
          reset();
          setStep(STEPS.CATEGORY);
          rentModal.onClose();
        })
        .catch(() =>
          toast.error(translation?.error?.error || "Something went wrong!")
        )
        .finally(() => setIsLoading(false));
    }
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.HOUSE_RULES) {
      return rentModal.isEdit
        ? translation?.submitUpdate || "Update"
        : translation?.submitCreate || "Create";
    }

    return translation?.next || "Next";
  }, [step]);

  const secondartActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined;
    }

    return translation?.back || "Back";
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
          translation?.categoryTitle ||
          "Which of these best describe you pet care?"
        }
        subtitle={translation?.categorySubtitle || "Pick one"}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
        {options.map((item) => (
          <div key={item.label} className="col-span-1">
            <ClickInput
              onClick={(category) => {
                setCustomValue("category", category);
              }}
              selected={category === item.label}
              label={translation?.[item.label] || item.label}
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
        title={translation?.locationTitle || "Where is your pet house located?"}
        subtitle={translation?.locationSubtitle || "Help dog lovers find you"}
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

  const updatePetTypes = (typeName) => {
    setPetTypesSupported((prevSelected) => {
      // Remove "TOTAL" record first
      const filteredList = prevSelected.filter(
        (item) => item.name !== ALL_PET_CATEGORIES
      );

      return filteredList.some((item) => item.name === typeName)
        ? filteredList.filter((item) => item.name !== typeName) // Remove item by name
        : [...filteredList, { name: typeName, capacity: 1 }]; // Add new item
    });
  };

  if (step === STEPS.PET_TYPES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title={
            translation?.petTypesTitle ||
            "Choose type of pets your object supports"
          }
          subtitle={translation?.petTypesSubtitle || "Pick one or more..."}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
          <div className="col-span-1">
            <ClickInput
              onClick={() => {
                setPetTypesSupported([
                  { name: ALL_PET_CATEGORIES, capacity: 1 },
                ]);
              }}
              selected={
                petTypesSupported.length === 1 &&
                petTypesSupported[0]?.name === ALL_PET_CATEGORIES
              }
              label={translation?.Type?.allPets || "All Pets"}
              value={ALL_PET_CATEGORIES}
              icon={faOtter}
            />
          </div>
          {PET_TYPES.map((item) => (
            <div key={item.label} className="col-span-1">
              <ClickInput
                onClick={(type) => {
                  updatePetTypes(type);
                }}
                selected={petTypesSupported.some(
                  (selectedItem) => selectedItem.name === item.label
                )}
                label={translation?.Type?.[item.label] || item.label}
                value={item.label}
                icon={item.icon}
                tooltip={
                  translation?.Type?.description?.[item.label] ||
                  item.description
                }
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const formattedBreedOptions = petTypesSupported.some(
    (petType) => petType.name === ALL_PET_CATEGORIES
  )
    ? Object.entries(PET_BREEDS).flatMap(([header, data]) => [
        {
          label: translation?.Type?.[header] || header,
          isHeader: true,
          value: header,
        }, // Non-clickable header
        ...data.breeds.map((breed) => ({ value: breed, label: breed })), // Clickable breeds
      ])
    : petTypesSupported.flatMap((petType) =>
        PET_BREEDS[petType.name] // Normalize keys
          ? [
              {
                label: translation?.Type?.[petType.name] || petType.name,
                isHeader: true,
                value: petType.name,
              },
              ...PET_BREEDS[petType.name].breeds.map((breed) => ({
                value: breed,
                label: breed,
              })),
            ]
          : []
      );

  if (step === STEPS.BLOCKED_BREEDS) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title={translation?.blockedBreedsTitle || "Blocked breeds"}
          subtitle={
            translation?.blockedBreedsSubtitle ||
            "Are there any breeds you don't want to pet?"
          }
        />
        <div className="flex flex-row gap-4">
          <Toggle
            label={translation?.blockBreedsToggle || "Block some breeds"}
            value={haveBlockedBreeds}
            onChange={(value) => setHaveBlockedBreeds(value)}
          />
          <ExplanationInfo
            text={
              translation?.blockBreedsExplanation ||
              "Blocked pets is specific breeds in the previously selected categorise you don't want to take care of in your hotel!"
            }
          />
        </div>
        {haveBlockedBreeds && (
          <>
            <hr />
            <div className="flex flex-row gap-4 w-full">
              <Dropdown
                id="blockedBreeds"
                label={translation?.breedLabel || "Pet breed"}
                placeholder={
                  translation?.breedPlaceholder || "Choose breeds..."
                }
                multiSelectedLabel={
                  translation?.breedSelected || "Selected breeds"
                }
                options={formattedBreedOptions}
                onChange={(value) => setCustomValue("blockedBreeds", value)}
                isMulti={true}
                translate={translation}
                register={register}
                errors={errors}
              />
            </div>
          </>
        )}
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title={translation?.capacityTitle || "What are your capacity"}
          subtitle={
            translation?.capacitySubtitle ||
            "How many pets can you take care of"
          }
        />

        {petTypesSupported.length > 0 && (
          <div className="flex flex-col gap-4">
            {petTypesSupported.map((type, index) => (
              <div key={index} className="flex items-center gap-4">
                <InputWithSeparateLabel
                  title={translation?.Type?.[type.name] || type.name}
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
          title={translation?.imagesTitle || "Add photos of your home/hotel"}
          subtitle={
            translation?.imagesSubtitle ||
            "Let owners know how your pet care looks like"
          }
        />
        <ImageUpload
          value={imageSrc}
          onChange={(value) => setLocalImageSrc(value)}
          maxImages={MAX_IMAGES_FOR_RENT}
          translation={translation?.ImageUpload}
        />
      </div>
    );
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title={translation?.descriptionTitle || "Describe your object"}
          subtitle={
            translation?.descriptionSubtitle ||
            "Simple explanation works the best"
          }
        />
        <Input
          id="title"
          label={translation?.descriptionInputTitle || "Title"}
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <TextArea
          id="description"
          label={translation?.descriptionInputDescription || "Description"}
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
      <div className="flex flex-col gap-4">
        <div className="mb-2">
          <Heading
            title={translation?.houseRulesTitle || "House rules"}
            subtitle={
              translation?.houseRulesSubtitle ||
              "House rules are a set of guidelines or regulations that outline expected behaviors, responsibilities, and standards within a specific property or environment to ensure a respectful, safe, and harmonious experience for all occupants or visitors."
            }
          />
        </div>

        {/* <div className="flex flex-row gap-4">
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
        <hr /> */}
        {category !== "Petgarten" && (
          <>
            <div className="flex flex-row gap-2">
              <Toggle
                id="hasCancelation"
                label={
                  translation?.houseRulesCancelationPolicy ||
                  "Has cancelation policy"
                }
                value={hasCancelation}
                onChange={(value) => setCustomValue("hasCancelation", value)}
                errors={errors}
                explanation={
                  translation?.houseRulesCancelationPolicyExplanation ||
                  "Your object give option to user to cancel reservation."
                }
              />
              <div className="h-10 w-px bg-gray-300" />
              <Toggle
                id="allowBooking"
                label={translation?.houseRulesAllowBooking || "Allow booking"}
                value={allowBooking}
                onChange={(value) => setCustomValue("allowBooking", value)}
                errors={errors}
                explanation={
                  translation?.houseRulesAllowBookingExplanation ||
                  "Your object is ready to receive reservations."
                }
              />
            </div>
            <hr />
          </>
        )}

        <div className="flex flex-col items-center gap-4 w-full">
          <Toggle
            id="paymentMethodsCards"
            label={translation?.houseRulesAcceptCards || "Accept cards"}
            value={paymentMethodsCards}
            onChange={(value) => setCustomValue("paymentMethodsCards", value)}
            errors={errors}
            explanation={
              translation?.houseRulesAcceptCardsExplanation ||
              "You give user an option of paying you via VISA/Master/American Express or other type of cards."
            }
          />
          <div className="w-full h-px bg-gray-100" />
          <Toggle
            id="paymentMethodsCash"
            label={translation?.houseRulesAcceptCash || "Accept cash"}
            value={paymentMethodsCash}
            onChange={(value) => setCustomValue("paymentMethodsCash", value)}
            errors={errors}
            explanation={
              translation?.houseRulesAcceptCashExplanation ||
              "You give user an option of paying by cash on site."
            }
          />
          <div className="w-full h-px bg-gray-100" />
          <Toggle
            id="paymentMethodsAccount"
            label={translation?.houseRulesAccountPayment || "Account Payment"}
            value={paymentMethodsAccount}
            onChange={(value) => setCustomValue("paymentMethodsAccount", value)}
            errors={errors}
            explanation={
              translation?.houseRulesAccountPaymentExplanation ||
              "You give user an option of paying to the your account."
            }
          />
        </div>
      </div>
    );
  }

  if (step === STEPS.ADDIONAL_OPTIONS) {
    bodyContent = (
      <div className="flex flex-col gap-4">
        <Heading
          title={translation?.additionalOptionsTitle || "Addional options"}
          subtitle={
            translation?.additionalOptionsSubtitle ||
            "Extra customizable services or amenities for pets, such as grooming, feeding, and extended care, enhancing the overall experience and comfort during stay."
          }
        />
        <Toggle
          id="hasFood"
          label={
            translation?.additionalOptionsHasFood ||
            "Has food option (alergies)"
          }
          value={hasFood}
          onChange={(value) => setCustomValue("hasFood", value)}
          errors={errors}
        />
        <hr />
        <Toggle
          id="hasGrooming"
          label={translation?.additionalOptionsHasGrooming || "Has grooming"}
          value={hasGrooming}
          onChange={(value) => setCustomValue("hasGrooming", value)}
          errors={errors}
        />
        <hr />
        <Toggle
          id="hasVet"
          label={
            translation?.additionalOptionsHasVeterinarian || "Has veterinarian"
          }
          value={hasVet}
          onChange={(value) => setCustomValue("hasVet", value)}
          errors={errors}
        />
        <hr />
        <div className="flex flex-row gap-4">
          <TextArea
            id="addionalInformation"
            label={translation?.additionalOptionsInfo || "Addional information"}
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
    const i =
      item && item.hasOwnProperty(priceType)
        ? item[priceType] > 0
          ? item[priceType]
          : ""
        : "";
    return i;
  };

  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title={translation?.priceTitle || "Price"}
          subtitle={
            translation?.priceSubtitle || "How much would it cost per night?"
          }
        />
        {/* If NOT using Advanced Options, show basic Week/Weekend Price */}
        {capacityType === ALL_PET_CATEGORIES ? (
          <>
            <CustomInput
              id="weekPrice"
              label={translation?.weekPriceInput || "Week Price"}
              formatPrice
              type="number"
              disabled={isLoading}
              onChange={(e) =>
                handlePriceChange(0, "defaultPrice", e.target.value)
              }
            />
            <CustomInput
              id="weekendPrice"
              label={translation?.weekendPriceInput || "Weekend Price"}
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
                  {translation?.Type?.[type.name] ||
                    type.name ||
                    `Type ${index + 1}`}
                </h3>
                <CustomInput
                  id={`price-${type.name || index}-week`}
                  label={`${translation?.weekPrice || "Week Price"} (${
                    translation?.Type?.[type.name] ||
                    type.name ||
                    `Type ${index + 1}`
                  })`}
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
                  label={`${translation?.weekendPrice || "Weekend Price"} (${
                    translation?.Type?.[type.name] ||
                    type.name ||
                    `Type ${index + 1}`
                  })`}
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
          ? translation?.edit || "Edit property"
          : translation?.submit || "Add property"
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
