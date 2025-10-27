
import React, { useState, useEffect, useCallback } from 'react';
import { Motorcycle, MotorcycleStatus } from './types';
import Header from './components/Header';
import ReportForm from './components/ReportForm';
import SearchModule from './components/SearchModule';
import Dashboard from './components/Dashboard';

export type View = 'report' | 'search' | 'dashboard';

const App: React.FC = () => {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [view, setView] = useState<View>('dashboard');

  useEffect(() => {
    try {
      const storedMotorcycles = localStorage.getItem('motorcycles');
      if (storedMotorcycles) {
        setMotorcycles(JSON.parse(storedMotorcycles));
      } else {
        // Add some mock data for initial view
        const mockData: Motorcycle[] = [
           { id: 'BKE543', plate: 'BKE543', status: MotorcycleStatus.Stolen, theftDate: new Date(Date.now() - 86400000 * 2).toISOString(), theftLocation: { latitude: 4.60971, longitude: -74.08175 } },
           { id: 'XYZ789', plate: 'XYZ789', status: MotorcycleStatus.Recovered, theftDate: new Date(Date.now() - 86400000 * 5).toISOString(), theftLocation: { latitude: 4.624335, longitude: -74.063644 }, recoveryDate: new Date(Date.now() - 86400000 * 1).toISOString(), recoveryLocation: { latitude: 4.59813, longitude: -74.07626 } },
           { id: 'JKL123', plate: 'JKL123', status: MotorcycleStatus.Stolen, theftDate: new Date().toISOString(), theftLocation: { latitude: 4.639386, longitude: -74.082413 } },
        ];
        setMotorcycles(mockData);
      }
    } catch (error) {
      console.error("Failed to parse motorcycles from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('motorcycles', JSON.stringify(motorcycles));
    } catch (error) {
      console.error("Failed to save motorcycles to localStorage", error);
    }
  }, [motorcycles]);

  const addMotorcycle = useCallback((motorcycle: Motorcycle) => {
    if (motorcycles.some(m => m.plate.toUpperCase() === motorcycle.plate.toUpperCase())) {
        alert('Error: Ya existe un reporte para esta placa.');
        return false;
    }
    setMotorcycles(prev => [...prev, motorcycle]);
    return true;
  }, [motorcycles]);

  const updateMotorcycle = useCallback((updatedMotorcycle: Motorcycle) => {
    setMotorcycles(prev => prev.map(m => m.id === updatedMotorcycle.id ? updatedMotorcycle : m));
  }, []);

  const renderView = () => {
    switch (view) {
      case 'report':
        return <ReportForm addMotorcycle={addMotorcycle} setView={setView} />;
      case 'search':
        return <SearchModule motorcycles={motorcycles} updateMotorcycle={updateMotorcycle} />;
      case 'dashboard':
      default:
        return <Dashboard motorcycles={motorcycles} />;
    }
  };

  return (
    <div className="min-h-screen font-sans">
      <Header setView={setView} activeView={view} />
      <main className="p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
