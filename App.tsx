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
          <div className="h-screen w-full flex flex-col md:grid md:grid-cols-2 overflow-hidden">
             {/* Left/Top: Intro Sequence (Visualization) */}
             <div className="h-[40vh] md:h-full w-full relative">
                 <IntroScreen onComplete={handleIntroComplete} />
             </div>

             {/* Right/Bottom: Auth Gateway */}
             <div className="flex-1 md:h-full w-full relative shadow-2xl z-20">
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