"use client";

import useLoginModal from "@/app/hooks/useLoginModal";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const LikeDislikeActions = ({ review, currentUser }) => {
  const loginModal = useLoginModal();
  const router = useRouter();
  const [reaction, setReaction] = useState(null);

  const handleReaction = (action) => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    axios
      .post("/api/reviews/like", {
        id: review?.id,
        action,
        userId: currentUser?.id,
      })
      .then(() => {
        toast.success(
          `You ${action === "like" ? "liked" : "disliked"} the review!`
        );
        setReaction(reaction === action ? null : action);
        router.refresh();
      })
      .catch((e) => {
        toast.error("Something went wrong!", e);
      });
  };

  useEffect(() => {
    if (currentUser) {
      axios
        .get(`/api/reviews/reaction?reviewId=${review?.id}`)
        .then((res) => setReaction(res.data.reaction))
        .catch(() => setReaction(null));
    }
  }, [currentUser, review?.id]);

  return (
    <div className="mt-4 flex justify-end space-x-6">
      {review?.user.id !== currentUser?.id && (
        <>
          <div className="flex justify-normal">
            <button
              onClick={() => handleReaction("like")}
              className={`flex items-center ${
                reaction === "like" ? "text-green-600" : "text-gray-600"
              } hover:text-green-800`}
            >
              <FaThumbsUp />
              <div className="ml-1">Agree ({review.likes})</div>
            </button>
          </div>
          <div className="flex justify-normal">
            <button
              onClick={() => handleReaction("dislike")}
              className={`flex items-center ${
                reaction === "dislike" ? "text-red-600" : "text-gray-600"
              } hover:text-red-800`}
            >
              <FaThumbsDown className="mr-1" />
              <div className="ml-1">Disagree ({review.dislikes})</div>
            </button>
          </div>
        </>
      )}
      {review?.user.id === currentUser?.id && (
        <>
          <div className="flex justify-normal">
            <div className="flex items-center text-gray-600">
              <FaThumbsUp />
              <div className="ml-1">{review.likes} agreed with you</div>
            </div>
          </div>
          <div className="flex justify-normal">
            <div className="flex items-center text-gray-600">
              <FaThumbsDown className="mr-1" />
              <div className="ml-1">{review.dislikes} disagreed with you</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LikeDislikeActions;
