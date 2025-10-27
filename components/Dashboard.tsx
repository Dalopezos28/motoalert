
import React, { useState, useMemo } from 'react';
import type { Motorcycle } from '../types';
import { MotorcycleStatus } from '../types';
import * as geminiService from '../services/geminiService';
import { AiIcon, SpinnerIcon } from './icons';

// MapView Component (Internal to Dashboard)
const MapView: React.FC<{ motorcycles: Motorcycle[] }> = ({ motorcycles }) => {
    const stolenMotorcycles = motorcycles.filter(m => m.status === MotorcycleStatus.Stolen);

    const bounds = useMemo(() => {
        if (stolenMotorcycles.length === 0) {
            return { minLat: 4.4, maxLat: 4.8, minLon: -74.2, maxLon: -73.9 }; // Default to Bogota area
        }
        const latitudes = stolenMotorcycles.map(m => m.theftLocation.latitude);
        const longitudes = stolenMotorcycles.map(m => m.theftLocation.longitude);
        return {
            minLat: Math.min(...latitudes),
            maxLat: Math.max(...latitudes),
            minLon: Math.min(...longitudes),
            maxLon: Math.max(...longitudes),
        };
    }, [stolenMotorcycles]);

    const getPosition = (lat: number, lon: number) => {
        const latRange = bounds.maxLat - bounds.minLat;
        const lonRange = bounds.maxLon - bounds.minLon;
        // Add a small padding
        const padding = 0.1; 
        const paddedLatRange = latRange + latRange * padding;
        const paddedLonRange = lonRange + lonRange * padding;
        const paddedMinLat = bounds.minLat - (latRange * padding / 2);
        const paddedMinLon = bounds.minLon - (lonRange * padding / 2);

        if (paddedLatRange === 0 || paddedLonRange === 0) return { top: '50%', left: '50%'};

        const top = `${100 - ((lat - paddedMinLat) / paddedLatRange) * 100}%`;
        const left = `${((lon - paddedMinLon) / paddedLonRange) * 100}%`;
        return { top, left };
    };

    return (
        <div className="relative w-full aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden shadow-inner">
            <div className="absolute inset-0 bg-map-pattern opacity-30"></div>
            {stolenMotorcycles.map(motorcycle => {
                const { top, left } = getPosition(motorcycle.theftLocation.latitude, motorcycle.theftLocation.longitude);
                return (
                    <div
                        key={motorcycle.id}
                        className="absolute transform -translate-x-1/2 -translate-y-full group"
                        style={{ top, left }}
                        title={`Placa: ${motorcycle.plate}`}
                    >
                        <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
                        <div className="absolute bottom-full mb-2 w-max px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {motorcycle.plate}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// GeminiAnalysis Component (Internal to Dashboard)
const GeminiAnalysis: React.FC<{ motorcycles: Motorcycle[] }> = ({ motorcycles }) => {
    const [analysis, setAnalysis] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        setLoading(true);
        setError('');
        setAnalysis('');
        try {
            const result = await geminiService.analyzeTheftData(motorcycles.filter(m => m.status === MotorcycleStatus.Stolen));
            setAnalysis(result);
        } catch (err) {
            setError('Error al contactar el servicio de análisis. Intente de nuevo.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-6">
            <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-400 dark:focus:ring-offset-gray-900"
            >
                {loading ? <SpinnerIcon /> : <AiIcon />}
                <span className="ml-2">Generar Análisis de Zonas de Riesgo con IA</span>
            </button>
            {error && <p className="mt-4 text-center text-red-500">{error}</p>}
            {analysis && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg prose dark:prose-invert max-w-none">
                    <h4 className="font-bold">Análisis de IA:</h4>
                    <p className="whitespace-pre-wrap">{analysis}</p>
                </div>
            )}
        </div>
    );
};


// ReportList Component (Internal to Dashboard)
const ReportList: React.FC<{ motorcycles: Motorcycle[] }> = ({ motorcycles }) => {
    return (
        <div className="mt-6 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">Placa</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Estado</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Fecha Reporte</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                                {motorcycles.map((motorcycle) => (
                                    <tr key={motorcycle.id}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">{motorcycle.plate}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${motorcycle.status === MotorcycleStatus.Stolen ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200' : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'}`}>
                                                {motorcycle.status}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{new Date(motorcycle.theftDate).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};


const Dashboard: React.FC<{ motorcycles: Motorcycle[] }> = ({ motorcycles }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Mapa de Robos Activos</h2>
                <MapView motorcycles={motorcycles} />
                 <GeminiAnalysis motorcycles={motorcycles} />
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Últimos Reportes</h2>
                <ReportList motorcycles={motorcycles} />
            </div>
        </div>
    );
};

export default Dashboard;
