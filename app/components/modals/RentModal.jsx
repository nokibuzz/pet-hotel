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
import TextArea from "../inputs/TextArea";
import Dropdown from "../inputs/Dropdown";
import Toggle from "../inputs/Toggle";

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

const RentModal = () => {
  const router = useRouter();
  const rentModal = useRentModal();

  const [step, setStep] = useState(STEPS.CATEGORY);
  const [isLoading, setIsLoading] = useState(false);
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
      location: null,
      roomCount: 1,
      guestCount: 1,
      imageSrc: "",
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
    },
  });

  // cause we have customer categoryInput, we need to check if the category value is valid
  const category = watch("category");
  const location = watch("location");
  const guestCount = watch("guestCount");
  const roomCount = watch("roomCount");
  const imageSrc = watch("imageSrc");
  const hasCancelation = watch("hasCancelation");
  const allowBooking = watch("allowBooking");
  const paymentMethodsCards = watch("paymentMethodsCards");
  const paymentMethodsCash = watch("paymentMethodsCash");
  const hasFood = watch("hasFood");
  const hasGrooming = watch("hasGrooming");
  const hasVet = watch("hasVet");

  // this is the hack way to import map to work fine
  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
      }),
    [location]
  );

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

    if (step !== STEPS.PRICE) {
      return onNext();
    }

    setIsLoading(true);

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
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.PRICE) {
      return "Create";
    }

    return "Next";
  }, [step]);

  const secondartActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined;
    }

    return "Back";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Which of these best describe you pet care?"
        subtitle="Pick one"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
        {categories.map((item) => (
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

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Where is your pet house located?"
          subtitle="Help dog lovers find you"
        />
        <CountrySelect
          value={location}
          onChange={(value) => setCustomValue("location", value)}
        />
        <Map center={location?.latlng} />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Give some more info about your pet place"
          subtitle="Why pets should choose your place"
        />
        <Counter
          title="Pets"
          subtitle="How many pets you can take?"
          value={guestCount}
          onChange={(value) => setCustomValue("guestCount", value)}
        />
        <hr />
        {/* This is just a show, find out how pet care hotels count this "rooms", like 5 pets inside 1 room etc. But with breed in mind, like pitbull cannot be in the same room as pussy chiwawa */}
        <Counter
          title="Rooms"
          subtitle="How many rooms do you have?"
          value={roomCount}
          onChange={(value) => setCustomValue("roomCount", value)}
        />
      </div>
    );
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Add photos of your home/hotel"
          subtitle="Let owners know how your pet care looks like"
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
            label="Check-In"
            placeholder="Select time..."
            onChange={(value) => setCustomValue("checkInTime", value)}
            options={hours}
            register={register}
            errors={errors}
            required
          />
          <Dropdown
            id="checkOutTime"
            label="Check-Out"
            placeholder="Select time..."
            onChange={(value) => setCustomValue("checkOutTime", value)}
            options={hours}
            register={register}
            errors={errors}
            required
          />
        </div>
        <hr />
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
        <hr />
        <Toggle
          id="hasGrooming"
          label="Has grooming"
          value={hasGrooming}
          onChange={(value) => setCustomValue("hasGrooming", value)}
          errors={errors}
        />
        <hr />
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
      onClose={rentModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      title="Add accomodation"
      actionLabel={actionLabel}
      secondaryActionLabel={secondartActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      body={bodyContent}
    />
  );
};

export default RentModal;
