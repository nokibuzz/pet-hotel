"use client";

import { useMemo, useState, useEffect } from "react";
import Heading from "../components/Heading";
import dynamic from "next/dynamic";
import AddressSuggestions from "../components/AddressSuggestions";
import AddressInput from "../components/inputs/AddressInput";
import useAddress from "@/app/hooks/useAddress";
import { useDebouncedFunction } from "@/app/hooks/useDebouncedFunction";

const MapSelect = ( { 
    title,
    subtitle,
    defaultCoordinates,
    onSelect
} ) => {
    const [markerPosition, setMarkerPosition] = useState([]); 
    const [zoomLevel, setZoomLevel] = useState(15);
    const {
        fetchSuggestions,
        fetchAddressFromCoordinates,
        address,
        suggestions,
        city,
        setCity,
        setAddress,
        setSuggestions,
    } = useAddress();

    useEffect(() => {
        if (defaultCoordinates)
        {
            setMarkerPosition([ defaultCoordinates.latitude, defaultCoordinates.longitude]);
            fetchAddressFromCoordinates(defaultCoordinates.latitude, defaultCoordinates.longitude);
        }
      }, [defaultCoordinates]);

      useEffect(() => {
        if (city) {
            onSelect({
                city: city,
                location: {
                    latitude: markerPosition[0],
                    longitude: markerPosition[1]
                },
                addressLabel: address
            });
        }
    }, [city]);

    const DraggableMap = useMemo(
        () =>
        dynamic(() => import("../components/DraggableMap"), {
            ssr: false,
        }),
    );

    const handleInputChange = (e) => {
        const value = e.target.value;
        setAddress(value);
        debouncedSuggestionFetch(value);
    };

    const debouncedSuggestionFetch = useDebouncedFunction((value) => {
        if (value) {
            fetchSuggestions(value);
        }
    }, 500);

    const handleSuggestionSelect = (suggestion) => {
        setAddress(suggestion.display_name);
        setMarkerPosition([suggestion.latitude, suggestion.longitude]);
        setCity(suggestion.city);
        setSuggestions([]);
        onSelect({ city: suggestion.city, location: { latitude: suggestion.latitude, longitude: suggestion.longitude, addressLabel: suggestion.address } });
    };

    const handleMarkerDragEnd = (e) => {
        const { lat, lng } = e.target.getLatLng();
        setMarkerPosition([lat, lng]);
        fetchAddressFromCoordinates(lat, lng);
        onSelect({ city: city, location: { latitude: lat, longitude: lng }, addressLabel: address });
    };

    return (
        <div className="flex flex-col gap-8">
            <Heading
                title={title}
                subtitle={subtitle}
                />
            <div>
                <AddressInput 
                    value={address} 
                    onChange={handleInputChange} 
                />
                <AddressSuggestions
                    suggestions={suggestions}
                    onSelect={handleSuggestionSelect}
                />
                <div className="rounded-lg overflow-hidden">
                    <DraggableMap
                        center={markerPosition}
                        onMarkerDragEnd={handleMarkerDragEnd}
                        zoomLevel={zoomLevel}
                        setZoomLevel={setZoomLevel}
                    />
                </div>
            </div>
        </div>
    );
};

export default MapSelect;
