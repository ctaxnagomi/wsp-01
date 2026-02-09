import React, { useMemo, useLayoutEffect, useRef } from 'react';
import { BarChart3, Film, Tv, PlayCircle, Filter } from 'lucide-react';
import { Movie } from '../types';

interface AnalyticsSectionProps {
  history: Movie[];
  className?: string;
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ history, className = "" }) => {
  const stats = useMemo(() => {
    const movies = history.filter(m => m.media_type === 'movie').length;
    const series = history.filter(m => m.media_type === 'tv').length;
    // For anime, we check if genre includes 'Animation' or specifically for Japenese titles
    const anime = history.filter(m => m.genre.some(g => g.toLowerCase().includes('animation'))).length; 
    
    return { movies, series, anime, total: history.length };
  }, [history]);

  const movieRef = useRef<HTMLDivElement>(null);
  const seriesRef = useRef<HTMLDivElement>(null);
  const animeRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (movieRef.current) movieRef.current.style.setProperty('--progress-width', `${(stats.movies / (stats.total || 1)) * 100}%`);
    if (seriesRef.current) seriesRef.current.style.setProperty('--progress-width', `${(stats.series / (stats.total || 1)) * 100}%`);
    if (animeRef.current) animeRef.current.style.setProperty('--progress-width', `${(stats.anime / (stats.total || 1)) * 100}%`);
  }, [stats]);

  return (
    <div className={`p-6 md:p-10 glass-dark rounded-[2.5rem] border border-white/10 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="space-y-2">
          <h3 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3 tracking-wider font-cinematic uppercase">
            <BarChart3 className="text-neu-accent" size={28} /> Viewing Analytics
          </h3>
          <p className="text-xs font-bold text-white/40 uppercase tracking-[0.2em]">Stored locally on your device</p>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="px-4 py-2 glass-light rounded-2xl flex items-center gap-2 border border-white/10">
                <Filter size={14} className="text-white/60" />
                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Filter by type</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Stories" 
          value={stats.total} 
          icon={<PlayCircle size={20} />} 
          color="bg-white" 
          textColor="text-black"
        />
        <StatCard 
          label="Cinematic Movies" 
          value={stats.movies} 
          icon={<Film size={20} />} 
          color="bg-blue-500/20" 
          textColor="text-blue-400"
        />
        <StatCard 
          label="Legendary Series" 
          value={stats.series} 
          icon={<Tv size={20} />} 
          color="bg-purple-500/20" 
          textColor="text-purple-400"
        />
        <StatCard 
          label="Anime Collections" 
          value={stats.anime} 
          icon={<SparklesIcon size={20} />} 
          color="bg-pink-500/20" 
          textColor="text-pink-400"
        />
      </div>

      {/* Visual Progress Bars */}
      <div className="mt-12 space-y-4">
        <div className="flex justify-between text-[10px] font-black uppercase text-white/40 tracking-widest">
            <span>Library Saturation</span>
            <span>{Math.round((stats.total / 100) * 100)}% Capacity</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex">
            <div ref={movieRef} className="analytics-progress-chunk bg-blue-500"></div>
            <div ref={seriesRef} className="analytics-progress-chunk bg-purple-500"></div>
            <div ref={animeRef} className="analytics-progress-chunk bg-pink-500"></div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string, value: number, icon: React.ReactNode, color: string, textColor: string }> = ({ label, value, icon, color, textColor }) => (
  <div className="glass-light p-6 rounded-3xl border border-white/5 hover:border-white/20 transition-all group hover:translate-y-[-4px]">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-10 h-10 rounded-2xl ${color} flex items-center justify-center text-white shadow-xl`}>
        {icon}
      </div>
      <span className={`text-2xl font-black ${textColor}`}>{value}</span>
    </div>
    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{label}</p>
  </div>
);

const SparklesIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
    </svg>
);
