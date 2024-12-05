"use client";

import React, { useState } from "react";
import { FaSmile, FaFrown } from "react-icons/fa";
import RatingView from "../RatingView";

const ReviewDetails = ({ review }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <div>
      <h4 className="font-semibold text-xl">{review.title}</h4>
      {/* <p className="text-gray-400 text-sm">{review.createdAt}</p> */}
      <div className="mt-4">
        <RatingView rating={review.overallRating} size="large" />
      </div>

      {expanded && (
        <div className="mt-6 space-y-4">
          <hr />
          <div className="flex items-start mt-4">
            <FaSmile className="text-green-600 mr-2" size={20} />
            <p className="text-gray-700">{review.positiveReview}</p>
          </div>
          <div className="flex items-start">
            <FaFrown className="text-red-600 mr-2" size={20} />
            <p className="text-gray-700">{review.negativeReview}</p>
          </div>
          <hr />
          <div>
            <div className="text-md font-semibold">Location:</div>
            <RatingView rating={review.locationRating} />
          </div>
          <div>
            <div className="text-md font-semibold">Service:</div>
            <RatingView rating={review.serviceRating} />
          </div>
          <div>
            <div className="text-md font-semibold">Check-In:</div>
            <RatingView rating={review.checkInRating} />
          </div>
        </div>
      )}

      <button
        className="mt-4 text-blue-600 hover:underline text-sm"
        onClick={toggleExpanded}
      >
        {expanded ? "Show less" : "Show more"}
      </button>
    </div>
  );
};

export default ReviewDetails;
