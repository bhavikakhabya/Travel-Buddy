
import React, { useState, useEffect } from 'react';
import { AppScreen, UserProfile } from './types';
import { Login } from './components/Login';
import { Tutorial } from './components/Tutorial';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './components/LandingPage';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.LANDING);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Check for existing session
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const savedRole = localStorage.getItem('current_user_role');
        const userRole: 'user' | 'admin' = (savedRole === 'admin') ? 'admin' : 'user';

        const profile: UserProfile = {
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Traveller',
          email: firebaseUser.email || '',
          isFirstLogin: false,
          role: userRole
        };
        setUser(profile);
        // Only redirect if currently on landing or login to allow natural flow if needed,
        // but generally for persistence we jump to dashboard.
        if (currentScreen === AppScreen.LANDING || currentScreen === AppScreen.LOGIN) {
           setCurrentScreen(AppScreen.DASHBOARD);
        }
      } else {
        // User is signed out, wait for interaction on Landing Page
        setUser(null);
        if (currentScreen === AppScreen.DASHBOARD || currentScreen === AppScreen.TUTORIAL) {
           setCurrentScreen(AppScreen.LANDING);
        }
      }
    });

    return () => unsubscribe();
  }, [currentScreen]);

  const handleStart = () => {
    setCurrentScreen(AppScreen.LOGIN);
  };

  const handleLoginSuccess = (profile: UserProfile) => {
    setUser(profile);
    if (profile.isFirstLogin) {
      setCurrentScreen(AppScreen.TUTORIAL);
    } else {
      setCurrentScreen(AppScreen.DASHBOARD);
    }
  };

  const handleTutorialComplete = () => {
    setCurrentScreen(AppScreen.DASHBOARD);
  };

  return (
    <>
      {currentScreen === AppScreen.LANDING && (
        <LandingPage onStart={handleStart} />
      )}

      {currentScreen === AppScreen.LOGIN && (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
      
      {currentScreen === AppScreen.TUTORIAL && (
        <Tutorial onComplete={handleTutorialComplete} />
      )}
      
      {currentScreen === AppScreen.DASHBOARD && user && (
        <Dashboard user={user} />
      )}
    </>
  );
};

export default App;
