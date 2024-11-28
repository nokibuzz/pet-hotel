"use client";

const Radio = ({ options, value, onChange }) => {
  return (
    <div className="flex flex-wrap gap-4">
      {options.map((option) => (
        <label
          key={option.value}
          className={`cursor-pointer px-4 py-2 rounded-full border-2 transition-colors duration-300 ${
            value === option.value
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white text-gray-600 border-gray-300 hover:border-blue-500 hover:text-blue-500"
          }`}
        >
          <input
            type="radio"
            name="fancy-radio"
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="hidden"
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};

export default Radio;
