'use client';

import axios from 'axios';
import { useEffect } from 'react';
import toast from "react-hot-toast";

const LocationProvider = ({ currentUser }) => {

  const sendLocationToServer = async (latitude, longitude) => {
    try {
      if (!currentUser) {
        return;
      }
      const userId = currentUser.id;
      await axios
        .post(`/api/location`, { userId, latitude, longitude })
        .catch(() => {
            toast.error("Woof, woof, something went wrong!")
        })
        .finally(() => {
        });
    } catch (error) {
      console.error('Error saving user location:', error);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                if (currentUser){
                  sendLocationToServer(latitude, longitude); 
                }
            },
            (err) => {
              console.error(err);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            }
          );
    }
  }, []);

  return null;
};

export default LocationProvider;
