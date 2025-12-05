
import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Search, MapPin, Globe, Sparkles, ChevronRight, Plane, Banknote, Users } from 'lucide-react';
import { fetchCitiesForCountry, generateCityGuide } from '../services/geminiService';
import { CitySuggestion, TravelGuide } from '../types';
import { CurrencyConverter } from './ui/CurrencyConverter';
import { countries, CountryData, currencies } from '../utils/helpers';

interface PlanTripProps {
  onTripGenerated: (guide: TravelGuide) => void;
  onViewCommunity?: () => void;
}

const trendingDestinations = [
  { name: 'Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=400' },
  { name: 'Italy', image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=400' },
  { name: 'Iceland', image: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&q=80&w=400' },
  { name: 'India', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=400' }
];

export const PlanTrip: React.FC<PlanTripProps> = ({ onTripGenerated, onViewCommunity }) => {
  const [step, setStep] = useState<'COUNTRY' | 'CITY'>('COUNTRY');
  const [country, setCountry] = useState('');
  const [cities, setCities] = useState<CitySuggestion[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<CountryData[]>([]);
  const [bgImage, setBgImage] = useState<string>('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedFlag, setSelectedFlag] = useState<string>('');

  // Update background when country changes significantly or is selected
  useEffect(() => {
    if (step === 'COUNTRY' && !country) {
      setBgImage('');
      setSelectedFlag('');
    } else if (step === 'COUNTRY' && country.length > 3) {
      // Gentle update, in a real app this might be debounced
      const match = countries.find(c => c.name.toLowerCase() === country.toLowerCase());
      if (match) {
        setBgImage(`https://source.unsplash.com/random/1200x800/?${match.name},landscape`);
        if (!selectedFlag) setSelectedFlag(match.flag);
      }
    }
  }, [country, step]);

  const handleCountryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCountry(val);
    
    // Reset flag if user clears input
    if (val === '') setSelectedFlag('');

    if (val.length > 0) {
      setSuggestions(countries.filter(c => c.name.toLowerCase().includes(val.toLowerCase())).slice(0, 8));
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (c: CountryData) => {
    setCountry(c.name);
    setSelectedFlag(c.flag);
    setSuggestions([]);
    setBgImage(`https://source.unsplash.com/random/1200x800/?${c.name},travel`);
  };

  const handleCountrySubmit = async () => {
    if (!country.trim()) return;
    setLoading(true);
    const results = await fetchCitiesForCountry(country);
    setCities(results);
    setLoading(false);
    if (results.length > 0) setStep('CITY');
    setSuggestions([]);
  };

  const handleCitySubmit = async () => {
    if (!selectedCity) return;
    setLoading(true);
    try {
      const result = await generateCityGuide(selectedCity, country, selectedCurrency);
      if (result) {
        // Add a random ID to the result
        result.id = crypto.randomUUID();
        onTripGenerated(result);
      }
    } catch (e) {
      alert("Oops! Something went wrong planning your trip. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTrendingClick = (name: string) => {
    setCountry(name);
    // Find flag
    const match = countries.find(c => c.name === name);
    if (match) setSelectedFlag(match.flag);
    setSuggestions([]);
    setBgImage(`https://source.unsplash.com/random/1200x800/?${name},landscape`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Header Section */}
      <div className="space-y-4 px-2">
        <div className="flex justify-between items-end">
          <div>
             <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Trip Planner</h2>
             <p className="text-slate-500 dark:text-slate-400">Craft your perfect itinerary in seconds.</p>
          </div>
          {step === 'CITY' && (
             <button 
               onClick={() => {
                 setStep('COUNTRY');
                 setCities([]);
               }}
               className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 px-3 py-1.5 rounded-full hover:bg-brand-100 transition-colors"
             >
               CHANGE DESTINATION
             </button>
          )}
        </div>
      </div>

      {/* Main Card */}
      <div className="relative bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden min-h-[400px] transition-all duration-500">
        
        {/* Dynamic Background Image Layer */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${bgImage ? 'opacity-20' : 'opacity-0'}`}>
          <img src={bgImage} alt="Destination" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/90 to-white dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-900"></div>
        </div>

        <div className="relative z-10 p-8 md:p-10 h-full flex flex-col">
          
          {/* Step 1: Country Selection */}
          {step === 'COUNTRY' && (
            <div className="flex-1 flex flex-col space-y-8">
              
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Globe size={14} /> Step 1: Destination
                </label>
                
                <div className="relative group">
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${suggestions.length > 0 || selectedFlag ? 'text-brand-500' : 'text-slate-400'}`}>
                    {selectedFlag ? (
                      <span className="text-3xl leading-none animate-in zoom-in-50 duration-200">{selectedFlag}</span>
                    ) : (
                      <Search size={24} strokeWidth={2.5} />
                    )}
                  </div>
                  <input
                    type="text"
                    value={country}
                    onChange={handleCountryInput}
                    onKeyDown={(e) => e.key === 'Enter' && handleCountrySubmit()}
                    placeholder="Where do you want to go?"
                    className={`w-full ${selectedFlag ? 'pl-16' : 'pl-14'} pr-4 py-5 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-bold text-2xl text-slate-800 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-inner`}
                    autoFocus
                  />
                  
                  {/* Enhanced Suggestions Dropdown */}
                  {suggestions.length > 0 && (
                    <ul className="absolute z-50 w-full mt-3 bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-100 dark:border-slate-700 rounded-2xl shadow-2xl max-h-[300px] overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      {suggestions.map((s) => (
                        <li 
                          key={s.name} 
                          onClick={() => selectSuggestion(s)}
                          className="px-6 py-4 hover:bg-brand-50 dark:hover:bg-brand-900/30 cursor-pointer border-b border-slate-50 dark:border-slate-800/50 last:border-0 transition-colors flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-3xl filter drop-shadow-sm transform group-hover:scale-110 transition-transform">{s.flag}</span>
                            <span className="font-bold text-lg text-slate-700 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{s.name}</span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-500 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

               {/* Currency Selection */}
               <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Banknote size={14} /> Budget Currency
                </label>
                <div className="relative">
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-semibold text-slate-700 dark:text-white appearance-none cursor-pointer"
                  >
                    {currencies.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} ({c.symbol}) - {c.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-brand-500">
                    <ChevronRight className="rotate-90 w-4 h-4" />
                  </div>
                </div>
              </div>


              {/* Trending Grid */}
              <div className="space-y-4 pt-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trending Now</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {trendingDestinations.map((dest) => (
                    <button 
                      key={dest.name} 
                      onClick={() => handleTrendingClick(dest.name)}
                      className="group relative h-24 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all ring-1 ring-slate-100 dark:ring-slate-800"
                    >
                      <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-90 group-hover:brightness-100" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center p-3">
                        <span className="text-white font-bold text-sm tracking-wide shadow-black/50 drop-shadow-md">{dest.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-6">
                <Button 
                  onClick={handleCountrySubmit} 
                  isLoading={loading} 
                  disabled={!country} 
                  className="w-full h-14 text-lg shadow-brand-500/25"
                >
                  Find Cities <ChevronRight className="ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: City Selection */}
          {step === 'CITY' && (
            <div className="flex-1 flex flex-col space-y-8 animate-in slide-in-from-right-8 duration-300">
               <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <MapPin size={14} /> Step 2: Explore {country}
                  </label>
                  {/* Community Option Button in Step 2 */}
                  {onViewCommunity && (
                    <button 
                      onClick={onViewCommunity}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
                    >
                      <Users size={12} /> View Community
                    </button>
                  )}
                </div>
                
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                     <MapPin size={24} />
                   </div>
                   <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full pl-14 pr-10 py-5 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-bold text-xl text-slate-800 dark:text-white appearance-none cursor-pointer shadow-inner"
                  >
                    <option value="" disabled>Choose a city to explore...</option>
                    {cities.map((c) => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-brand-500">
                    <ChevronRight className="rotate-90" />
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl h-32 group ring-1 ring-slate-100 dark:ring-slate-800">
                 <img src={`https://source.unsplash.com/random/800x400/?${country},city`} alt={country} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000" />
                 <div className="absolute inset-0 bg-gradient-to-r from-brand-900/90 to-brand-900/40 flex items-center p-6 space-x-4 backdrop-blur-[1px]">
                    <div className="p-3 bg-white/20 rounded-full backdrop-blur-md">
                      <Sparkles className="w-6 h-6 text-brand-200" />
                    </div>
                    <p className="text-white text-sm md:text-base font-medium leading-relaxed max-w-md">
                      {selectedCity 
                        ? `Ready to generate your personal guide for ${selectedCity}?`
                        : "Our AI will create a localized itinerary, packing list, and hidden gems guide for you."}
                    </p>
                 </div>
              </div>

              <div className="mt-auto pt-6">
                <Button 
                  onClick={handleCitySubmit} 
                  isLoading={loading} 
                  disabled={!selectedCity} 
                  className="w-full h-14 text-lg shadow-brand-500/25"
                >
                  Generate Travel Guide <Plane className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>

      <div className="pt-2 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
        <CurrencyConverter />
      </div>
    </div>
  );
};
