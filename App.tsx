import React, { useState, useEffect } from 'react';
import { AuthGateway } from './components/AuthGateway';
import { Dashboard } from './components/Dashboard';
import { AINativeSpatialAgentic } from './components/AINativeSpatialAgentic';
import { ProfileSelector } from './components/ProfileSelector';
import { UserProfile } from './types';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Check session logic here (mocked)
    const session = localStorage.getItem('wsp_session');
    if (session) {
       setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem('wsp_session', 'active');
    setIsLoggedIn(true);
    // If user data is provided (e.g. from Supabase), we could use it to pre-fill profiles
    // For now, we stick to the flow: Login -> Profile Selector
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
          <div className="h-screen supports-[height:100dvh]:h-[100dvh] w-full relative overflow-hidden bg-[#0b0b2b]">
             {/* Auth Gateway (Split/Popup Panel) */}
             <div className="absolute inset-0 z-10 flex flex-col md:flex-row animate-popup border-4 border-white/10 rounded-[2rem] overflow-hidden m-4 md:m-8 shadow-2xl white-glass">
                 {/* Left/Top: Visual Branding (WSP Act) */}
                 <div className="flex-[0.6] bg-transparent relative overflow-hidden hidden md:block border-r border-white/5">
                     <div className="absolute inset-0 stars opacity-30 pointer-events-none"></div>
                     <div className="h-full flex items-center justify-center">
                        <h2 className="text-4xl font-light tracking-[0.2em] text-white/80">WSP</h2>
                     </div>
                 </div>
                 {/* Right/Bottom: Auth Gateway */}
                 <div className="flex-1 md:flex-[0.4] bg-white/5 backdrop-blur-xl relative flex items-center justify-center">
                     <AuthGateway onLogin={handleLogin} />
                 </div>
             </div>
          </div>
      ) : !activeProfile ? (
        <ProfileSelector onSelectProfile={handleSelectProfile} />
      ) : (
        <>
          <Dashboard user={activeProfile} onSwitchProfile={handleSwitchProfile} />
          {/* <AINativeSpatialAgentic /> */}
        </>
      )}
    </div>
  );
}