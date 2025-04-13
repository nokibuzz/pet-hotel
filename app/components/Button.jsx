"use client";

const Button = ({ label, onClick, disabled, outline, small, icon: Icon, nowrap }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
    relative disabled:opacity-70 disabled:cursor-not-allowed rounded-lg transition ${
      outline ? "bg-white" : "bg-amber-700"
    } ${outline ? "border-black" : "border-amber-700"} ${
        outline ? "text-black" : "text-white"
      } ${small ? "py-1" : "py-3"} ${small ? "text-sm" : "text-md"} ${
        small ? "w-[30%]" : "w-full"
      } ${small ? "font-light" : "font-semibold"} ${
        small ? "border-[1px]" : "border-2"
      } ${
        small
          ? "hover:bg-amber-700 hover:border-white hover:text-white"
          : "hover:opacity-80"
      }
      ${nowrap ? "min-w-max px-3" : ""}
    `}
    >
      {Icon && <Icon size={24} className="absolute left-4 top-3" />}
      {label}
    </button>
  );
};

export default Button;
