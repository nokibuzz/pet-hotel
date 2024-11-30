"use client";

import React, { useState } from "react";
import { OpenStreetMapProvider } from "leaflet-geosearch";

const LocationSelector = ({ countryCode, onSelect }) => {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const provider = new OpenStreetMapProvider();

  const handleSearch = async (query) => {
    if (!query || query.length < 2) {
      // Trigger autocomplete only after two letters
      setResults([]);
      return;
    }

    const searchResults = await provider.search({
      query,
      countrycodes: countryCode ? countryCode.toLowerCase() : null,
    });

    // Filter results to include only cities, villages, and addresses
    const filteredResults = searchResults.filter((result) => {
      const type = result.raw.type;
      return type === "city" || type === "village" || type === "house";
    });

    setResults(filteredResults);
  };

  const handleSelect = (result) => {
    onSelect(result);
    setResults([]);
    setInput(result.label);
  };

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          handleSearch(e.target.value);
        }}
        placeholder="Search for a location..."
        className="border p-2 rounded w-full"
      />
      {results.length > 0 && (
        <ul className="border rounded bg-white mt-2 max-h-48 overflow-y-auto">
          {results.map((result) => (
            <li
              key={result.x + result.y}
              onClick={() => handleSelect(result)}
              className="p-2 hover:bg-gray-200 cursor-pointer"
            >
              {result.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationSelector;
