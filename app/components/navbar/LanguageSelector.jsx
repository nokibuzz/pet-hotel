"use client";

import Image from "next/image";

const LanguageSelector = ({ onChange }) => (
  <div className="flex justify-end items-center gap-2 p-2 border-b">
    <Image
      src="/images/flags/serbian.png"
      alt="Serbian"
      width="1000"
      height="1000"
      className="w-6 h-4 cursor-pointer hover:opacity-70 hover:scale-110 active:scale-90"
      onClick={() => onChange("sr")}
    />
    <Image
      src="/images/flags/uk.png"
      alt="English"
      width="1000"
      height="1000"
      className="w-6 h-4 cursor-pointer hover:opacity-70 hover:scale-110 active:scale-90"
      onClick={() => onChange("en")}
    />
  </div>
);

export default LanguageSelector;
