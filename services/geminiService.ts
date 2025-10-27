
import { GoogleGenAI } from "@google/genai";
import type { Motorcycle } from '../types';

export const analyzeTheftData = async (motorcycles: Motorcycle[]): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API key for Gemini is not configured.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const theftData = motorcycles.map(m => ({
        placa: m.plate,
        fecha: m.theftDate,
        latitud: m.theftLocation.latitude,
        longitud: m.theftLocation.longitude,
    }));
    
    if (theftData.length === 0) {
        return "No hay datos de robos para analizar.";
    }

    const prompt = `
      Eres un analista de seguridad experto en criminología.
      Basado en los siguientes datos de robos de motocicletas en formato JSON, analiza y describe patrones, identifica las zonas de mayor riesgo (hotspots) y sugiere posibles horarios críticos.
      Proporciona un resumen conciso y claro que pueda ser útil para las autoridades y los ciudadanos.
      No incluyas el JSON de entrada en tu respuesta. Tu respuesta debe ser solo el análisis en texto plano.

      Datos:
      ${JSON.stringify(theftData, null, 2)}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get analysis from AI service.");
    }
};
