
import React, { useState, useEffect } from 'react';
import { Moon, Sun, Palette, Check, User, Mail, Bell, Shield, HelpCircle, LogOut, ChevronRight, UserCog } from 'lucide-react';
import { ThemeColor, UserProfile } from '../types';
import { applyTheme } from '../utils/helpers';
import { Button } from './ui/Button';
import { auth } from '../services/firebase';

interface SettingsProps {
  user: UserProfile;
}

export const Settings: React.FC<SettingsProps> = ({ user }) => {
  const [isDark, setIsDark] = useState(false);
  const [accent, setAccent] = useState<ThemeColor>('blue');

  useEffect(() => {
    // Load from local storage if available
    const savedTheme = localStorage.getItem('theme-preference');
    const savedAccent = localStorage.getItem('accent-preference') as ThemeColor;
    
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
    if (savedAccent) {
      setAccent(savedAccent);
      applyTheme(savedAccent);
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme-preference', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme-preference', 'light');
    }
  };

  const changeAccent = (color: ThemeColor) => {
    setAccent(color);
    applyTheme(color);
    localStorage.setItem('accent-preference', color);
  };

  const handleLogout = () => {
    auth.signOut();
    // App.tsx auth listener will handle the redirect
  };

  const colors: { id: ThemeColor, class: string }[] = [
    { id: 'blue', class: 'bg-blue-500' },
    { id: 'rose', class: 'bg-rose-500' },
    { id: 'emerald', class: 'bg-emerald-500' },
    { id: 'violet', class: 'bg-violet-500' },
    { id: 'amber', class: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 pb-10">
      
      {/* Profile Header */}
      <div className="relative bg-gradient-to-br from-brand-500 to-brand-700 rounded-3xl p-8 text-white overflow-hidden shadow-xl shadow-brand-500/20">
        <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg mb-4">
            <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
               {/* Use first letter of name or icon */}
               {user.name ? (
                 <span className="text-4xl font-bold text-brand-600">{user.name.charAt(0).toUpperCase()}</span>
               ) : (
                 <User className="w-10 h-10 text-slate-400" />
               )}
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">{user.name || "Traveller"}</h2>
          <p className="text-brand-100 font-medium flex items-center gap-2 mt-1">
            <Mail size={14} /> {user.email}
          </p>
          <div className="mt-6 flex gap-3">
             <button className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-sm font-semibold transition-colors flex items-center">
               <UserCog size={16} className="mr-2" /> Edit Profile
             </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Settings Section: Appearance */}
        <div className="space-y-3">
           <h3 className="px-2 text-sm font-bold text-slate-400 uppercase tracking-wider">Appearance</h3>
           <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              
              {/* Dark Mode Toggle */}
              <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 last:border-0">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-xl ${isDark ? 'bg-slate-800 text-slate-200' : 'bg-amber-100 text-amber-600'}`}>
                    {isDark ? <Moon size={20} /> : <Sun size={20} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Dark Mode</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Easier on the eyes at night</p>
                  </div>
                </div>
                <button 
                  onClick={toggleTheme}
                  className={`w-12 h-7 rounded-full transition-colors duration-300 relative ${isDark ? 'bg-brand-600' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-md transition-transform duration-300 ${isDark ? 'translate-x-5' : ''}`}></div>
                </button>
              </div>

              {/* Accent Color Picker */}
              <div className="p-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-2 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-xl">
                    <Palette size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Accent Color</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Match your vibe</p>
                  </div>
                </div>
                <div className="flex space-x-3 pl-12">
                  {colors.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => changeAccent(c.id)}
                      className={`w-10 h-10 rounded-full ${c.class} flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-slate-400 shadow-sm`}
                    >
                      {accent === c.id && <Check className="text-white w-5 h-5" />}
                    </button>
                  ))}
                </div>
              </div>

           </div>
        </div>

        {/* Settings Section: General */}
        <div className="space-y-3">
           <h3 className="px-2 text-sm font-bold text-slate-400 uppercase tracking-wider">Account & Support</h3>
           <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
              
              <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group text-left">
                <div className="flex items-center space-x-4">
                   <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl">
                      <Bell size={20} />
                   </div>
                   <span className="font-bold text-slate-700 dark:text-slate-200">Notifications</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-500 transition-colors" />
              </button>

              <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group text-left">
                <div className="flex items-center space-x-4">
                   <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl">
                      <Shield size={20} />
                   </div>
                   <span className="font-bold text-slate-700 dark:text-slate-200">Privacy & Security</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-500 transition-colors" />
              </button>

              <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group text-left">
                <div className="flex items-center space-x-4">
                   <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl">
                      <HelpCircle size={20} />
                   </div>
                   <span className="font-bold text-slate-700 dark:text-slate-200">Help & Support</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-500 transition-colors" />
              </button>

              <button onClick={handleLogout} className="w-full p-4 flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group text-left">
                <div className="flex items-center space-x-4">
                   <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-xl">
                      <LogOut size={20} />
                   </div>
                   <span className="font-bold text-red-500">Log Out</span>
                </div>
              </button>

           </div>
        </div>

        <p className="text-center text-xs text-slate-400 pt-4">
           Travel Buddy v1.0.2 • Made with ❤️ in India
        </p>

      </div>
    </div>
  );
};
