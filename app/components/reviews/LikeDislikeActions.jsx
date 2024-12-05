"use client";

import useLoginModal from "@/app/hooks/useLoginModal";
import axios from "axios";
import React, { useCallback } from "react";
import toast from "react-hot-toast";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const LikeDislikeActions = ({ review, currentUser }) => {
  const loginModal = useLoginModal();

  const onLike = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    axios
      .patch("/api/reviews/like", {
        id: review?.id,
        action: "like",
        userId: currentUser?.id,
      })
      .then(() => {
        toast.success("Successfully reacted on a review!");
      })
      .catch(() => {
        toast.error("Something went wrong on reaction on review!");
      });
  }, [currentUser, loginModal]);

  const onDislike = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    axios
      .patch("/api/reviews/dislike", {
        id: review?.id,
        action: "dislike",
        userId: currentUser?.id,
      })
      .then(() => {
        toast.success("Successfully reacted on a review!");
      })
      .catch(() => {
        toast.error("Something went wrong on reaction on review!");
      });
  }, [currentUser, loginModal]);

  return (
    <div className="mt-4 flex justify-end space-x-6">
      <button
        onClick={onLike}
        className="flex items-center text-gray-600 hover:text-gray-800"
      >
        <FaThumbsUp className="mr-1" />
        Agree
      </button>
      <button
        onClick={onLike}
        className="flex items-center text-gray-600 hover:text-gray-800"
      >
        <FaThumbsDown className="mr-1" />
        Disagree
      </button>
    </div>
  );
};

export default LikeDislikeActions;
