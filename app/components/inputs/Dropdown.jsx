"use client";

import { useState } from "react";
import CreatableSelect from "react-select/creatable";

const Dropdown = ({
  id,
  label,
  multiSelectedLabel,
  placeholder,
  options,
  register,
  onChange,
  errors,
  required,
  defaultValue,
  translate = {},
  isMulti = false,
}) => {
  const [customOptions, setCustomOptions] = useState(options);
  const [selectedValues, setSelectedValues] = useState(
    Array.isArray(defaultValue)
      ? defaultValue
      : defaultValue
      ? [defaultValue]
      : []
  );

  const formattedOptions = customOptions.map((option) => ({
    value: isMulti ? option.value || option.label : option,
    label:
      translate?.breed?.[isMulti ? option.label : option] ||
      (isMulti ? option.label : option),
    isDisabled: option.isHeader || false,
  }));

  const getDefaultValue = (option) => {
    if (Array.isArray(option)) {
      return option.map((opt) => ({
        value: opt,
        label: translate?.breed?.[opt] || opt,
      }));
    }
    return { value: option, label: translate?.breed?.[option] || option };
  };

  const handleChange = (selectedOption) => {
    if (onChange) {
      if (isMulti) {
        setSelectedValues(
          selectedOption ? selectedOption.map((opt) => opt.value) : []
        );
        onChange(selectedOption ? selectedOption.map((opt) => opt.value) : []);
      } else {
        setSelectedValues([selectedOption?.value || ""]);
        onChange(selectedOption?.value || "");
      }
    }
  };

  const handleCreate = (inputValue) => {
    const newOption = { value: inputValue, label: inputValue };
    setCustomOptions([...customOptions, isMulti ? newOption : inputValue]);
    setSelectedValues([...selectedValues, inputValue]);
    if (onChange) {
      onChange([...selectedValues, inputValue]);
    }
  };

  return (
    <div className="w-full relative">
      <label
        className={`absolute text-md duration-150 transform -translate-y-5 top-5 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${
          errors?.[id] ? "text-red-700" : "text-zinc-400"
        }`}
      >
        {isMulti && selectedValues?.length > 0 ? multiSelectedLabel : label}
      </label>
      <CreatableSelect
        id={id}
        {...register(id, { required })}
        options={formattedOptions}
        isMulti={isMulti}
        value={formattedOptions.filter((opt) =>
          selectedValues.includes(opt.value)
        )}
        defaultValue={defaultValue ? getDefaultValue(defaultValue) : null}
        placeholder={placeholder || "Select..."}
        formatCreateLabel={(inputValue) =>
          `${translate.addOption || "Dodaj opciju"}: "${inputValue}"`
        }
        onChange={handleChange}
        onCreateOption={handleCreate}
        classNames={{
          control: () => "p-3 border-2",
          input: () => "text-lg",
          option: () => "text-lg",
        }}
        components={{
          ClearIndicator: () => <div hidden></div>,
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
          multiValue: (provided) => ({
            ...provided,
            backgroundColor: "#e0e0e0",
          }),
        }}
      />
    </div>
  );
};

export default Dropdown;
