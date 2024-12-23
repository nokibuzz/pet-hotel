"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const ImageGallery = ({ images, slideAutomatically = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    const id = setInterval(() => {
      slideToNextImage();
    }, 10000);
    setIntervalId(id);

    return () => clearInterval(id);
  }, [images.length]);

  const slideToNextImage = () => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      setTransitioning(false);
    }, 400);
  };

  const slideToPrevImage = () => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + images.length) % images.length
      );
      setTransitioning(false);
    }, 400);
  };

  const handlePreviewClick = (index) => {
    clearInterval(intervalId);
    setCurrentIndex(index);
  };

  const getNextImages = () => {
    if (images.length <= 3) {
      return images.filter((_, idx) => idx !== currentIndex);
    }
    const nextImages = [];
    for (let i = 1; i <= 3; i++) {
      nextImages.push(images[(currentIndex + i) % images.length]);
    }
    return nextImages;
  };

  return (
    <div className="relative w-full h-[60vh]">
      <div
        className="w-full h-full flex transition-transform duration-400 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-full h-full relative overflow-hidden"
          >
            <Image
              alt="Picture"
              src={image}
              fill
              className="object-contain w-full h-full"
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <div
        className="absolute top-1/2 left-4 transform -translate-y-1/2 cursor-pointer z-10"
        onClick={slideToPrevImage}
      >
        <FontAwesomeIcon
          icon={faArrowLeft}
          size="2x"
          className="text-amber-600"
        />
      </div>
      <div
        className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer z-10"
        onClick={slideToNextImage}
      >
        <FontAwesomeIcon
          icon={faArrowRight}
          size="2x"
          className="text-amber-600"
        />
      </div>

      {/* Overview of Next Images */}
      <div className="hidden absolute top-28 right-12 md:flex flex-col space-y-2">
        {getNextImages().map((image, idx) => (
          <div
            key={idx}
            className="w-16 h-16 relative border rounded-lg overflow-hidden cursor-pointer"
            onClick={() =>
              handlePreviewClick((currentIndex + idx + 1) % images.length)
            }
          >
            <Image
              alt={`Preview ${idx}`}
              src={image}
              fill
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
