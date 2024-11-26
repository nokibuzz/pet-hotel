"use client";

const CategoryInput = ({ label, icon: Icon, onClick, selected }) => {
  return (
    <div
      onClick={() => onClick(label)}
      className={`rounded-xl border-2 p-4 flex flex-col gap-3 hover:border-black transition cursor-pointer ${
        selected ? "border-black" : "border-neutral-200"
      }`}
    >
      <Icon size={30} />
      <div className="font-semibold">{label}</div>
      {/* TODO: add description field */}
    </div>
  );
};

export default CategoryInput;
