"use client";

import React from "react";
import { FaPaw } from "react-icons/fa";

const RatingView = ({ rating, size = "small" }) => {
  const pawSize = size === "large" ? 30 : 20;

  const renderPaws = () => {
    const paws = [];
    for (let i = 0; i < 5; i++) {
      if (rating >= i + 1) {
        paws.push(<FaPaw key={i} className="text-red-600" size={pawSize} />);
      } else if (rating > i && rating < i + 1) {
        paws.push(
          <FaPaw key={i} className="text-red-600 half-filled" size={pawSize} />
        );
      } else {
        paws.push(<FaPaw key={i} className="text-gray-300" size={pawSize} />);
      }
    }
    return paws;
  };

  return <div className="flex space-x-1">{renderPaws()}</div>;
};

export default RatingView;
