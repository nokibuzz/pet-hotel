const useAddress = () => {
  const fetchSuggestions = async (query) => {
    if (!query) {
      return [];
    }

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1`
      );
      return response.data.map((result) => ({
        address: result.address,
        display_name: result.display_name,
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
      }));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      return [];
    }
  };

  const fetchAddressFromCoordinates = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`
      );
      if (response.data && response.data.display_name) {
        return response.data.display_name;
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      return "";
    }
  };

  return {
    fetchAddressFromCoordinates,
    fetchSuggestions,
  };
};

export default useAddress;
