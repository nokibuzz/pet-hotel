"use client";

import React from "react";

const ReviewUserInfo = ({ user }) => {
  return (
    <div className="flex items-center space-x-4">
      <img
        src="https://cdn.vectorstock.com/i/1000v/51/87/student-avatar-user-profile-icon-vector-47025187.jpg"
        alt={user.name}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div>
        <h3 className="font-semibold text-lg">{user.name}</h3>
        <p className="text-gray-500 text-sm">
          {user.totalReviews} reviews · {user.likedReviews} liked
        </p>
      </div>
    </div>
  );
};

export default ReviewUserInfo;
