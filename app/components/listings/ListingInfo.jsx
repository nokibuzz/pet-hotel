"use client";

import useCountries from "@/app/hooks/useCountries";
import Avatar from "../Avatar";
import ListingCategory from "./ListingCategory";
import dynamic from "next/dynamic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCcVisa,
  faCcMastercard,
  faCcAmex,
} from "@fortawesome/free-brands-svg-icons";
import { faMoneyBillWave } from "@fortawesome/free-solid-svg-icons";

const Map = dynamic(() => import("../Map"), { ssr: false });

const ListingInfo = ({
  user,
  description,
  guestCount,
  roomCount,
  category,
  latlng,
  houseRules,
}) => {
  return (
    <div className="col-span-4 flex flex-col gap-8">
      {category && (
        <>
          <ListingCategory
            icon={category.icon}
            label={category.label}
            description={category.description}
          />
          <hr />
        </>
      )}
      <div className="text-lg font-light text-neutral-500">{description}</div>
      <hr />
      <Map center={latlng} />
      <hr />
      <div className="text-xl font-semibold flex flex-row items-center gap-2">
        <div>House rules</div>
      </div>
      <div className="col-span-4 flex gap-8">
        <div className="flex-1">
          Check-In <b>{houseRules.checkInTime}</b>
        </div>
        <div className="flex-1">
          Check-Out <b>{houseRules.checkOutTime}</b>
        </div>
      </div>
      <div className="col-span-4 flex gap-8">
        <div className="flex-1">Cancelation policy</div>
        {houseRules.hasCancelation ? (
          <div className="flex-1">
            <b>Has free cancelation</b>
          </div>
        ) : (
          <div className="flex-1">
            <b>Cancelation not possible</b>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-8">
        <div className="flex items-center justify-start">Payment methods</div>
        <div className="flex flex-col gap-2">
          {houseRules.paymentMethodsCards && (
            <div className="flex gap-2">
              <FontAwesomeIcon icon={faCcVisa} size="2x" color="#1A1F71" />
              <FontAwesomeIcon
                icon={faCcMastercard}
                size="2x"
                color="#F3C419"
              />
              <FontAwesomeIcon icon={faCcAmex} size="2x" color="#3E6CC1" />
            </div>
          )}
          {houseRules.paymentMethodsCash && (
            <div className="flex gap-2">
              <FontAwesomeIcon icon={faMoneyBillWave} size="2x" color="green" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingInfo;
