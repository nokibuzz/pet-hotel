"use client";

const TextArea = ({
  id,
  label,
  defaultNumberOfRows,
  placeholder,
  disabled,
  required,
  register,
  errors,
}) => {
  return (
    <div className="w-full relative">
      <textarea
        id={id}
        disabled={disabled}
        {...register(id, { required })}
        placeholder={placeholder}
        rows={defaultNumberOfRows}
        className={`peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed pl-4 ${
          errors[id] ? "border-red-700" : "border-neutral-300"
        } ${errors[id] ? "focus:border-red-700" : "focus:border-black"}`}
      />
      <label
        className={`absolute text-md duration-150 transform -translate-y-7 top-7 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 ${
          errors[id] ? "text-red-700" : "text-zinc-400"
        }`}
      >
        {label}
      </label>
    </div>
  );
};

export default TextArea;
