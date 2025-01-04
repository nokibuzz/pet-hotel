  'use client';

  import { useEffect, useState, useRef } from "react";

  const CustomBackground = () => {
    const [pawprints, setPawprints] = useState([]);
    const containerRef = useRef(null);

    useEffect(() => {
      const numPawprints = 100;
      const generatedPawprints = [];

      const container = containerRef.current;
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;

      const getRandomPosition = () => {
        const x = Math.random() * containerWidth;
        const y = Math.random() * containerHeight;
        return `${x}px ${y}px`;
      };
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
      <div ref={containerRef} className="pawprint-background" >
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
            }}
          />
        ))}
      </div>
    );
  };

  export default CustomBackground;
