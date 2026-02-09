import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-20 mt-20 pb-10 px-4 md:px-10 flex flex-col items-center justify-center gap-6 opacity-60 hover:opacity-100 transition-opacity duration-700">
      {/* Barcode Visual */}
      <div className="h-12 flex items-stretch gap-[2px] opacity-80 mix-blend-screen">
        {[...Array(40)].map((_, i) => (
          <div 
            key={i} 
            className={`bg-white ${i % 3 === 0 ? 'w-[4px]' : 'w-[2px]'} ${i % 2 === 0 ? 'opacity-100' : 'opacity-50'}`}
          />
        ))}
      </div>
      
      <div className="text-center space-y-2">
        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] animate-pulse">
            System Update Incoming
        </p>
        <h2 className="text-2xl md:text-4xl font-black text-white mix-blend-overlay uppercase tracking-widest font-cinematic">
            COMING SOON
        </h2>
        <p className="text-[8px] font-mono text-white/30 uppercase tracking-widest pt-2">
            ID: WSP-2026-X
        </p>
      </div>
    </footer>
  );
};
