
import { useState } from 'react';
import type { Location } from '../types';

interface GeolocationState {
  loading: boolean;
  error: string | null;
  location: Location | null;
  getLocation: () => void;
}

const useGeolocation = (): GeolocationState => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<Location | null>(null);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocalización no es soportada por este navegador.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError(`Error al obtener la ubicación: ${err.message}`);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return { loading, error, location, getLocation };
};

export default useGeolocation;
