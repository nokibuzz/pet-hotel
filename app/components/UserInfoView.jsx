"use client";

import Image from "next/image";

const UserInfoView = ({ user }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-3 border rounded-lg shadow-sm bg-white">
      {/* Avatar & Name */}
      <div className="flex items-center gap-2">
        <Image
          src={user?.image || "/images/placeholder.png"}
          alt={user?.name}
          width={50}
          height={50}
          className="rounded-full"
        />
        <div>
          <p className="font-semibold text-gray-800">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      {/* Feedback */}
      <div className="text-center sm:text-right">
        <p className="text-sm text-green-600">
          Positive feedbacks: {user?.positiveFeedbacks ?? 0}
        </p>
        <p className="text-sm text-red-600">
          Negative feedbacks: {user?.negativeFeedbacks ?? 0}
        </p>
      </div>
    </div>
  );
};

export default UserInfoView;
