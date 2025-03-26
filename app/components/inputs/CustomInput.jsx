"use client";

import { useState } from "react";

const CustomInput = ({
  id,
  label,
  type,
  disabled,
  formatPrice,
  onChange,
  value,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <label htmlFor={id} className="w-full relative block cursor-text">
      {/* RSD Symbol */}
      {formatPrice && (
        <span className="absolute top-5 left-2 text-neutral-700 font-semibold">
          RSD
        </span>
      )}
      <input
        id={id}
        disabled={disabled}
        placeholder=" "
        type={type}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => setIsFocused(e.target.value.length > 0)}
        value={value}
        className={`peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed ${
          formatPrice ? "pl-12" : "pl-4"
        } border-neutral-300 focus:border-black`}
        onChange={onChange}
        style={{
          appearance: type === "number" ? "textfield" : undefined, // Remove arrows
        }}
      />
      <span
        className={`absolute text-md duration-150 transform -translate-y-5 top-5 z-10 origin-[0] ${
          formatPrice ? "left-12" : "left-4"
        } peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4
          text-zinc-400 ${
            isFocused
              ? "scale-75 -translate-y-4"
              : "peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0"
          }`}
      >
        {label}
      </span>

      {/* Remove Arrows for Number Inputs */}
      <style jsx>{`
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </label>
  );
};

export default CustomInput;
