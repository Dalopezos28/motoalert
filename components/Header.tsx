
import React from 'react';
import type { View } from '../App';
import { MotorcycleIcon } from './icons';

interface HeaderProps {
  setView: (view: View) => void;
  activeView: View;
}

const Header: React.FC<HeaderProps> = ({ setView, activeView }) => {
  const navItems: { key: View; label: string }[] = [
    { key: 'dashboard', label: 'Panel Principal' },
    { key: 'report', label: 'Reportar Robo' },
    { key: 'search', label: 'Buscar Placa' },
  ];

  const getNavItemClass = (view: View) => {
    const baseClass = "text-sm sm:text-base font-medium px-3 sm:px-4 py-2 rounded-md transition-colors duration-200";
    if (view === activeView) {
      return `${baseClass} bg-blue-600 text-white`;
    }
    return `${baseClass} text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700`;
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <MotorcycleIcon className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
              Moto Alerta
            </h1>
          </div>
          <nav className="flex items-center space-x-1 sm:space-x-2">
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => setView(item.key)}
                className={getNavItemClass(item.key)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
