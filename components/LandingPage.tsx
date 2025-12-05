
import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { ArrowRight, Plane, MapPin } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const column1 = [
  { src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800", label: "Bali Resorts, Indonesia", height: "h-64", rounded: "rounded-b-3xl" },
  { src: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800", label: "Paris, France", height: "h-96", rounded: "rounded-3xl" },
  { src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800", label: "Swiss Alps", height: "h-64", rounded: "rounded-t-3xl" },
];

const column2 = [
  { src: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800", label: "Santorini, Greece", height: "h-80", rounded: "rounded-3xl" },
  { src: "https://images.unsplash.com/photo-1512453979798-5ea904ac22ac?auto=format&fit=crop&q=80&w=800", label: "Dubai Skyline, UAE", height: "h-64", rounded: "rounded-3xl" },
  { src: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&q=80&w=800", label: "Venice Canals, Italy", height: "h-80", rounded: "rounded-3xl" },
];

const column3 = [
  { src: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800", label: "Tokyo Streets, Japan", height: "h-64", rounded: "rounded-b-3xl" },
  { src: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=800", label: "Phi Phi Islands", height: "h-96", rounded: "rounded-3xl" },
  { src: "https://images.unsplash.com/photo-1596727147705-01a298de8ade?auto=format&fit=crop&q=80&w=800", label: "Maldives", height: "h-64", rounded: "rounded-t-3xl" },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20, // -10 to 10px
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const ImageCard = ({ item }: { item: typeof column1[0] }) => (
    <div className={`relative group overflow-hidden ${item.rounded} ${item.height} w-full shadow-lg`}>
      <img 
        src={item.src} 
        alt={item.label} 
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 flex items-center text-white/90 text-sm font-medium">
          <MapPin size={14} className="mr-1 text-brand-400" />
          {item.label}
        </div>
      </div>
      {/* Subtle permanent caption for visuals */}
      <div className="absolute bottom-2 left-3 opacity-60 group-hover:opacity-0 transition-opacity duration-300">
        <span className="text-[10px] text-white/80 font-medium tracking-wider bg-black/20 backdrop-blur-[2px] px-2 py-0.5 rounded-full uppercase">
          {item.label.split(',')[0]}
        </span>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen w-full bg-slate-900 overflow-hidden flex flex-col justify-end selection:bg-brand-500/30">
      
      {/* Dynamic Background Collage with Parallax */}
      <div 
        className="absolute inset-0 grid grid-cols-3 gap-3 md:gap-6 opacity-50 md:opacity-60 transition-transform duration-100 ease-out will-change-transform"
        style={{ transform: `translate(${-mousePos.x}px, ${-mousePos.y}px) scale(1.05)` }}
      >
        <div className={`grid gap-3 md:gap-6 transform transition-all duration-1000 ease-out ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0'}`}>
          {column1.map((img, i) => <ImageCard key={i} item={img} />)}
        </div>
        <div className={`grid gap-3 md:gap-6 transform transition-all duration-1000 delay-100 ease-out ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          {column2.map((img, i) => <ImageCard key={i} item={img} />)}
        </div>
        <div className={`grid gap-3 md:gap-6 transform transition-all duration-1000 delay-200 ease-out ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0'}`}>
          {column3.map((img, i) => <ImageCard key={i} item={img} />)}
        </div>
      </div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-20 pt-10 text-center md:text-left">
        <div className={`inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full mb-8 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
           <Plane className="text-brand-400 w-4 h-4" />
           <span className="text-brand-50 text-sm font-medium tracking-wide">The world is waiting</span>
        </div>

        <h1 className={`text-5xl md:text-8xl font-bold text-white mb-8 leading-[1.1] tracking-tight transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          Your adventure <br />
          <span 
            className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-white to-brand-300 bg-[length:200%_auto] animate-shimmer"
            style={{ 
              animation: 'shimmer 3s linear infinite',
            }}
          >
            awaits here.
          </span>
        </h1>
        
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes shimmer {
            0% { background-position: 200% center; }
            100% { background-position: -200% center; }
          }
        `}} />

        <p className={`text-lg md:text-xl text-slate-300 max-w-xl mb-12 leading-relaxed transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          Discover hidden gems, plan aesthetic trips, and travel like a local with your personalized AI companion.
        </p>

        <div className={`transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Button 
            onClick={onStart} 
            className="text-lg px-10 py-7 rounded-2xl shadow-xl shadow-brand-500/20 hover:shadow-brand-500/40 hover:scale-105 active:scale-95 transition-all duration-300 bg-brand-600 hover:bg-brand-500 text-white font-semibold tracking-wide"
          >
            Get Started <ArrowRight className="ml-3 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
