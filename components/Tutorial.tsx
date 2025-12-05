
import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Map, Sun, Heart, Sparkles, ChevronRight } from 'lucide-react';

interface TutorialProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: <Map className="w-10 h-10 text-brand-600" />,
    title: "Plan Your Getaway",
    desc: "Simply enter a country and pick a city. We'll handle the complex itinerary planning for you.",
    bg: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=2070"
  },
  {
    icon: <Sun className="w-10 h-10 text-amber-500" />,
    title: "Real-time Insights",
    desc: "Get seasonal weather updates and packing tips so you're never caught off guard.",
    bg: "https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&q=80&w=2070"
  },
  {
    icon: <Sparkles className="w-10 h-10 text-purple-600" />,
    title: "Gen-Z Approved",
    desc: "Short, snappy, and aesthetic guides. No boring encyclopedias here!",
    bg: "https://images.unsplash.com/photo-1535916707213-3a19796e93e7?auto=format&fit=crop&q=80&w=2070"
  },
  {
    icon: <Heart className="w-10 h-10 text-rose-500" />,
    title: "Your Personal Buddy",
    desc: "Safety tips, food recs, and cultural hacks tailored just for you.",
    bg: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=2069"
  }
];

export const Tutorial: React.FC<TutorialProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const next = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(c => c + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 overflow-hidden">
      
      {/* Dynamic Background with Fade Effect */}
      {slides.map((slide, idx) => (
        <div 
          key={idx}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${idx === currentSlide ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
        >
          <img 
            src={slide.bg} 
            alt="Background" 
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60 backdrop-blur-[2px]"></div>
        </div>
      ))}

      <div className={`relative w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-8 rounded-[2rem] shadow-2xl border border-white/40 dark:border-white/10 transition-all duration-500 flex flex-col items-center text-center transform ${mounted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        
        {/* Indicators */}
        <div className="flex justify-center space-x-2 mb-8 bg-black/10 dark:bg-white/10 p-1.5 rounded-full backdrop-blur-sm">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-500 ease-out ${i === currentSlide ? 'w-8 bg-brand-600 dark:bg-brand-400' : 'w-2 bg-slate-400/50'}`}
            />
          ))}
        </div>

        {/* Content Container */}
        <div className="space-y-6 mb-8 w-full">
          <div key={currentSlide} className="flex flex-col items-center animate-pulse-once">
            <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl shadow-lg ring-4 ring-brand-50 dark:ring-slate-700 mb-6 transform hover:scale-110 transition-transform duration-300">
              {slides[currentSlide].icon}
            </div>
            
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
              {slides[currentSlide].title}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
              {slides[currentSlide].desc}
            </p>
          </div>
        </div>

        {/* Action */}
        <div className="w-full pt-2">
          <Button onClick={next} className="w-full h-14 text-lg font-bold shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40" variant="primary">
            {currentSlide === slides.length - 1 ? "Start Adventure" : "Next Step"} 
            {currentSlide !== slides.length - 1 && <ChevronRight className="ml-2 w-5 h-5" />}
          </Button>
          {currentSlide < slides.length - 1 && (
             <button onClick={onComplete} className="w-full mt-5 text-white/80 hover:text-white font-medium text-sm uppercase tracking-widest hover:underline decoration-white/30 underline-offset-4 transition-all shadow-sm">
               Skip Tutorial
             </button>
          )}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes subtleFadeIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-pulse-once {
          animation: subtleFadeIn 0.5s ease-out forwards;
        }
      `}} />
    </div>
  );
};
