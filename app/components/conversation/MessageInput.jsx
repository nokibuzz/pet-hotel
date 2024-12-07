"use client";

import React, { useState, useEffect } from 'react';
import SendButton from "./SendButton";

const MessageInput = ({
    value,
    onSend
}) => {
  const [text, setText] = useState(value);

  const handleInputChange = (e) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
    setText(e.target.value);
  };

  const onClick = () => {
    onSend(text);
    setText("");
  }

  useEffect(() => {
    const textarea = document.getElementById("message-input");
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`; 
    }
  }, [text]);

  return (
    <div className="flex items-center gap-x-2 bg-white border-t-[1px] border-neutral-200 p-2">
      <textarea
        id="message-input"
        placeholder='Write a message...'
        className={`w-full border-[1px] border-neutral-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-500 flex w-full resize-none bg-background px-3 py-2 text-sm ring-offset-background overflow-hidden`}
        value={text}
        onChange={handleInputChange}
        rows={1}
      />
      <SendButton onClick={onClick} />
    </div>
  );
};

export default MessageInput;