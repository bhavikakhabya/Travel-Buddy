
import React, { useState, useEffect } from 'react';
import { UserProfile, SavedTrip, TravelGuide } from '../types';
import { PlanTrip } from './PlanTrip';
import { SavedTrips } from './SavedTrips';
import { Settings } from './Settings';
import { ItineraryView } from './ItineraryView';
import { BudgetTracker } from './BudgetTracker';
import { Community } from './Community';
import { Compass, Heart, Settings as SettingsIcon, UserCircle, Search, CloudSun, Mic, Wallet, Users } from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
}

type Tab = 'PLAN' | 'SAVED' | 'BUDGET' | 'COMMUNITY' | 'WEATHER' | 'SETTINGS';

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<Tab>('PLAN');
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [currentTrip, setCurrentTrip] = useState<TravelGuide | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Load saved trips on mount
  useEffect(() => {
    loadSavedTrips();
  }, []);

  const loadSavedTrips = () => {
    const saved = localStorage.getItem('travel_buddy_trips');
    if (saved) {
      try {
        setSavedTrips(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved trips");
      }
    }
  };

  const refreshTrips = async (): Promise<void> => {
    // Simulate network delay for better UX on refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    loadSavedTrips();
  };

  const saveTrip = (guide: TravelGuide) => {
    const newTrip: SavedTrip = { ...guide, savedAt: new Date().toISOString() };
    const updated = [newTrip, ...savedTrips];
    setSavedTrips(updated);
    localStorage.setItem('travel_buddy_trips', JSON.stringify(updated));
  };

  const deleteTrip = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedTrips.filter(t => t.id !== id);
    setSavedTrips(updated);
    localStorage.setItem('travel_buddy_trips', JSON.stringify(updated));
  };

  const isTripSaved = (id: string) => savedTrips.some(t => t.id === id);

  const handleTripGenerated = (guide: TravelGuide) => {
    setCurrentTrip(guide);
  };

  const handleBackFromTrip = () => {
    setCurrentTrip(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query && activeTab !== 'SAVED' && !currentTrip) {
      setActiveTab('SAVED');
    }
  };

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);
    setSearchQuery(''); // Clear previous search
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      if (transcript && activeTab !== 'SAVED' && !currentTrip) {
        setActiveTab('SAVED');
      }
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 transition-colors duration-300">
      {/* Top Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-0">
            <div className="flex items-center space-x-3">
               <div className="bg-brand-600 rounded-lg p-2 text-white">
                  <Compass size={20} />
               </div>
               <h1 className="text-xl font-bold text-slate-800 dark:text-white hidden sm:block">Travel Buddy</h1>
            </div>
            
            {/* Search Bar (Visible on Plan and Saved tabs) */}
            {(activeTab === 'PLAN' || activeTab === 'SAVED') && !currentTrip && (
               <div className="flex-1 max-w-xs mx-4">
                 <div className="relative">
                   <Search className={`absolute left-3 top-2.5 transition-colors ${isListening ? 'text-brand-500' : 'text-slate-400'}`} size={16} />
                   <input 
                    type="text" 
                    placeholder={isListening ? "Listening..." : "Search trips..."}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className={`w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white pl-9 pr-10 py-2 rounded-full text-sm border-none focus:ring-2 focus:ring-brand-500 outline-none placeholder:text-slate-400 transition-all ${isListening ? 'ring-2 ring-brand-500 bg-brand-50' : ''}`}
                   />
                   <button 
                    onClick={handleVoiceSearch}
                    className={`absolute right-2 top-1.5 p-1 rounded-full transition-all duration-300 ${isListening ? 'text-red-500 bg-red-100 scale-110 animate-pulse' : 'text-slate-400 hover:text-brand-500 hover:bg-slate-200'}`}
                    title="Voice Search"
                   >
                     <Mic size={16} />
                   </button>
                 </div>
               </div>
            )}

            <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
              <UserCircle size={18} className="text-slate-400" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{user.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        
        {currentTrip ? (
          <ItineraryView 
            guide={currentTrip} 
            onBack={handleBackFromTrip} 
            onSave={saveTrip}
            isSaved={isTripSaved(currentTrip.id)}
          />
        ) : (
          <>
            {activeTab === 'PLAN' && (
              <PlanTrip 
                onTripGenerated={handleTripGenerated} 
                onViewCommunity={() => setActiveTab('COMMUNITY')} 
              />
            )}
            
            {activeTab === 'SAVED' && (
              <SavedTrips 
                trips={savedTrips} 
                onSelectTrip={setCurrentTrip} 
                onDeleteTrip={deleteTrip}
                onRefresh={refreshTrips}
                searchQuery={searchQuery}
              />
            )}

            {activeTab === 'BUDGET' && <BudgetTracker />}

            {activeTab === 'COMMUNITY' && <Community currentUser={user} />}

            {activeTab === 'WEATHER' && (
               <div className="text-center py-20 text-slate-400">
                 <CloudSun className="w-16 h-16 mx-auto mb-4 opacity-20" />
                 <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400">Global Weather</h3>
                 <p>Use the Trip Planner to get specific city weather.</p>
               </div>
            )}

            {activeTab === 'SETTINGS' && <Settings user={user} />}
          </>
        )}

      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-3 px-2 sm:px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-30">
        <div className="max-w-lg mx-auto flex justify-between items-center">
          <NavButton 
            active={activeTab === 'PLAN'} 
            onClick={() => { setActiveTab('PLAN'); setCurrentTrip(null); }} 
            icon={<Compass size={22} />} 
            label="Plan" 
          />
          <NavButton 
            active={activeTab === 'SAVED'} 
            onClick={() => { setActiveTab('SAVED'); setCurrentTrip(null); }} 
            icon={<Heart size={22} />} 
            label="Saved" 
          />
           <NavButton 
            active={activeTab === 'BUDGET'} 
            onClick={() => { setActiveTab('BUDGET'); setCurrentTrip(null); }} 
            icon={<Wallet size={22} />} 
            label="Budget" 
          />
          <NavButton 
            active={activeTab === 'COMMUNITY'} 
            onClick={() => { setActiveTab('COMMUNITY'); setCurrentTrip(null); }} 
            icon={<Users size={22} />} 
            label="Comm." 
          />
           <NavButton 
            active={activeTab === 'WEATHER'} 
            onClick={() => { setActiveTab('WEATHER'); setCurrentTrip(null); }} 
            icon={<CloudSun size={22} />} 
            label="Weather" 
          />
           <NavButton 
            active={activeTab === 'SETTINGS'} 
            onClick={() => { setActiveTab('SETTINGS'); setCurrentTrip(null); }} 
            icon={<SettingsIcon size={22} />} 
            label="Profile" 
          />
        </div>
      </nav>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center space-y-1 transition-colors duration-200 w-full ${active ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
  >
    {icon}
    <span className="text-[10px] font-bold tracking-wide uppercase truncate w-full text-center">{label}</span>
  </button>
);
