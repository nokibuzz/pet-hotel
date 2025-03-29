"use client";

import Modal from "./Modal";
import { useCallback, useState } from "react";
import Heading from "../Heading";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import useSetNonWorkingDaysModal from "@/app/hooks/useSetNonWorkingDaysModal";
import ScrollableItemsSection from "../profile/ScrollableItemsSection";
import { petTypes } from "../PetTypes";
import ClickInput from "../inputs/ClickInput";
import { format } from 'date-fns';
import CalendarDataTable from "../inputs/CalendarDataTable";

const STEPS = Object.freeze({
  OBJECTS: 0,
  TYPE: 1,
  CALENDAR: 2,
  CONFIRMATIONS: 3,
});

const SetNonWorkingDaysModal = ({ currentUser }) => {
    const [step, setStep] = useState(STEPS.OBJECTS);
    const [isLoading, setIsLoading] = useState(false);
    
    const router = useRouter();
    const setNonWorkingDaysModal = useSetNonWorkingDaysModal();
    const translations = setNonWorkingDaysModal.translation;
    const properties = setNonWorkingDaysModal.properties;
    const [types, setTypes] = useState(undefined);

    const [property, setProperty] = useState(undefined);
    const [type, setType] = useState(undefined);
    
    const [constDateRanges, setConstDateRanges] = useState([]);
    const [dateRanges, setDateRanges] = useState([]);
    const [disabledDates, setDisabledDates] = useState([]);

    const [request, setRequest] = useState({});

    const onBack = useCallback(() => {
        if (isLoading === true) {
            return;
        }
        setStep((value) => value - 1);
    }, [isLoading]);

    const onNext = useCallback(() => {
        if (isLoading === true) {
            return;
        }
        
        if (step === STEPS.OBJECTS && property === undefined) {
            toast.error(translations.pickObjectSubtitle);
            return;
        }

        if (step === STEPS.TYPE && type === undefined) {
            toast.error(translations.pickTypeSubtitle);
            return;
        }

        if (step === STEPS.CALENDAR) {
            prepareData();
        }

        if (step === STEPS.CONFIRMATIONS) {
            if (request === undefined) {
                toast.error(translations.requestNotValid);
                return;
            }

            console.log('Usapo');
            sendRequest();
        } 
        else {
            setStep((value) => value + 1);
        }


    }, [step, isLoading, property, type, dateRanges, request]);

    async function fetchTypes(id) {
        setIsLoading(true);
        
        const response = await fetch(`/api/types?listingId=${id}`);
    
        if (!response.ok) {
            toast.error(translations.errorCanNotFetchData);
            return;
        }
    
        const data = await response.json();
        
        setTypes(data);
        setIsLoading(false);
    }

    async function fetchCalendar(newType) {
        setIsLoading(true);
        
        const searchStart = new Date();
        const searchEnd = new Date();
        searchEnd.setMonth(searchEnd.getMonth() + 6);

        const selectedType = newType ? newType: type;

        const typeId = types.find((item) => item.name === selectedType).id;

        const response = await fetch(`/api/blocked-dates?listingId=${property}&typeId=${typeId}&searchStart=${searchStart.toISOString()}&searchEnd=${searchEnd.toISOString()}`);
    
        if (!response.ok) {
            toast.error(translations.errorCanNotFetchData);
            return;
        }
    
        const data = await response.json();

        setDateRanges(data.blockedDates);
        setConstDateRanges(data.blockedDates);
        setDisabledDates(data.nonblockingDates);
        setIsLoading(false);
    }

    const prepareData = () => {
        let addedDates = [];
        let removedDates = [];
        let updatedDates = [];

        dateRanges.forEach(dateRange => {
            if (dateRange.id < 1 && dateRange.startDate !== undefined && dateRange.endDate !== undefined) {
                addedDates.push(dateRange);
            }
            else if (typeof dateRange.id !== 'number' && !dateRange.startDate && !dateRange.endDate) {
                const deletedRow = constDateRanges.find((d) => d.id === dateRange.id);
                removedDates.push(deletedRow);
            }
            else if (typeof dateRange.id !== 'number' && dateRange.startDate !== undefined && dateRange.endDate !== undefined) {
                updatedDates.push(dateRange);
            }
        });

        setRequest({property, type, addedDates, removedDates, updatedDates});
    };

    const sendRequest = () => {
        setIsLoading(true);

        console.log(request);

        axios
            .put("/api/blocked-dates", request)
            .then(() => {
                toast.success(translations.success);
                router.refresh();
                setStep(STEPS.OBJECTS);
                setNonWorkingDaysModal.onClose();
            })
            .catch(() =>
                toast.error(translations.error)
            )
            .finally(() => setIsLoading(false));
    }

    const onPropertySelect = (id) => {
        if (id === property) {
            setProperty(undefined);
        }
        else {
            setProperty(id);

            fetchTypes(id);
        }
    };

    const onTypeSelect = (newType) => {
        if (newType === type) {
            setType(undefined);
        }
        else {
            setType(newType);

            fetchCalendar(newType);
        }
    };

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
        setNonWorkingDaysModal,
        router,
        onNext
    ]);
  
    let bodyContent = (
        <div>
            <Heading
                title={translations.pickObject}
                subtitle={translations.pickObjectSubtitle}
            />
            <ScrollableItemsSection
                items={properties.map((property) => ({
                    id: property.id,
                    imageSrc: property.imageSrc?.[0],
                    title: property.title,
                    category: property.category,
                }))}
                onItemClick={(id) => onPropertySelect(id)}
                selectedId={property}
                renderContent={(item) => (
                    <>
                    <div className="font-semibold text-sm">{item.title}</div>
                    <div className="text-xs font-light text-neutral-500">
                        {item.category}
                    </div>
                    </>
                )}
            />
        </div>
    );

    if (step == STEPS.TYPE) {
        bodyContent = (
            <div>
                <Heading
                    title={translations.pickType}
                    subtitle={translations.pickTypeSubtitle}
                />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
                    {
                        petTypes
                            .filter((petType) =>
                                types?.some(
                                    (type) => type.name === petType.label
                                )
                            )
                            .map((item) => (
                                <div key={item.label} className="col-span-1">
                                <ClickInput
                                    onClick={(type) => onTypeSelect(type)}
                                    selected={type === item.label}
                                    label={item.label}
                                    value={item.label}
                                    icon={item.icon}
                                />
                                </div>
                            ))
                    }
                </div>
            </div>
        );
    }

    if (step == STEPS.CALENDAR) {
        bodyContent = (
            <div>
                <Heading
                    title={translations.pickDate}
                    subtitle={translations.pickDateSubtitle}
                />
                <CalendarDataTable 
                    values={dateRanges}
                    setValues={setDateRanges}
                    disabledDates={disabledDates}
                    translations={translations}
                />
            </div>
        );
    }

    if (step == STEPS.CONFIRMATIONS) {
        bodyContent = (
            <div>
                <Heading
                    title={properties.find((p) => p.id === property).title}
                    subtitle={type}
                />
                {
                    request.addedDates.length > 0 && (
                    <CalendarDataTable 
                        values={request.addedDates}
                        translations={translations}
                        title={translations.addedDates}
                        isReadOnly={true}
                    />
                )}
                {
                    request.removedDates.length > 0 && (
                    <CalendarDataTable 
                        values={request.removedDates}
                        translations={translations}
                        title={translations.removedDates}
                        isReadOnly={true}
                    />
                )}
                {
                    request.updatedDates.length > 0 && (
                    <CalendarDataTable 
                        values={request.updatedDates}
                        translations={translations}
                        title={translations.updatedDates}
                        isReadOnly={true}
                    />
                )}
            </div>
        );
    }

    return (
        <Modal
            isOpen={setNonWorkingDaysModal.isOpen}
            onClose={setNonWorkingDaysModal.onClose}
            onSubmit={onSubmit}
            title={translations.nonWorkingDays}
            actionLabel={step === STEPS.CONFIRMATIONS ? translations.confirm : translations.next}
            secondaryActionLabel={step === STEPS.OBJECTS ? undefined : translations.back}
            secondaryAction={step === STEPS.OBJECTS ? undefined : onBack}
            body={bodyContent}
        />
    );
};

export default SetNonWorkingDaysModal;
