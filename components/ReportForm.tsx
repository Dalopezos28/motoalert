
import React, { useState } from 'react';
import type { Motorcycle, Location } from '../types';
import { MotorcycleStatus } from '../types';
import useGeolocation from '../hooks/useGeolocation';
import { LocationIcon, SpinnerIcon } from './icons';
import type { View } from '../App';

interface ReportFormProps {
  addMotorcycle: (motorcycle: Motorcycle) => boolean;
  setView: (view: View) => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ addMotorcycle, setView }) => {
  const [plate, setPlate] = useState('');
  const [theftLocation, setTheftLocation] = useState<Location | null>(null);
  const { location, loading, error, getLocation } = useGeolocation();

  React.useEffect(() => {
    if (location) {
      setTheftLocation(location);
    }
  }, [location]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate || !theftLocation) {
      alert('Por favor, ingrese la placa y obtenga la ubicación.');
      return;
    }
    
    const newMotorcycle: Motorcycle = {
      id: plate.toUpperCase(),
      plate: plate.toUpperCase(),
      status: MotorcycleStatus.Stolen,
      theftLocation,
      theftDate: new Date().toISOString(),
    };
    
    const success = addMotorcycle(newMotorcycle);
    if(success) {
      alert('Motocicleta reportada con éxito.');
      setPlate('');
      setTheftLocation(null);
      setView('dashboard');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Reportar Motocicleta Robada</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="plate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Placa de la Motocicleta
          </label>
          <input
            type="text"
            id="plate"
            value={plate}
            onChange={(e) => setPlate(e.target.value.toUpperCase())}
            placeholder="Ej: ABC-123"
            required
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
        
        <div>
          <button
            type="button"
            onClick={getLocation}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 dark:focus:ring-offset-gray-900 transition"
          >
            {loading ? <SpinnerIcon /> : <LocationIcon />}
            <span className="ml-2">Obtener Ubicación Actual del Robo</span>
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {theftLocation && (
          <div className="p-4 bg-green-100 dark:bg-green-900/50 rounded-md text-sm text-green-800 dark:text-green-200">
            <p className="font-semibold">Ubicación capturada con éxito:</p>
            <p>Latitud: {theftLocation.latitude.toFixed(5)}</p>
            <p>Longitud: {theftLocation.longitude.toFixed(5)}</p>
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={!plate || !theftLocation}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 dark:focus:ring-offset-gray-900 transition"
          >
            Enviar Reporte
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;
