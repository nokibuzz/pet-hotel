"use client";

import React from "react";
import ReactToggle from "react-toggle";
import "react-toggle/style.css";

const Toggle = ({
  id,
  label,
  value,
  onChange,
  errors,
  col = false,
  required = false,
}) => {
  return (
    <div
      className={`w-full flex ${
        col ? "flex-col" : "flex-row"
      } items-center gap-6`}
    >
      <label
        className={`text-md ${
          errors[id] ? "text-red-700" : "text-neutral-500"
        }`}
      >
        {label}
      </label>

      <ReactToggle
        checked={value}
        onChange={() => onChange(!value)}
        required={required}
        className={`react-toggle ${
          errors[id] ? "border-red-700" : "border-neutral-300"
        }`}
      />
    </div>
  );
};

export default Toggle;
