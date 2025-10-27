
import React, { useState } from 'react';
import type { Motorcycle, Location } from '../types';
import { MotorcycleStatus } from '../types';
import useGeolocation from '../hooks/useGeolocation';
import { SpinnerIcon, LocationIcon, SearchIcon } from './icons';

interface SearchModuleProps {
  motorcycles: Motorcycle[];
  updateMotorcycle: (motorcycle: Motorcycle) => void;
}

const MotorcycleCard: React.FC<{ motorcycle: Motorcycle; onRecover: (motorcycle: Motorcycle, location: Location) => void; }> = ({ motorcycle, onRecover }) => {
    const { location, loading, error, getLocation } = useGeolocation();
    const [isRecovering, setIsRecovering] = useState(false);

    const handleMarkAsRecovered = () => {
        setIsRecovering(true);
        getLocation();
    };

    React.useEffect(() => {
        if (location && isRecovering) {
            onRecover(motorcycle, location);
            setIsRecovering(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location, isRecovering]);

    const statusColor = motorcycle.status === MotorcycleStatus.Stolen ? 'text-red-500' : 'text-green-500';
    const bgColor = motorcycle.status === MotorcycleStatus.Stolen ? 'bg-red-50 dark:bg-red-900/30' : 'bg-green-50 dark:bg-green-900/30';

    return (
        <div className={`mt-6 p-5 rounded-lg shadow-md ${bgColor}`}>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Placa: {motorcycle.plate}</h3>
            <p className={`text-lg font-semibold ${statusColor}`}>{motorcycle.status}</p>
            <div className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <p><strong>Fecha de Robo:</strong> {new Date(motorcycle.theftDate).toLocaleString()}</p>
                <p><strong>Ubicación del Robo:</strong> Lat: {motorcycle.theftLocation.latitude.toFixed(4)}, Lon: {motorcycle.theftLocation.longitude.toFixed(4)}</p>
                {motorcycle.status === MotorcycleStatus.Recovered && motorcycle.recoveryDate && motorcycle.recoveryLocation && (
                    <>
                        <p><strong>Fecha de Recuperación:</strong> {new Date(motorcycle.recoveryDate).toLocaleString()}</p>
                        <p><strong>Ubicación de Recuperación:</strong> Lat: {motorcycle.recoveryLocation.latitude.toFixed(4)}, Lon: {motorcycle.recoveryLocation.longitude.toFixed(4)}</p>
                    </>
                )}
            </div>
            {motorcycle.status === MotorcycleStatus.Stolen && (
                <div className="mt-4">
                    <button
                        onClick={handleMarkAsRecovered}
                        disabled={loading}
                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400 dark:focus:ring-offset-gray-900"
                    >
                        {loading ? <SpinnerIcon /> : <LocationIcon />}
                        <span className="ml-2">Marcar como Recuperada (Usar Ubicación Actual)</span>
                    </button>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>
            )}
        </div>
    );
};

const SearchModule: React.FC<SearchModuleProps> = ({ motorcycles, updateMotorcycle }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<Motorcycle | null | undefined>(undefined);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const result = motorcycles.find(m => m.plate.toUpperCase() === searchTerm.toUpperCase());
    setSearchResult(result || null);
  };

  const handleRecover = (motorcycle: Motorcycle, recoveryLocation: Location) => {
    const updatedMotorcycle: Motorcycle = {
      ...motorcycle,
      status: MotorcycleStatus.Recovered,
      recoveryLocation,
      recoveryDate: new Date().toISOString(),
    };
    updateMotorcycle(updatedMotorcycle);
    setSearchResult(updatedMotorcycle); // Update the view immediately
    alert("Estado de la motocicleta actualizado a RECUPERADA.");
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Buscar por Placa</h2>
      <form onSubmit={handleSearch} className="flex space-x-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
          placeholder="Ingrese la placa"
          className="flex-grow px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 flex items-center justify-center border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <SearchIcon />
          <span className="ml-2 hidden sm:inline">Buscar</span>
        </button>
      </form>
      {searchResult === null && (
        <p className="mt-6 text-center text-yellow-600 dark:text-yellow-400 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-md">No se encontraron resultados para la placa "{searchTerm}".</p>
      )}
      {searchResult && <MotorcycleCard motorcycle={searchResult} onRecover={handleRecover} />}
    </div>
  );
};

export default SearchModule;
