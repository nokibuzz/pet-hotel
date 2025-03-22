"use client";

import React, { useEffect, useState, useRef } from "react";
import MessageInput from "./MessageInput";
import Message from "./Message";
import { pusherClient } from "./../../libs/pusher";
import axios from "axios";
import toast from "react-hot-toast";

const Conversation = ({
  reservationId,
  currentUser,
  otherUser,
  translation,
}) => {
  const [messages, setMessages] = useState([]);
  const chatId = `reservation-chat-${reservationId}`;
  const messagesEndRef = useRef(null);

  const loadMessages = async () => {
    try {
      const response = await axios.get(`/api/messages?chatId=${chatId}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Error loading messages", error);
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const onSendMessageHandler = async (message) => {
    axios
      .post(`/api/messages`, {
        chatId: chatId,
        message: {
          senderId: currentUser.id,
          receiverId: otherUser.id,
          content: message,
        },
      })
      .catch(() => {
        toast.error(
          translation.errorSendingMessage || "Woof, woof, something went wrong!"
        );
      })
      .finally(() => {});
  };

  const uniqueMessages = messages.filter(
    (value, index, self) => self.indexOf(value) === index
  );

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadMessages();

    pusherClient.subscribe(chatId);

    pusherClient.bind("upcoming-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => pusherClient.unsubscribe(chatId);
  }, []);

  return (
    <div className="flex items-center justify-center pt-6">
      <div className="max-w-[500px] w-full bg-white rounded-xl border-[1px] border-neutral-200 shadow-lg flex flex-col justify-between">
        <h1 className="p-4 bg-white border-b-[1px] border-neutral-200 text-lg font-semibold">
          {otherUser?.name}
        </h1>

        <div className="w-full h-[40vh] overflow-y-auto p-2 flex flex-col gap-y-4 bg-slate-50">
          {!uniqueMessages.length ? (
            <div className="text-center text-gray-500">
              {translation.noMessages || "No messages yet"}
            </div>
          ) : (
            uniqueMessages.map((message, index) => (
              <Message
                key={index}
                message={message.content}
                owner={currentUser.id === message.senderId}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="sticky bottom-0 px-2 py-1">
          <MessageInput
            onSend={(message) => onSendMessageHandler(message)}
            translation={translation}
            disabled={otherUser === undefined}
          />
        </div>
      </div>
    </div>
  );
};

export default Conversation;
