"use client";

import React from "react";

const ActionButton = ({
  onClick,
  disabled,
  icon: Icon,
  tooltip,
  variant,
  title,
}) => {
  const baseStyles = `${
    title ? "w-[40%]" : "w-10"
  } h-10 flex items-center justify-center text-white rounded-md transition-transform duration-200 hover:scale-110 hover:cursor-pointer`;
  const variantStyles =
    variant === "approve"
      ? "bg-green-500 hover:bg-green-600"
      : "bg-red-500 hover:bg-red-600";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles}`}
      title={tooltip}
    >
      {Icon && <Icon size={24} />}
      {title}
    </button>
  );
};

export default ActionButton;
