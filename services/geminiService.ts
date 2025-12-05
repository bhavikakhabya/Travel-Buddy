
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { TravelGuide, CitySuggestion } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schema for fetching cities
const citiesSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    cities: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
        },
        required: ['name'],
      },
    },
  },
  required: ['cities'],
};

// Schema for the full travel guide
const guideSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    city: { type: Type.STRING },
    country: { type: Type.STRING },
    welcomeMessage: { 
      type: Type.STRING, 
      description: "A warm, traditional welcome greeting strictly in the LOCAL language/dialect of the city. e.g. 'Padharo Mhare Desh' for Jaipur, 'Bonjour' for Paris. If the language is unknown or unsupported, fallback to English." 
    },
    introduction: { type: Type.STRING, description: "2-3 fun, relatable Gen-Z sentences but strictly respectful of the country's traditions." },
    weather: {
      type: Type.OBJECT,
      properties: {
        temperature: { type: Type.STRING, description: "Typical temp in Celsius for this season" },
        condition: { type: Type.STRING, description: "e.g., Sunny, Rainy" },
        packingSuggestion: { type: Type.STRING },
      },
      required: ['temperature', 'condition', 'packingSuggestion']
    },
    attractions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          benefit: { type: Type.STRING, description: "Short benefit" },
          imagePrompt: { type: Type.STRING, description: "Aesthetic illustration prompt for this attraction" },
        },
        required: ['name', 'benefit', 'imagePrompt']
      },
      description: "Top 5 attractions"
    },
    mapContext: { type: Type.STRING, description: "Nearby areas and accessibility info, no URLs" },
    itinerary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          time: { type: Type.STRING },
          activity: { type: Type.STRING },
          description: { type: Type.STRING },
          imagePrompt: { type: Type.STRING, description: "Visual prompt for this activity" },
        },
        required: ['time', 'activity', 'description', 'imagePrompt']
      },
      description: "1-Day suggested itinerary"
    },
    tips: {
      type: Type.OBJECT,
      properties: {
        travel: { type: Type.STRING },
        food: { type: Type.STRING },
        safety: { type: Type.STRING },
        culture: { type: Type.STRING },
      },
      required: ['travel', 'food', 'safety', 'culture']
    }
  },
  required: ['city', 'country', 'welcomeMessage', 'introduction', 'weather', 'attractions', 'mapContext', 'itinerary', 'tips']
};

export const fetchCitiesForCountry = async (country: string): Promise<CitySuggestion[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `List the major tourist cities in ${country}. Provide a comprehensive list of popular destinations.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: citiesSchema,
      },
    });

    const data = JSON.parse(response.text || '{ "cities": [] }');
    return data.cities;
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
};

export const generateCityGuide = async (city: string, country: string, currency: string = 'USD'): Promise<TravelGuide | null> => {
  try {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const prompt = `
      Create a comprehensive travel guide for ${city}, ${country} for travel in ${currentMonth}.
      The user's preferred currency is ${currency}.
      
      Tone & Language requirements:
      - Welcome Message: PRIORITY: Generate the welcome message in the LOCAL language of ${city}. Example: 'Padharo Mhare Desh' for Jaipur, 'Willkommen' for Berlin, 'Konnichiwa' for Tokyo. If the local language is not supported or cannot be determined, DEFAULT GRACEFULLY to English (e.g., "Welcome to ${city}").
      - Introduction: 2-3 fun, relatable Gen-Z sentences but strictly respectful of ${country}'s traditions.
      - Itinerary: Activity names and descriptions should use the LOCAL language/dialect where possible for authenticity, followed immediately by the English translation in parentheses. Example: "Senso-ji (Senso-ji Temple)". If not possible, use English.
      - General: The content should be rich with visuals (via prompts), clean, and act like a personalized travel buddy.
      - Costs: Where appropriate (in tips or attraction benefits), mention estimated costs in ${currency}.
      
      Requirements:
      1. Provide a traditional Welcome Message (Local language with English fallback).
      2. Provide TYPICAL weather data for ${currentMonth} (Temperature, Condition).
      3. Recommend top 5 attractions with aesthetic image prompts.
      4. Suggest a 1-day itinerary with localized activity names/descriptions (English in brackets). include 'imagePrompt' for each item.
      5. Provide local tips (include estimated food/travel costs in ${currency} if relevant).
    `;

    // Note: Removed googleSearch tool because it conflicts with responseSchema/responseMimeType: "application/json"
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: guideSchema,
      },
    });

    if (!response.text) return null;
    return JSON.parse(response.text) as TravelGuide;
  } catch (error) {
    console.error("Error generating guide:", error);
    throw error;
  }
};
