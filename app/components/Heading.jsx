"use client";

const Heading = ({ title, subtitle, center, rightComponent }) => {
  return (
    <div className="flex flex-row justify-between">
      <div className={`${center ? "text-center" : "text-start"} flex-[7]`}>
        <div className="text-2xl font-bold">{title}</div>
        <div className="font-light text-neutral-500 mt-2">{subtitle}</div>
      </div>
      {rightComponent && <div className="flex-[3]">{rightComponent}</div>}
    </div>
  );
};

export default Heading;
