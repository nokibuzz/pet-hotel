"use client";

const Heading2 = ({ title, subtitle, center }) => {
  return (
    <header
      className={`${
        center ? "text-center" : "text-start"
      } text-center py-6 bg-white shadow-md rounded-md`}
    >
      <h1 className="text-2xl md:text-4xl font-bold text-amber-600">{title}</h1>
      <p className="text-gray-600">{subtitle}</p>
    </header>
  );
};

export default Heading2;
