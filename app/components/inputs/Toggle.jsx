"use client";

import React from "react";
import ReactToggle from "react-toggle";
import "react-toggle/style.css";
import ExplanationInfo from "../ExplanationInfo";

const Toggle = ({
  id,
  label,
  value,
  onChange,
  errors,
  col = false,
  required = false,
  explanation,
}) => {
  return (
    <div
      className={`w-full flex ${
        col ? "flex-col" : "flex-row"
      } items-center gap-2 justify-between`}
    >
      <label
        className={`text-md flex-grow ${
          errors && errors[id] ? "text-red-700" : "text-neutral-500"
        }`}
      >
        {label}
      </label>

      <div className="flex items-center gap-3">
        <ReactToggle
          checked={value}
          onChange={() => onChange(!value)}
          required={required}
          className={`react-toggle ${
            errors && errors[id] ? "border-red-700" : "border-neutral-300"
          }`}
        />
        {explanation && <ExplanationInfo text={explanation} />}
      </div>
    </div>
  );
};

export default Toggle;
