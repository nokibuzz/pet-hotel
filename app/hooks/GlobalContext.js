"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("selectedPet")) || null;
    }
    return null;
  });

  useEffect(() => {
    if (selectedPet)
      localStorage.setItem("selectedPet", JSON.stringify(selectedPet));
  }, [selectedPet]);

  // Fetch pets
  const fetchPetsForUser = async (userId) => {
    if (userId) {
      try {
        const response = await axios.get(`/api/pets?userId=${userId}`);
        if (response.data) {
          setPets(response.data);
          if (selectedPet === null && response.data.length > 0) {
            setSelectedPet(response.data[0]); // Default to first pet
          }
        }
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        pets,
        setPets,
        selectedPet,
        setSelectedPet,
        fetchPetsForUser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// Custom Hook to Access Global Context
export const useGlobal = () => useContext(GlobalContext);
