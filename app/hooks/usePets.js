import { useState } from "react";
import axios from "axios";

const usePets = () => {
  const [pets, setPets] = useState([]);

  const fetchPetsForUser = async (userId) => {
    if (userId) {
      try {
        const response = await axios.get(`/api/pets?userId=${userId}`);
        if (response) {
          setPets(response.data);
        }
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    }
  };

  return {
    fetchPetsForUser,
    pets,
    setPets,
  };
};

export default usePets;
