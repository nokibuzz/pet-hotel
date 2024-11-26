"use client";

import React, { useState } from "react";

const EditableField = ({ label, value, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    onSave(tempValue);
    setIsEditing(false);
  };

  //   TODO: fix this shit to components
  return (
    <div className="flex flex-col gap-1">
      <label className="text-gray-600 text-sm">{label}</label>
      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="border border-gray-300 rounded px-2 py-1 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
          />
          <button
            className="text-sm text-white bg-green-500 px-3 py-1 rounded hover:bg-green-600"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="text-sm text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <span>{value}</span>
          <button
            className="text-sm text-blue-500 hover:underline"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default EditableField;
