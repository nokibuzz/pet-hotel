import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const SendButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-center rounded-lg hover:opacity-80 transition bg-amber-700 border-amber-700 text-white p-2 w-[50px] h-[50px] font-semibold border-2
        disabled:opacity-70 disabled:cursor-not-allowed
      `}
    >
      <FontAwesomeIcon icon={faPaperPlane} size="lg" className="text-white" />
    </button>
  );
};

export default SendButton;
