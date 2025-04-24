"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCertificate, faCheck } from "@fortawesome/free-solid-svg-icons";

const colorCycle = [
  "text-blue-500",
  "text-purple-500",
  "text-amber-500",
  "text-emerald-500",
  "text-rose-500",
  "text-cyan-500",
  "text-green-500",
];

const VerifiedBanner = ({ translation }) => {
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % colorCycle.length);
    }, 2000); // change every 2 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full my-8">
      {/* Top Horizontal Line */}
      <hr className="border-t border-gray-300 mb-4" />

      {/* Centered Content */}
      <div className="flex flex-col items-center justify-center text-center space-y-3">
        <div className="flex items-center space-x-3 text-xl font-semibold">
          {/* Stacked Icons */}
          <span className="fa-stack fa-lg transition-colors duration-1000">
            <FontAwesomeIcon
              icon={faCertificate}
              className={`fa-stack-2x ${colorCycle[colorIndex]} transition-colors duration-1000`}
            />
            <FontAwesomeIcon
              icon={faCheck}
              className="fa-stack-1x text-white"
            />
          </span>
          {/* Text */}{" "}
          <span className="text-gray-800">
            {translation?.verifiedObject ||
              "This object is verified by FurLand!"}
          </span>
        </div>
      </div>

      {/* Bottom Horizontal Line */}
      <hr className="border-t border-gray-300 mt-4" />
    </div>
  );
};

export default VerifiedBanner;
