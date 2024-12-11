import { useState } from "react";
import axios from "axios";

const useAddress = () => {
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const calculateDisplayName = (data) => {
    const parts = [
      data.address?.road,
      data.address?.house_number,
      data.address?.city,
      data.address?.country,
    ];
  
    return parts.filter(Boolean).join(" - ");
  };

  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1`
      );

      setSuggestions(
        response.data.map((result) => ({
          city: result.address?.city ?? result.address?.country ?? "",
          display_name: calculateDisplayName(result),
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          address: calculateDisplayName(result)
        }))
      );
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const fetchAddressFromCoordinates = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`
      );
      if (response.data && response.data.display_name) {
          setAddress(calculateDisplayName(response.data));
          setCity(response.data.address?.city ?? response.data.address?.country ?? "");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  return {
    fetchSuggestions,
    fetchAddressFromCoordinates,
    address,
    suggestions,
    city,
    setCity,
    setAddress,
    setSuggestions,
  };
};

export default useAddress;
