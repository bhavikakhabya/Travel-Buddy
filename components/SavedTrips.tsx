import React, { useState, useRef } from 'react';
import { SavedTrip } from '../types';
import { Calendar, Trash2, ArrowRight, Loader2, RefreshCw, Share2, X, MessageCircle, Twitter, Link2 } from 'lucide-react';
import { Button } from './ui/Button';

interface SavedTripsProps {
  trips: SavedTrip[];
  onSelectTrip: (trip: SavedTrip) => void;
  onDeleteTrip: (id: string, e: React.MouseEvent) => void;
  onRefresh: () => Promise<void>;
  searchQuery: string;
}

export const SavedTrips: React.FC<SavedTripsProps> = ({ trips, onSelectTrip, onDeleteTrip, onRefresh, searchQuery }) => {
  const [pullY, setPullY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [tripToShare, setTripToShare] = useState<SavedTrip | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Pull to refresh logic
  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (window.scrollY === 0 && startY > 0) {
      const currentY = e.touches[0].clientY;
      const diff = currentY - startY;
      if (diff > 0) {
        // Add resistance
        setPullY(Math.min(diff * 0.4, 100));
      }
    }
  };

  const handleTouchEnd = async () => {
    setStartY(0);
    if (pullY > 60) {
      setRefreshing(true);
      setPullY(60); // Keep it visible while refreshing
      await onRefresh();
      setRefreshing(false);
    }
    setPullY(0);
  };

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  const handleShareClick = (trip: SavedTrip, e: React.MouseEvent) => {
    e.stopPropagation();
    setTripToShare(trip);
  };

  const generateShareData = (trip: SavedTrip) => {
    return {
      title: `Trip to ${trip.city}`,
      text: `✈️ Trip to ${trip.city}, ${trip.country}\n\n🌞 ${trip.weather.condition}, ${trip.weather.temperature}\n✨ Must Visit: ${trip.attractions[0].name}\n\n${trip.introduction}\n\nPlan your own trip with Travel Buddy!`,
      url: window.location.href,
    };
  };

  const executeShare = async () => {
    if (!tripToShare) return;
    const shareData = generateShareData(tripToShare);

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share canceled");
      }
    } else {
      navigator.clipboard.writeText(shareData.text);
      alert("Trip details copied to clipboard!");
    }
    setTripToShare(null);
  };

  const handleWhatsAppShare = () => {
    if (!tripToShare) return;
    const data = generateShareData(tripToShare);
    const text = encodeURIComponent(`${data.text} ${data.url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setTripToShare(null);
  };

  const handleTwitterShare = () => {
    if (!tripToShare) return;
    const data = generateShareData(tripToShare);
    const text = encodeURIComponent(data.text);
    const url = encodeURIComponent(data.url);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    setTripToShare(null);
  };

  const filteredTrips = trips.filter(trip => {
    if (!searchQuery) return true;
    
    const q = searchQuery.toLowerCase();
    
    // Check main fields
    const inMainInfo = 
      trip.city.toLowerCase().includes(q) ||
      trip.country.toLowerCase().includes(q) ||
      trip.introduction.toLowerCase().includes(q);
      
    if (inMainInfo) return true;

    // Check date
    const dateStr = new Date(trip.savedAt).toLocaleDateString().toLowerCase();
    if (dateStr.includes(q)) return true;

    // Deep check in itinerary details
    const inItinerary = trip.itinerary.some(item => 
      item.activity.toLowerCase().includes(q) || 
      item.description.toLowerCase().includes(q) ||
      item.time.toLowerCase().includes(q)
    );

    if (inItinerary) return true;

    // Check tips
    const inTips = 
      trip.tips.food.toLowerCase().includes(q) ||
      trip.tips.culture.toLowerCase().includes(q) ||
      trip.tips.safety.toLowerCase().includes(q);
      
    return inTips;
  });

  return (
    <div 
      ref={containerRef}
      className="space-y-4 animate-in fade-in slide-in-from-bottom-4 min-h-[50vh] relative touch-pan-y"
      style={{ overscrollBehaviorY: 'contain' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to Refresh Indicator */}
      <div 
        className="absolute top-0 left-0 w-full flex justify-center items-center pointer-events-none transition-transform duration-200 z-10"
        style={{ transform: `translateY(${pullY - 50}px)` }}
      >
        <div className="bg-white dark:bg-slate-800 shadow-md rounded-full p-2 text-brand-600">
          {refreshing ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            <RefreshCw className="w-5 h-5" style={{ transform: `rotate(${pullY * 2}deg)` }} />
          )}
        </div>
      </div>

      <div className="flex justify-between items-center px-2 py-1">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Your Adventures</h3>
        <button 
          onClick={handleManualRefresh}
          disabled={refreshing}
          className="p-2 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          title="Refresh List"
        >
          <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
        </button>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <Calendar className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400">No saved trips yet</h3>
          <p>Start planning your next adventure!</p>
        </div>
      ) : filteredTrips.length === 0 ? (
         <div className="text-center py-20 text-slate-400">
           <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400">No matches found</h3>
           <p>Try searching for a different destination, activity, or keyword.</p>
         </div>
      ) : (
        <div 
          className="space-y-4 transition-transform duration-200"
          style={{ transform: pullY > 0 ? `translateY(${pullY * 0.1}px)` : 'none' }}
        >
          {filteredTrips.map((trip) => (
            <div 
              key={trip.id} 
              onClick={() => onSelectTrip(trip)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-lg hover:border-brand-200 dark:hover:border-brand-800 transition-all cursor-pointer group relative select-none"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                      <img src={`https://picsum.photos/seed/${trip.city}/100/100`} alt={trip.city} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">{trip.city}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{trip.country}</p>
                      <div className="flex items-center text-xs text-slate-400 mt-2">
                        <Calendar size={12} className="mr-1" />
                        <span>Saved {new Date(trip.savedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                </div>
                
                <div className="flex items-center space-x-1">
                    <button 
                      onClick={(e) => handleShareClick(trip, e)}
                      className="p-2 text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
                    >
                      <Share2 size={18} />
                    </button>
                    <button 
                      onClick={(e) => onDeleteTrip(trip.id, e)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                </div>
              </div>
              
              <div className="absolute right-5 bottom-5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
                  <div className="bg-brand-50 dark:bg-brand-900 text-brand-600 dark:text-brand-300 p-2 rounded-full">
                    <ArrowRight size={16} />
                  </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Share Preview Modal */}
      {tripToShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
              <button 
                onClick={() => setTripToShare(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
              
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 text-center">Share Trip</h3>
              
              {/* Visual Preview Card */}
              <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 mb-6 shadow-inner">
                <div className="h-32 w-full relative">
                  <img src={`https://picsum.photos/seed/${tripToShare.city}/400/200`} alt={tripToShare.city} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                     <h4 className="text-white font-bold text-xl">{tripToShare.city}</h4>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                   <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                     <span className="bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 px-2 py-0.5 rounded text-xs font-bold mr-2 uppercase">Itinerary</span>
                     {tripToShare.country}
                   </div>
                   <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 italic">
                     "{tripToShare.introduction}"
                   </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                 <button 
                  onClick={handleWhatsAppShare}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                >
                  <MessageCircle className="w-6 h-6 text-green-500 mb-1" />
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">WhatsApp</span>
                </button>
                <button 
                  onClick={handleTwitterShare}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <Twitter className="w-6 h-6 text-blue-400 mb-1" />
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Twitter</span>
                </button>
                 <button 
                  onClick={executeShare}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                >
                  <Share2 className="w-6 h-6 text-brand-500 mb-1" />
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">More</span>
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};