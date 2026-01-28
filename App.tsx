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

  if (showIntro) {
      return <IntroScreen onComplete={handleIntroComplete} />;
  }

  return (
    <div className="min-h-screen text-neu-text selection:bg-neu-accent selection:text-white">
      {!isLoggedIn ? (
        <AuthGateway onLogin={handleLogin} />
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