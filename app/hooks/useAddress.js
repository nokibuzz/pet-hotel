import { useState } from "react";
import axios from "axios";

const useAddress = () => {
  const [address, setAddress] = useState("");
  const [locationValue, setLocationValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

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
          locationValue:
            (result.address?.city ?? "no city") +
            " · " +
            (result.address?.country ?? "no country"),
          address: result.address,
          display_name: result.display_name,
          lat: parseFloat(result.lat),
          lon: parseFloat(result.lon),
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
        setAddress(response.data.display_name);
        if (response.data.city && response.data.country)
          setLocationValue(response.data.city + " · " + response.data.country);
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  return {
    fetchSuggestions,
    fetchAddressFromCoordinates,
    address,
    locationValue,
    suggestions,
    setAddress,
    setSuggestions,
  };
};

export default useAddress;
