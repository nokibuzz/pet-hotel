'use client';

import { logEvent } from '@/app/utils/clientLogger';
import axios from 'axios';
import { useEffect } from 'react';
import toast from "react-hot-toast";

const LocationProvider = ({ currentUser }) => {

  const sendLocationToServer = async (latitude, longitude) => {
    if (!currentUser) {
      return;
    }
    const userId = currentUser.id;
    await axios
      .post(`/api/location`, { userId, latitude, longitude })
      .catch((error) => {
          toast.error("Woof, woof, something went wrong!")
          logEvent({ message: 'Error saving user location:', level: 'error', userId: userId, error: error });
      });
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
            (error) => {
              logEvent({ message: 'Error saving user location:', level: 'error', userId: currentUser?.id, error: error });
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
