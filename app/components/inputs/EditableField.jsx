"use client";

import React, { useState } from "react";
import Tooltip from "../Tooltip";

const EditableField = ({ label, value, onFieldChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleBlur = () => {
    setIsEditing(false);
    onFieldChange(tempValue);
  };

  const handleChange = (val) => {
    setTempValue(val);
    onFieldChange(val);
  };

  return (
    <div className="flex flex-col w-full items-start">
      <label className="text-sm font-semibold text-gray-600 mb-1 inset-10">
        {label}
      </label>

      {isEditing ? (
        <input
          type="text"
          value={tempValue}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          autoFocus
          className="text-center w-full ml-4 md:w-2/3 px-3 py-2 border-b-2 border-black focus:outline-none focus:border-black transition-colors duration-300"
        />
      ) : (
        <Tooltip text={`Click on text to edit ${label}`}>
          <span
            className="w-full md:w-auto text-lg font-semibold text-gray-700 cursor-pointer border-neutral-500 hover:text-blue-500 transition"
            onClick={() => setIsEditing(true)}
          >
            {value || "-"}
          </span>
        </Tooltip>
      )}
    </div>
  );
};

export default EditableField;
