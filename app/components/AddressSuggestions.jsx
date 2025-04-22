"use client";

import React from "react";

const AddressSuggestions = ({ suggestions, onSelect, className = "" }) => {
  if (suggestions.length === 0) return null;

  return (
    <ul className={`border rounded-md mt-2 bg-white shadow-md max-h-60 overflow-y-auto ${className}`}>
      {suggestions.map((suggestion, index) => (
        <li
          key={index}
          onClick={() => onSelect(suggestion)}
          className="p-2 hover:bg-gray-100 cursor-pointer"
        >
          {suggestion.display_name}
        </li>
      ))}
    </ul>
  );
};

export default AddressSuggestions;
