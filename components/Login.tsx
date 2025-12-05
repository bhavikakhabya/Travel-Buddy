
import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Plane, Mail, User, Lock, ArrowRight, Sparkles, ShieldCheck, Map, Eye, EyeOff, Users, Shield } from 'lucide-react';
import { UserProfile } from '../types';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../services/firebase';

interface LoginProps {
  onLoginSuccess: (profile: UserProfile) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateLocalUserRegistry = (userName: string, userEmail: string, userRole: 'user' | 'admin') => {
    // Simulating a backend user database in localStorage
    const existingData = localStorage.getItem('travel_buddy_user_registry');
    let registry = existingData ? JSON.parse(existingData) : [];
    
    // Check if user exists, if not add them
    const existingUserIndex = registry.findIndex((u: any) => u.email === userEmail);
    const timestamp = new Date().toISOString();

    if (existingUserIndex >= 0) {
      registry[existingUserIndex].lastLogin = timestamp;
      registry[existingUserIndex].role = userRole; 
    } else {
      registry.push({
        name: userName,
        email: userEmail,
        role: userRole,
        joinedAt: timestamp,
        lastLogin: timestamp
      });
    }
    
    localStorage.setItem('travel_buddy_user_registry', JSON.stringify(registry));
    localStorage.setItem('current_user_role', userRole);
  };

  const handleAuth = async () => {
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    if (isSignUp && !name) {
      setError('Please enter your name.');
      return;
    }

    setLoading(true);
    try {
      let profileName = name;

      if (isSignUp) {
        // Create Account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
          displayName: name
        });
        profileName = name;
      } else {
        // Sign In
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        profileName = userCredential.user.displayName || email.split('@')[0];
      }

      // Update registry
      updateLocalUserRegistry(profileName, email, role);

      onLoginSuccess({
        name: profileName,
        email: email,
        isFirstLogin: isSignUp,
        role: role
      });

    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-email') setError('Invalid email address.');
      else if (err.code === 'auth/user-not-found') setError('No account found with this email.');
      else if (err.code === 'auth/wrong-password') setError('Incorrect password.');
      else if (err.code === 'auth/email-already-in-use') setError('Email is already registered.');
      else if (err.code === 'auth/weak-password') setError('Password should be at least 6 characters.');
      else setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-900 overflow-hidden font-sans">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop" 
          alt="Travel Background" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-900/30"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 p-6 items-center">
        
        {/* Left Side: Branding & Info */}
        <div className={`text-white space-y-8 hidden lg:block transition-all duration-700 delay-100 transform ${mounted ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full">
            <Sparkles size={16} className="text-brand-400" />
            <span className="text-sm font-medium tracking-wide">AI-Powered Travel Companion</span>
          </div>
          
          <h1 className="text-6xl font-bold leading-tight tracking-tight">
            Discover your next <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-cyan-300">adventure</span>.
          </h1>
          
          <p className="text-xl text-slate-300 max-w-lg leading-relaxed">
            Travel Buddy creates personalized, aesthetic itineraries tailored to your vibe. Experience the world like a local, not a tourist.
          </p>

          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-brand-500/20 rounded-xl">
                <Map className="text-brand-400" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-white">Smart Itineraries</h3>
                <p className="text-sm text-slate-400">Perfectly timed plans.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-brand-500/20 rounded-xl">
                <ShieldCheck className="text-brand-400" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-white">Safety First</h3>
                <p className="text-sm text-slate-400">Curated local tips.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="w-full max-w-md mx-auto">
          <div className={`bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 transition-all duration-700 delay-200 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            
            <div className="text-center mb-8 lg:hidden">
              <div className="bg-brand-100 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-brand-600">
                <Plane size={28} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Travel Buddy</h1>
            </div>

            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-slate-900">
                  {isSignUp ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="text-slate-500 text-sm">
                  {isSignUp ? 'Start your journey with us today.' : 'Enter your details to sign in.'}
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium border border-red-100 animate-pulse">
                  {error}
                </div>
              )}

              {/* Role Toggle */}
              <div className="bg-slate-100 p-1 rounded-xl flex">
                <button
                  onClick={() => setRole('user')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    role === 'user' 
                    ? 'bg-white text-brand-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Users size={16} />
                  <span>User</span>
                </button>
                <button
                  onClick={() => setRole('admin')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    role === 'admin' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Shield size={16} />
                  <span>Admin</span>
                </button>
              </div>

              <div className="space-y-4">
                
                {isSignUp && (
                  <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="block text-sm font-semibold text-slate-700">Full Name</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all font-medium"
                        placeholder="e.g. Rahul Sharma"
                      />
                      <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-slate-700">Email Address</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all font-medium"
                      placeholder="hello@example.com"
                    />
                    <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-slate-700">Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all font-medium"
                      placeholder="••••••••"
                      onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
                    />
                    <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                    <button 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <Button 
                  onClick={handleAuth} 
                  isLoading={loading} 
                  className={`w-full mt-2 ${role === 'admin' ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/25' : 'bg-brand-600 shadow-brand-500/25'}`}
                >
                  {isSignUp ? `Sign Up as ${role === 'admin' ? 'Admin' : 'User'}` : `Log In as ${role === 'admin' ? 'Admin' : 'User'}`} 
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>

                <div className="text-center pt-2">
                  <p className="text-sm text-slate-500">
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}
                    <button 
                      onClick={toggleMode}
                      className="ml-1 text-brand-600 font-bold hover:text-brand-700 transition-colors hover:underline underline-offset-2"
                    >
                      {isSignUp ? "Log In" : "Sign Up"}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <p className={`text-center text-slate-400 text-xs mt-6 transition-opacity duration-700 delay-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
             By continuing, you agree to our Terms & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};
