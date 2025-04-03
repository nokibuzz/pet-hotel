"use client";

import BottomBackground from "./ButtomBackground";
import CustomBackground from "./CustomBackground";

const CustomContainer = ({ children }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr,4fr,1fr] w-full overflow-x-hidden overflow-y-hidden mx-auto">
      <div className="hidden sm:block">
        <BottomBackground />
      </div>

      <div className="w-full bg-white">
        {children}
        <BottomBackground />
      </div>

      <div className="hidden sm:block">
        <BottomBackground />
      </div>
    </div>
  );
};

export default CustomContainer;
