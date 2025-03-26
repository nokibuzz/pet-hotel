"use client";

import { PAYMENT_OPTIONS } from "@/app/utils/PetConstants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

const ReservationInfoPaymentView = ({ paymentMethod }) => {
  const [method, setMethod] = useState(null);
  useEffect(() => {
    const paymentM = PAYMENT_OPTIONS.find(
      (option) => option.label === paymentMethod
    );
    setMethod(paymentM);
  }, [paymentMethod]);

  return (
    <div className="flex flex-col items-center gap-2 p-3 border rounded-lg shadow-sm bg-white">
      {/* Type and breed */}
      <div className="flex items-center gap-2">
        {method?.icon && (
          <FontAwesomeIcon
            icon={method?.icon}
            size="2xl"
            className="text-neutral-500"
          />
        )}
        <div>
          <p className="font-semibold text-gray-800">{method?.label}</p>
        </div>
      </div>

      <hr className="w-full" />

      {/* Description */}
      <div className="text-center sm:text-right">
        <p className="text-sm">{method?.description}</p>
      </div>
    </div>
  );
};

export default ReservationInfoPaymentView;
