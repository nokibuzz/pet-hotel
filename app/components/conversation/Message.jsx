"use client";

import React from 'react';

const Message = ({ 
  message,
  owner
}) => {

  return (
    <div className={`w-full flex ${owner ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[60%] p-3 text-white rounded-lg ${owner ? 'rounded-br-none bg-amber-700' : 'rounded-bl-none bg-gray-500'} break-words h-auto`}>
        {message}
      </div>
    </div>
  );
};

export default Message;