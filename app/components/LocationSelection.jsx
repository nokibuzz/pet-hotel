import React, { useState, useEffect } from "react";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import Heading from "./Heading";
import Map from "./Map";
import CountrySelect from "./inputs/CountrySelect";

const LocationSelection = () => {
  const [country, setCountry] = useState(null);
  const [city, setCity] = useState(null);
  const [street, setStreet] = useState("");
  const [autocompleteCities, setAutocompleteCities] = useState([]);
  const [mapCenter, setMapCenter] = useState(null);

  const provider = new OpenStreetMapProvider();

  // Fetch cities for autocomplete when user types at least 2 letters
  const fetchCities = async (query) => {
    if (query.length < 2 || !country) return;
    const results = await provider.search({
      query: `${query}, ${country.label}`,
    });
    const filtered = results.filter(
      (result) => result.raw.type === "city" || result.raw.type === "village"
    );
    setAutocompleteCities(filtered);
  };

  // Handle city selection
  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity);
    setMapCenter([selectedCity.y, selectedCity.x]);
    setAutocompleteCities([]);
  };

  return (
    <div className="flex flex-col gap-8">
      <Heading
        title="Where is your pet house located?"
        subtitle="Help dog lovers find you"
      />

      {/* Country Selection */}
      <CountrySelect
        value={country}
        onChange={(value) => {
          setCountry(value);
          setCity(null); // Reset city and map when country changes
          setStreet("");
          setMapCenter(value?.latlng);
        }}
      />

      {/* City Selection */}
      {country && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            type="text"
            className="border p-2 rounded w-full"
            placeholder="Start typing a city..."
            onChange={(e) => fetchCities(e.target.value)}
          />
          {autocompleteCities.length > 0 && (
            <ul className="border rounded bg-white mt-2 max-h-48 overflow-y-auto">
              {autocompleteCities.map((city) => (
                <li
                  key={`${city.x}-${city.y}`}
                  onClick={() => handleCitySelect(city)}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                >
                  {city.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Street and Address Input */}
      {city && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Street and Address
          </label>
          <input
            type="text"
            className="border p-2 rounded w-full"
            placeholder="Enter street and number..."
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
        </div>
      )}

      {/* Location Label */}
      {country && (
        <div className="mt-4 text-gray-800 text-sm">
          <strong>Selected Location: </strong>
          {country.label} • {city?.label || "City not selected"} •{" "}
          {street || "Street not entered"}
        </div>
      )}

      {/* Map */}
      <Map center={mapCenter} />
    </div>
  );
};

export default LocationSelection;
