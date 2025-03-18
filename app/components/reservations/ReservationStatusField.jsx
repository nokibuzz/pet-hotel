"use client";

const ReservationStatusField = ({ status }) => {
  const approved = status === "approved";

  return (
    <div
      className={`border-2 rounded-lg shadow-sm p-2 flex items-center justify-center gap-2 
        ${approved ? `bg-green-500` : "bg-red-500"}
      `}
    >
      <span className="text-white">{status.toUpperCase()}</span>
    </div>
  );
};

export default ReservationStatusField;
