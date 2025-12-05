
import React, { useEffect, useState } from 'react';
import { UserProfile } from '../types';
import { Shield, User, Mail, Clock, Database, Search, CheckCircle } from 'lucide-react';

interface CommunityProps {
  currentUser: UserProfile;
}

interface RegistryUser {
  name: string;
  email: string;
  role: 'user' | 'admin';
  lastLogin: string;
}

export const Community: React.FC<CommunityProps> = ({ currentUser }) => {
  const [registryUsers, setRegistryUsers] = useState<RegistryUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const registry = localStorage.getItem('travel_buddy_user_registry');
    if (registry) {
      try {
        const parsed = JSON.parse(registry);
        // Sort by last login (newest first)
        parsed.sort((a: RegistryUser, b: RegistryUser) => new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime());
        setRegistryUsers(parsed);
      } catch (e) {
        console.error("Failed to load user registry");
      }
    }
  }, []);

  const filteredUsers = registryUsers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 pb-24">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          {currentUser.role === 'admin' ? (
            <>
              <Shield className="text-indigo-600" /> Admin Community Hub
            </>
          ) : (
            <>
              <User className="text-brand-600" /> My Community Profile
            </>
          )}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {currentUser.role === 'admin' 
            ? "View and monitor all users who have accessed the app." 
            : "You are part of the Travel Buddy community."}
        </p>
      </div>

      {/* ADMIN VIEW */}
      {currentUser.role === 'admin' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 overflow-hidden shadow-sm">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-900/30 flex flex-col sm:flex-row justify-between gap-4">
             <div className="flex items-center gap-2">
                <Database size={18} className="text-indigo-600 dark:text-indigo-400" />
                <h4 className="font-bold text-indigo-900 dark:text-indigo-300">User Registry ({registryUsers.length})</h4>
             </div>
             
             <div className="relative">
               <Search size={14} className="absolute left-3 top-3 text-indigo-400" />
               <input 
                 type="text" 
                 placeholder="Search users..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-48"
               />
             </div>
          </div>

          <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
             {filteredUsers.length === 0 ? (
               <div className="p-8 text-center text-slate-400 text-sm">No users found in registry.</div>
             ) : (
               <div className="divide-y divide-slate-100 dark:divide-slate-800">
                 {filteredUsers.map((u, idx) => (
                   <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm ${u.role === 'admin' ? 'bg-indigo-500' : 'bg-slate-400'}`}>
                            {u.name.charAt(0).toUpperCase()}
                         </div>
                         <div>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                              {u.name} 
                              {u.email === currentUser.email && <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full">YOU</span>}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                              <Mail size={10} /> {u.email}
                            </p>
                         </div>
                      </div>
                      <div className="text-right">
                         <span className={`inline-block text-[10px] uppercase font-bold px-2 py-0.5 rounded-full mb-1 ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                           {u.role}
                         </span>
                         <p className="text-[10px] text-slate-400 flex items-center justify-end gap-1">
                           <Clock size={10} /> {new Date(u.lastLogin).toLocaleDateString()}
                         </p>
                      </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        </div>
      )}

      {/* USER VIEW */}
      {currentUser.role === 'user' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-brand-100 dark:border-slate-800 overflow-hidden shadow-sm">
           <div className="h-24 bg-gradient-to-r from-brand-400 to-cyan-400 relative">
              <div className="absolute -bottom-8 left-6">
                <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-full p-1">
                   <div className="w-full h-full bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-2xl font-bold text-brand-600">
                      {currentUser.name.charAt(0).toUpperCase()}
                   </div>
                </div>
              </div>
           </div>
           
           <div className="pt-10 px-6 pb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{currentUser.name}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1">
                <Mail size={12} /> {currentUser.email}
              </p>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                 <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Role</p>
                    <p className="font-medium text-slate-700 dark:text-slate-300 capitalize flex items-center gap-2">
                       <User size={16} /> {currentUser.role}
                    </p>
                 </div>
                 <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Account Status</p>
                    <p className="font-medium text-green-600 dark:text-green-400 flex items-center gap-2">
                      <CheckCircle size={16} /> Active
                    </p>
                 </div>
              </div>

              <div className="mt-6 p-4 bg-brand-50 dark:bg-brand-900/10 rounded-xl text-sm text-brand-800 dark:text-brand-300 border border-brand-100 dark:border-brand-900/20">
                <p><strong>Note:</strong> You are logged in as a standard user. You can view your own profile here. Only Administrators can view the full user registry.</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
