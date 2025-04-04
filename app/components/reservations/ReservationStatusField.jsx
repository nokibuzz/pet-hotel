"use client";

const ReservationStatusField = ({ status, translate = {} }) => {
  const bgColor =
    {
      approved: "bg-green-500",
      rejected: "bg-red-500",
      pending: "bg-gray-500",
    }[status] || "bg-blue-500";

  return (
    <div
      className={`border-2 rounded-lg shadow-sm p-2 flex items-center justify-center gap-2 
        ${bgColor}
      `}
    >
      <span className="text-white">
        {translate?.[status] || status.toUpperCase()}
      </span>
    </div>
  );
};

export default ReservationStatusField;
