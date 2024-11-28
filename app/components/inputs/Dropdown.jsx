"use client";

import Select from "react-select";

const Dropdown = ({
  id,
  label,
  placeholder,
  options,
  register,
  onChange,
  errors,
  required,
}) => {
  const formattedOptions = options.map((option) => ({
    value: option,
    label: option,
  }));

  const handleChange = (selectedOption) => {
    if (onChange) {
      onChange(selectedOption?.value || "");
    }
  };

  return (
    <div className="w-full relative">
      <label
        className={`absolute text-md duration-150 transform -translate-y-5 top-5 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${
          errors[id] ? "text-red-700" : "text-zinc-400"
        }`}
      >
        {label}
      </label>
      <Select
        id={id}
        {...register(id, { required })}
        options={formattedOptions}
        placeholder={placeholder || "Select..."}
        onChange={(selectedOption) => handleChange(selectedOption)}
        classNames={{
          control: () => "p-3 border-2",
          input: () => "text-lg",
          option: () => "text-lg",
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            primary: "black",
            primary25: "#c47118",
          },
        })}
        styles={{
          menu: (provided) => ({
            ...provided,
            zIndex: 9999,
          }),
        }}
      />
    </div>
  );
};

export default Dropdown;
