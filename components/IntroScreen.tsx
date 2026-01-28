import React, { useState, useEffect } from 'react';
import { Sparkles, ScrollText, Play, ArrowRight } from 'lucide-react';

interface IntroScreenProps {
  onComplete: () => void;
}

type Act = 'WAYANG' | 'SENI' | 'PUJANGGA' | 'WSP';

export const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const [act, setAct] = useState<Act>('WAYANG');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextAct = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      if (act === 'WAYANG') setAct('SENI');
      else if (act === 'SENI') setAct('PUJANGGA');
      else if (act === 'PUJANGGA') setAct('WSP');
      else onComplete();
      setIsTransitioning(false);
    }, 1000);
  };

  useEffect(() => {
    if (act === 'WSP') {
      const timer = setTimeout(() => onComplete(), 4000);
      return () => clearTimeout(timer);
    }
  }, [act]);

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black overflow-hidden select-none cursor-pointer"
      onClick={nextAct}
    >
      {/* ACT 1: WAYANG (Shadow Theater) */}
      {act === 'WAYANG' && (
        <div className={`absolute inset-0 transition-opacity duration-1000 ${isTransitioning ? 'opacity-0 scale-110' : 'opacity-100'}`}>
          <div className="absolute inset-0 parchment animate-flicker"></div>
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"></div>
          
          <div className="flex flex-col items-center justify-center h-full relative z-10">
            {/* God Rays / Backlight */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-yellow-200/20 rounded-full blur-[120px] animate-pulse"></div>
            
            <div className="relative mb-12 animate-slow-zoom">
              <ScrollText size={180} className="text-black/80 wayang-shadow transform rotate-12 opacity-90" strokeWidth={1} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-black/5 rounded-full blur-xl"></div>
            </div>

            <h1 className="text-7xl md:text-9xl font-cinematic text-black/70 tracking-[0.2em] relative">
              WAYANG
              <span className="absolute -inset-1 blur-md text-black/20 opacity-50">WAYANG</span>
            </h1>
            <p className="mt-8 font-cinematic text-black/40 tracking-widest text-sm uppercase flex items-center gap-4">
              <span className="h-px w-12 bg-black/20"></span>
              The Origins of Shadow
              <span className="h-px w-12 bg-black/20"></span>
            </p>
          </div>
        </div>
      )}

      {/* ACT 2: SENI (The Art / Ink Wash) */}
      {act === 'SENI' && (
        <div className={`absolute inset-0 transition-opacity duration-1000 bg-white ${isTransitioning ? 'opacity-0 scale-90' : 'opacity-100'}`}>
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')]"></div>
          
          <div className="flex flex-col items-center justify-center h-full relative z-10 p-8">
            <div className="max-w-4xl text-center space-y-12">
               <div className="relative inline-block animate-ink-bleed">
                  <h1 className="text-8xl md:text-[12rem] font-anime text-black leading-none drop-shadow-lg">
                    Seni
                  </h1>
                  <div className="absolute -bottom-4 left-0 w-full h-2 bg-black rounded-full blur-sm opacity-10"></div>
               </div>
               
               <p className="text-xl md:text-3xl font-cinematic text-gray-800 tracking-[0.3em] uppercase animate-fade-in delay-500">
                 The Flourish of Art
               </p>
               
               <div className="flex justify-center gap-8 opacity-40">
                  <div className="w-12 h-1 bg-black"></div>
                  <Sparkles size={24} className="text-black" />
                  <div className="w-12 h-1 bg-black"></div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* ACT 3: PUJANGGA (The Sage / Cinema) */}
      {act === 'PUJANGGA' && (
        <div className={`absolute inset-0 transition-opacity duration-1000 bg-gray-950 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <div className="grain-overlay animate-film-grain"></div>
          
          <div className="flex flex-col items-center justify-center h-full relative z-20">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80"></div>
            
            {/* Cinematic Lens Flare */}
            <div className="absolute top-1/4 left-1/4 w-[120%] h-1 bg-blue-400/20 blur-2xl rotate-12"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[120%] h-1 bg-blue-500/10 blur-3xl -rotate-6"></div>

            <div className="text-center space-y-4 px-6">
              <h2 className="text-lg md:text-2xl font-cinematic text-blue-200/60 tracking-[1em] uppercase mb-8">
                Stage Three
              </h2>
              <h1 className="text-6xl md:text-9xl font-cinematic text-white tracking-[0.15em] leading-tight drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                PUJANGGA
              </h1>
              <div className="h-1 w-32 bg-white/20 mx-auto mt-12 rounded-full overflow-hidden">
                <div className="h-full bg-white/60 w-1/2 animate-infinite-scroll"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ACT 4: WSP (The Digital Resolution) */}
      {act === 'WSP' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#e0e5ec]">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-transparent h-1/3 opacity-20"></div>
          
          {/* Water Background Effect (Resolving from Act 3) */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/water.png')] animate-pulse"></div>

          <div className="relative z-10 text-center scale-110 animate-fade-in">
             <div className="relative inline-block mb-12">
                <h1 className="text-[10rem] md:text-[15rem] font-black water-text font-imax tracking-tighter drop-shadow-[15px_15px_30px_rgba(163,177,198,0.6)]">
                    WSP
                </h1>
                <div className="absolute inset-0 blur-2xl text-blue-500/10 -z-10 animate-pulse">WSP</div>
             </div>
             
             <div className="flex flex-col items-center gap-4">
                <div className="h-1 w-64 bg-neu-shadowDark/20 rounded-full shadow-neu-in overflow-hidden">
                   <div className="h-full bg-neu-accent w-full animate-progress-fast"></div>
                </div>
                <p className="font-imax text-neu-accent tracking-[0.5em] text-sm font-bold uppercase">
                  Initializing Stream
                </p>
             </div>
          </div>
        </div>
      )}

      {/* Persistent Interaction Hint */}
      {!isTransitioning && act !== 'WSP' && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 font-cinematic text-xs tracking-widest uppercase animate-bounce pointer-events-none">
          <ArrowRight className="mb-1" />
          Tap to progress
        </div>
      )}
    </div>
  );
};
