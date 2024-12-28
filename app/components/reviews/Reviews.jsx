"use client";

import { useState } from "react";
import ReviewCard from "./ReviewCard";
import Button from "../Button";
import useReviewModal from "@/app/hooks/useReviewModal";

const Reviews = ({
  reviews,
  totalReviews,
  currentUser,
  listingUser,
  translation,
}) => {
  const reviewModal = useReviewModal();

  const [visibleReviews, setVisibleReviews] = useState(5);

  const loadMoreReviews = () => {
    setVisibleReviews((prev) => prev + 5);
  };

  return (
    <div>
      <div className="flex flex-row justify-between mb-4">
        <div className="text-xl font-bold pt-2">
          {translation.reviews || "Reviews"}
        </div>
        {/* Show button only if user existis and he is not owner of the listing */}
        {currentUser && currentUser.id !== listingUser && (
          <div
            onClick={() => reviewModal.onOpen(translation)}
            className="md:block text-sm font-semibold py-3 px-4 mx-1 outline outline-1 rounded-full hover:bg-neutral-100 text-amber-600 transition cursor-pointer"
          >
            {translation.button || "Leave review"}
          </div>
        )}
      </div>
      <div className="space-y-6 mt-4">
        {reviews.slice(0, visibleReviews).map((review) => (
          <div key={review.id}>
            <ReviewCard review={review} currentUser={currentUser} />
          </div>
        ))}
        {visibleReviews < reviews.length && (
          <Button
            outline
            label={translation.button || "Load more"}
            onClick={loadMoreReviews}
          />
        )}
      </div>
    </div>
  );
};

export default Reviews;
