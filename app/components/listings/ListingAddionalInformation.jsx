"use client";

import {
  faBone,
  faShower,
  faUserDoctor,
} from "@fortawesome/free-solid-svg-icons";
import ListingAddionalInformationCard from "./ListingAddionalInformationCard";

const ListingAddionalInformation = ({
  hasFood,
  hasGrooming,
  hasVet,
  addionalInformation,
  translation,
}) => {
  return (
    <div className="mt-6">
      <hr />
      <div className="mt-6 flex gap-4 overflow-x-auto hide-scrollbar">
        <ListingAddionalInformationCard
          enabled={hasFood}
          icon={faBone}
          label={translation.food || "Food"}
        />
        <ListingAddionalInformationCard
          enabled={hasGrooming}
          icon={faShower}
          label={translation.grooming || "Grooming"}
        />
        <ListingAddionalInformationCard
          enabled={hasVet}
          icon={faUserDoctor}
          label={translation.veterinarian || "Veterinarian"}
        />
      </div>
      {addionalInformation && (
        <div className="mt-4 grid grid-rows-5 overflow-y-auto">
          <div className="text-neutral-500 font-light">
            {addionalInformation}
          </div>
        </div>
      )}
      <hr />
    </div>
  );
};

export default ListingAddionalInformation;
