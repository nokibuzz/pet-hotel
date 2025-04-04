"use client";

import { format } from "date-fns";

const ReservationInfoFieldView = ({
  dateFrom,
  dateTo,
  workDays,
  weekendDays,
  totalPrice,
  translation = {},
}) => {
  const formattedDateFrom = dateFrom
    ? format(new Date(dateFrom), "d.M.yyyy")
    : "N/A";
  const formattedDateTo = dateTo ? format(new Date(dateTo), "d.M.yyyy") : "N/A";

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-3 border rounded-lg shadow-sm bg-white">
      {/* Date Range */}
      <div className="text-center sm:text-left">
        <p className="text-sm text-gray-500">{translation.from || "From"}</p>
        <p className="font-semibold text-gray-800">{formattedDateFrom}</p>
      </div>
      <div className="text-center sm:text-right">
        <p className="text-sm text-gray-500">{translation.to || "To"}</p>
        <p className="font-semibold text-gray-800">{formattedDateTo}</p>
      </div>

      {/* Days Count */}
      <div className="text-center sm:text-right mt-2 sm:mt-0">
        <p className="text-sm text-gray-500">
          {translation.workdays || "Workdays: "}
          <span className="font-semibold text-gray-800">{workDays}</span>
        </p>
        <p className="text-sm text-gray-500">
          {translation.weekends || "Weekends: "}
          <span className="font-semibold text-gray-800">{weekendDays}</span>
        </p>
      </div>

      {/* Total Price */}
      <div className="text-center sm:text-right mt-2 sm:mt-0">
        <p className="text-lg font-semibold text-gray-800">
          {translation.total || "Total: "} {totalPrice} RSD
        </p>
      </div>
    </div>
  );
};

export default ReservationInfoFieldView;
