"use client";

const InputWithSeparateLabel = ({ title, subtitle, onChange }) => {
  return (
    <div className="flex flex-row items-center justify-between gap-1">
      <div className="flex flex-col">
        <div className="font-medium">{title}</div>
        <div className="font-light text-gray-600">{subtitle}</div>
      </div>
      <div className="flex flex-row items-center gap-4">
        <input
          type="number"
          //   value={value}
          onChange={onChange}
          className="peer p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed border-neutral-300 focus:border-black"
        />
      </div>
    </div>
  );
};

export default InputWithSeparateLabel;
