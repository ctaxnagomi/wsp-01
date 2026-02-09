import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';

interface IntroScreenProps {
  onComplete: () => void;
}

interface EmberData { id: number, left: string, size: string, duration: string, delay: string }

const Ember: React.FC<{ data: EmberData }> = ({ data }) => {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.style.setProperty('--ember-left', data.left);
      ref.current.style.setProperty('--ember-size', data.size);
      ref.current.style.setProperty('--ember-duration', data.duration);
      ref.current.style.setProperty('--ember-delay', data.delay);
    }
  }, [data]);
  return <div ref={ref} className="silksong-ember" />;
};

export const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const [isExpanding, setIsExpanding] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [embers, setEmbers] = useState<{ id: number, left: string, size: string, duration: string, delay: string }[]>([]);

  useEffect(() => {
    // Generate random embers
    const newEmbers = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 4 + 2}px`,
      duration: `${Math.random() * 3 + 2}s`,
      delay: `${Math.random() * 5}s`
    }));
    setEmbers(newEmbers);

    // Stage 1: Show Logo with Fade & Glow
    const logoTimer = setTimeout(() => setShowLogo(true), 800);
    
    // Stage 2: Start Expansion Animation
    const expandTimer = setTimeout(() => setIsExpanding(true), 3500);
    
    // Stage 3: Complete Intro
    const completeTimer = setTimeout(() => onComplete(), 5500);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(expandTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="h-full w-full relative bg-[#020202] overflow-hidden flex items-center justify-center select-none">
      {/* ATMOSPHERIC BACKGROUND (SILKSONG STYLE) */}
      <div className={`absolute inset-0 transition-all duration-[2000ms] ease-out ${isExpanding ? 'scale-150 opacity-0' : 'scale-100 opacity-100'}`}>
        
        {/* Deep Atmosphere Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2a1a0a] via-[#0a0a0a] to-black opacity-60"></div>
        
        {/* God Rays / Backlight */}
        <div className="absolute inset-0 silksong-god-rays opacity-30"></div>

        {/* Far Silhouette Layer */}
        <div className="intro-silhouette-far opacity-50"></div>
        
        {/* Middle Silhouette Layer */}
        <div className="intro-silhouette-mid"></div>
        
        {/* Foreground Silhouette Layer */}
        <div className="intro-silhouette-near"></div>

        {embers.map(ember => <Ember key={ember.id} data={ember} />)}
      </div>

      {/* Main Cinematic Logo */}
      <div className={`relative z-10 transition-all duration-[2000ms] cubic-bezier(0.23, 1, 0.32, 1) ${showLogo ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
        <div className={`flex flex-col items-center transition-all duration-[2500ms] ${isExpanding ? 'scale-150 blur-2xl opacity-0' : 'scale-100'}`}>
          <div className="space-y-4 text-center">
             <h1 className="text-6xl md:text-[12rem] font-bold text-white tracking-[0.4em] font-imax wsp-glow-text animate-flicker translate-x-[0.2em]">
                WSP
             </h1>
             <div className="h-px w-32 md:w-64 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Expansion Overlay Effect into Dashboard */}
      <div className={`absolute inset-0 z-50 transition-all duration-[1500ms] ease-in-out pointer-events-none ${isExpanding ? 'bg-black/40 backdrop-blur-3xl' : 'bg-transparent backdrop-blur-0'}`}></div>
    </div>
  );
};
