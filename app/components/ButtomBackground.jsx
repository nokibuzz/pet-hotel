"use client";

const BottomBackground = () => {
  return (
    <div
      className="fixed bottom-0 sm:w-4/6 w-full h-[12vh] z-10"
      style={{
        backgroundImage: "url(/images/background/bottomBackground.png)",
        backgroundRepeat: "repeat-x",
        backgroundSize: "auto 100%",
      }}
    />
  );
};

export default BottomBackground;
