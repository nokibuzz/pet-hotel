"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ListingCategory = ({ icon: Icon, label, description, translation }) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row items-center gap-4">
        <FontAwesomeIcon icon={Icon} size="lg" className="text-neutral-600" />
        <div className="flex flex-col">
          <div className="text-lg font-semibold">
            {translation?.[label] || label}
          </div>
          <div className="text-neutral-500 font-light">
            {translation?.description?.[label] || description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCategory;
