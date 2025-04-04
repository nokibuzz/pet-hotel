"use client";

import { format, eachDayOfInterval, isWeekend } from "date-fns";
import { useState, useEffect } from "react";
import { ALL_PET_CATEGORIES } from "../utils/PetConstants";

const ReservationInfoField = ({
  dateFrom,
  dateTo,
  types,
  typeId,
  onTotalPriceChange,
  onSelectedDateChanged,
  showDates = true,
  showPricing = true,
  translation = {},
}) => {
  const [totalPrice, setTotalPrice] = useState(0);

  // Format the dates if they exist, otherwise show "N/A"
  const formattedDateFrom = dateFrom
    ? format(new Date(dateFrom), "d.M.yyyy")
    : "N/A";
  const formattedDateTo = dateTo ? format(new Date(dateTo), "d.M.yyyy") : "N/A";

  // Function to calculate workdays and weekends
  const calculateDays = (start, end) => {
    if (!start || !end) return { workDays: 0, weekendDays: 0 };

    const allDays = eachDayOfInterval({
      start: new Date(start),
      end: new Date(end),
    });

    const workDays = allDays.filter((day) => !isWeekend(day)).length;
    const weekendDays = allDays.length - workDays;

    return { workDays, weekendDays };
  };

  // Function to find pricing based on typeId, fallback to typeId: TOTAL
  const findPricingByTypeId = (types, typeId) => {
    let pricing =
      types.find((p) => p.id === typeId) ||
      types.find((p) => p.id === ALL_PET_CATEGORIES);

    return pricing
      ? {
          defaultPrice: pricing.defaultPrice,
          weekendPrice: pricing.weekendPrice,
        }
      : { defaultPrice: 0, weekendPrice: 0 }; // Default prices if no match
  };

  // Effect to calculate total price and send it to parent
  useEffect(() => {
    const calculatedTotalPrice =
      workDays * defaultPrice + weekendDays * weekendPrice;

    setTotalPrice(calculatedTotalPrice);
    if (onTotalPriceChange) {
      onTotalPriceChange(calculatedTotalPrice); // Send price to parent
    }

    if (onSelectedDateChanged) {
      onSelectedDateChanged(workDays, weekendDays);
    }
  }, [dateFrom, dateTo, typeId, onTotalPriceChange, onSelectedDateChanged]);

  const { workDays, weekendDays } = calculateDays(dateFrom, dateTo);
  const { defaultPrice, weekendPrice } = findPricingByTypeId(types, typeId);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-3 border rounded-lg shadow-sm bg-white">
      {showDates && (
        <>
          {/* Date Range */}
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-500">
              {translation.from || "From"}
            </p>
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
              <span className="font-semibold text-gray-800">
                {workDays} × ${defaultPrice}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              {translation.weekends || "Weekends: "}
              <span className="font-semibold text-gray-800">
                {weekendDays} × ${weekendPrice}
              </span>
            </p>
          </div>
        </>
      )}

      {showPricing && (
        <>
          {/* Total Price */}
          <div className="text-center sm:text-right mt-2 sm:mt-0">
            <p className="text-lg font-semibold text-green-600">
              {translation.total || "Total: "} {totalPrice} RSD
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ReservationInfoField;
