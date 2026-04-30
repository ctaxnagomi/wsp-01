import React, { useState, useEffect } from 'react';

interface IntroScreenProps {
  onComplete: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const [isExpanding, setIsExpanding] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Stage 1: Show content with fade and float
    const contentTimer = setTimeout(() => setShowContent(true), 500);
    
    // Stage 2: Start transition to main app
    const transitionTimer = setTimeout(() => setIsExpanding(true), 4000);
    
    // Stage 3: Complete Intro
    const completeTimer = setTimeout(() => onComplete(), 5500);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(transitionTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="intro-container h-full w-full flex items-center justify-center select-none">
      {/* Background Effect */}
      <div className="stars"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>

      {/* White Glass Intro Box */}
      <div 
        className={`z-10 bg-white/10 backdrop-blur-2xl border border-white/20 p-10 md:p-20 rounded-[3rem] shadow-[0_8px_32px_0_rgba(255,255,255,0.05)] text-center transition-all duration-[2000ms] cubic-bezier(0.23, 1, 0.32, 1) 
          ${showContent ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}
          ${isExpanding ? 'blur-3xl scale-125 opacity-0' : ''}`}
      >
        <div className="space-y-8">
          <div className="flex flex-col items-center gap-1">
            <h1 className="text-5xl md:text-8xl font-black tracking-[0.4em] text-white/95 font-cinematic">
              WSP MAX
            </h1>
          </div>

          <div className="h-px w-32 md:w-64 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto"></div>
          
          <div className="space-y-2">
            <p className="text-xs md:text-xl font-light text-white/70 tracking-[0.3em] uppercase">
               Cinematic Experience
            </p>
            <p className="text-[8px] md:text-xs font-black text-white/20 uppercase tracking-[1em] ml-[1em]">
               Pujangga Digital
            </p>
          </div>
        </div>
      </div>

      {/* Transition Overlay */}
      <div className={`absolute inset-0 z-50 transition-all duration-[1500ms] ease-in-out pointer-events-none 
        ${isExpanding ? 'bg-white/10 backdrop-blur-3xl' : 'bg-transparent backdrop-blur-0'}`}>
      </div>
    </div>
  );
};
