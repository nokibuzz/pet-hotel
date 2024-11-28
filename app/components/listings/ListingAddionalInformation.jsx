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
}) => {
  return (
    <div className="mt-6">
      <hr />
      <div className="mt-6 flex gap-4">
        <ListingAddionalInformationCard
          enabled={hasFood}
          icon={faBone}
          label="Food"
        />
        <ListingAddionalInformationCard
          enabled={hasGrooming}
          icon={faShower}
          label="Grooming"
        />
        <ListingAddionalInformationCard
          enabled={hasVet}
          icon={faUserDoctor}
          label="Veterinarian"
        />
      </div>
      {addionalInformation && (
        <div className="mt-4">
          <div className="text-neutral-500 font-light">
            {addionalInformation}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingAddionalInformation;
