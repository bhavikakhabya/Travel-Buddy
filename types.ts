
export interface UserProfile {
  name: string;
  email: string;
  isFirstLogin: boolean;
  role: 'user' | 'admin';
}

export enum AppScreen {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  TUTORIAL = 'TUTORIAL',
  DASHBOARD = 'DASHBOARD',
}

export interface CitySuggestion {
  name: string;
}

export interface WeatherSummary {
  temperature: string;
  condition: string;
  packingSuggestion: string;
}

export interface Attraction {
  name: string;
  benefit: string;
  imagePrompt: string;
}

export interface ItineraryItem {
  time: string;
  activity: string;
  description: string;
  imagePrompt: string;
}

export interface LocalTips {
  travel: string;
  food: string;
  safety: string;
  culture: string;
}

export interface TravelGuide {
  id: string; // Added ID for saving
  city: string;
  country: string;
  welcomeMessage: string; // Localized greeting
  introduction: string;
  weather: WeatherSummary;
  attractions: Attraction[];
  mapContext: string;
  itinerary: ItineraryItem[];
  tips: LocalTips;
}

export interface SavedTrip extends TravelGuide {
  savedAt: string;
}

export type ThemeColor = 'blue' | 'rose' | 'emerald' | 'violet' | 'amber';
