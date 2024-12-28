'use client';

import { useEffect, useState } from "react";

const CustomBackground = () => {
  const [pawprints, setPawprints] = useState([]);

  useEffect(() => {
    const numPawprints = 20;
    const generatedPawprints = [];

    const getRandomPosition = () => `${Math.random() * 100}vw ${Math.random() * 100}vh`;
    const getRandomSize = () => Math.random() * 50 + 50;

    for (let i = 0; i < numPawprints; i++) {
      generatedPawprints.push({
        position: getRandomPosition(),
        size: getRandomSize(),
        image: `/images/background/slide${(i % 9) + 1}.png`,
      });
    }

    setPawprints(generatedPawprints);
  }, []);

  return (
    <div className="pawprints-background">
      {pawprints.map((pawprint, index) => (
        <img
          key={index}
          src={pawprint.image}
          alt={`Pawprint ${index}`}
          className="pawprint"
          style={{
            position: "absolute",
            top: pawprint.position.split(" ")[1],
            left: pawprint.position.split(" ")[0],
            width: `${pawprint.size}px`,
            height: `${pawprint.size}px`,
            transform: `rotate(${pawprint.rotation})`,
          }}
        />
      ))}
    </div>
  );
};

export default CustomBackground;
