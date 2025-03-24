"use client";

import { useState } from "react";
import { BiDollar } from "react-icons/bi";

const Input = ({
  id,
  label,
  type,
  disabled,
  formatPrice,
  placeholder,
  required,
  register,
  errors,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full relative">
      {formatPrice && (
        <BiDollar
          size={24}
          className="text-neutral-700 absolute top-5 left-2"
        />
      )}
      <input
        id={id}
        disabled={disabled}
        {...register(id, { required })}
        placeholder={placeholder}
        type={type}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => setIsFocused(e.target.value.length > 0)}
        className={`peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed ${
          formatPrice ? "pl-9" : "pl-4"
        } ${errors?.[id] ? "border-red-700" : "border-neutral-300"} ${
          errors?.[id] ? "focus:border-red-700" : "focus:border-black"
        }`}
      />
      <label
        className={`absolute text-md duration-150 transform -translate-y-5 top-5 z-10 origin-[0] ${
          formatPrice ? "left-9" : "left-4"
        } ${errors?.[id] ? "text-red-700" : "text-zinc-400"} ${
          isFocused || placeholder
            ? "scale-75 -translate-y-4"
            : "peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0"
        }`}
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
