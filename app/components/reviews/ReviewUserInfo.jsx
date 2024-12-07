"use client";

import React from "react";

const ReviewUserInfo = ({ user, currentUser }) => {
  return (
    <div className="flex items-center space-x-4">
      <img
        src={user.imageSrc || "/images/placeholder.png"}
        alt={user.name}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div>
        <h3
          className={`text-lg  ${
            currentUser?.id === user.id ? "text-amber-700" : "text-black"
          } ${currentUser?.id === user.id ? "font-bold" : "font-semibold"}`}
        >
          {currentUser?.id === user.id ? "Me" : user.name}
        </h3>
        <p className="text-gray-500 text-sm">
          {user.totalReviews} reviews · {user.likedReviews} likes
        </p>
      </div>
    </div>
  );
};

export default ReviewUserInfo;
