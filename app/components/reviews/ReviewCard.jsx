"use client";

import React from "react";
import ReviewUserInfo from "./ReviewUserInfo";
import ReviewDetails from "./ReviewDetails";
import LikeDislikeActions from "./LikeDislikeActions";

const ReviewCard = ({ review, currentUser }) => {
  return (
    <div className="bg-white rounded-lg border shadow-md p-6 md:p-8 max-w-2xl mx-auto mb-6">
      <ReviewUserInfo user={review.user} />
      <hr className="my-4 border-gray-300" />
      <ReviewDetails review={review} />
      <LikeDislikeActions review={review} currentUser={currentUser} />
    </div>
  );
};

export default ReviewCard;
