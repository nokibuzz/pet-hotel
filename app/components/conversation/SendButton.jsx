import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const SendButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-center rounded-lg hover:opacity-80 transition bg-amber-700 text-white w-[40px] h-[100%] p-2 font-semibold border-2
        disabled:opacity-70 disabled:cursor-not-allowed border-white
      `}
    >
      <FontAwesomeIcon icon={faPaperPlane} size="lg" className="text-white" />
    </button>
  );
};

export default SendButton;
