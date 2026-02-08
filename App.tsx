import React, { useState, useEffect } from 'react';
import { AuthGateway } from './components/AuthGateway';
import { Dashboard } from './components/Dashboard';
import { AINativeSpatialAgentic } from './components/AINativeSpatialAgentic';
import { ProfileSelector } from './components/ProfileSelector';
import { IntroScreen } from './components/IntroScreen';
import { UserProfile } from './types';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Check session logic here (mocked)
    const session = localStorage.getItem('wsp_session');
    // We can decide to skip intro if logged in, but for this demo, we always show intro on refresh
    // or store 'intro_seen' in session storage.
    // For now, always show intro as requested.
    if (session) {
       // logic to set login true after intro
    }
  }, []);

  const handleIntroComplete = () => {
      setShowIntro(false);
      const session = localStorage.getItem('wsp_session');
      if (session) setIsLoggedIn(true);
  };

  const handleLogin = () => {
    localStorage.setItem('wsp_session', 'active');
    setIsLoggedIn(true);
  };

  const handleSelectProfile = (profile: UserProfile) => {
    setActiveProfile(profile);
  };

  const handleSwitchProfile = () => {
    setActiveProfile(null);
  };

  return (
    <div className="min-h-screen text-neu-text selection:bg-neu-accent selection:text-white">
      {!isLoggedIn ? (
          <div className="h-[100dvh] w-full relative overflow-hidden bg-black">
             {/* Layer 1: Intro Sequence (Base Layer) */}
             <div className="absolute inset-0 z-0">
                 <IntroScreen onComplete={handleIntroComplete} />
             </div>

             {/* Layer 2: Auth Gateway (Slide-up Panel) */}
             <div 
                className={`absolute inset-0 z-10 transition-transform duration-1000 ease-in-out bg-neu-base ${showIntro ? 'translate-y-full' : 'translate-y-0'}`}
             >
                 <AuthGateway onLogin={handleLogin} />
             </div>
          </div>
      ) : !activeProfile ? (
        <ProfileSelector onSelectProfile={handleSelectProfile} />
      ) : (
        <>
          <Dashboard user={activeProfile} onSwitchProfile={handleSwitchProfile} />
          <AINativeSpatialAgentic />
        </>
      )}
    </div>
  );
}