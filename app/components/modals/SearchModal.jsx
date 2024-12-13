"use client";

import qs from "query-string";
import useSearchModal from "@/app/hooks/useSearchModal";
import Modal from "./Modal";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState, useEffect } from "react";
import { formatISO } from "date-fns";
import Heading from "../Heading";
import Calendar from "../inputs/Calendar";
import Counter from "../inputs/Counter";
import axios from "axios";
import MapSelect from "../MapSelect";

const STEPS = Object.freeze({
  LOCATION: 0,
  DATE: 1,
  INFO: 2,
});

const SearchModal = ({ currentUser }) => {
  const router = useRouter();
  const params = useSearchParams();
  const searchModal = useSearchModal();

  const [step, setStep] = useState(STEPS.LOCATION);
  const [location, setLocation] = useState(currentUser?.defaultLocation);
  const [guestCount, setGuestCount] = useState(1);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const [city, setCity] = useState("");

  const onBack = useCallback(() => {
    setStep((value) => value - 1);
  }, []);

  const onNext = useCallback(() => {
    setStep((value) => value + 1);
  }, []);

  const onSubmit = useCallback(async () => {
    if (step !== STEPS.INFO) {
      return onNext();
    }

    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery = {
      ...currentQuery,
      guestCount,
    };

    if (location) {
      updatedQuery.latitude = location.latitude;
      updatedQuery.longitude = location.longitude;
      updatedQuery.city = city;
    }

    if (dateRange.startDate) {
      updatedQuery.startDate = formatISO(dateRange.startDate);
    }

    if (dateRange.endDate) {
      updatedQuery.endDate = formatISO(dateRange.endDate);
    }

    const url = qs.stringifyUrl(
      {
        url: "/",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    setStep(STEPS.LOCATION);
    searchModal.onClose();

    router.push(url);
  }, [
    step,
    searchModal,
    location,
    router,
    guestCount,
    dateRange,
    onNext,
    params,
  ]);

  const actionLabel = useMemo(() => {
    if (step === STEPS.INFO) {
      return "Search";
    }

    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.LOCATION) {
      return undefined;
    }

    return "Back";
  }, [step]);

  const sendLocationToServer = async (latitude, longitude) => {
    try {
      const userId = currentUser?.id;
      await axios
        .post(`/api/location`, { userId, latitude, longitude })
        .catch(() => {
            toast.error("Woof, woof, something went wrong!")
        })
        .finally(() => {
        });
    } catch (error) {
      console.error('Error saving user location:', error);
    }
  };

  useEffect(() => {
    if (navigator.geolocation && searchModal.isOpen) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude: latitude, longitude: longitude });
          if (currentUser){
            sendLocationToServer(latitude, longitude); 
          }
        },
        (err) => {
          console.error("Failed to retrieve location");
        },
        { enableHighAccuracy: true }
      );
    }
  }, [searchModal.isOpen]);

  const onLocationSelect = (event) => {
    const { city, location } = event;
    setLocation(location);
    setCity(city);
  };

  let bodyContent = (
    <MapSelect 
      title="Where do you want to leave your pet?"
      subtitle="Find the nearest and best location for you!"
      defaultCoordinates={location}
      onSelect={(event) => onLocationSelect(event)}
    />
  );

  if (step === STEPS.DATE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="When do you want to leave your pets?"
          subtitle="Select the right date"
        />
        <Calendar
          value={dateRange}
          onChange={(value) => setDateRange(value.selection)}
        />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="More information" subtitle="Filter out more detailed" />
        <Counter
          title="Pets"
          subtitle="How many pets you want to leave?"
          value={guestCount}
          onChange={(value) => setGuestCount(value)}
        />
        {/* TODO: add boolean if they want to leave pets in separate rooms */}
      </div>
    );
  }

  return (
    <Modal
      isOpen={searchModal.isOpen}
      onClose={searchModal.onClose}
      onSubmit={onSubmit}
      title="Filters"
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
      body={bodyContent}
    />
  );
};

export default SearchModal;
