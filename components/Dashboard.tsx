import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { NeuCard, NeuInput, NeuIconButton, NeuButton } from './NeumorphicUI';
import { 
  Play, Info, Search, Plus, Star, LogOut, ChevronDown, 
  X, ChevronLeft, ChevronRight, Download, Copy, 
  Facebook, Instagram, Twitter, MessageCircle, 
  Maximize, Minimize, SkipForward, Pause, Captions, FileText, Send, Share2,
  AlertCircle, RefreshCw, Tv, Film, Layers, Monitor, Users, Link as LinkIcon, Check,
  TrendingUp, Clock, Bookmark, PlayCircle, Eye, ScrollText, Loader2, ArrowRight, Sparkles,
  History
} from 'lucide-react';
import { AnalyticsSection } from './AnalyticsSection';
import { Footer } from './Footer';
import { Movie, UserProfile } from '../types';
import { generateChatResponse, generateSpatialDiscovery } from '../services/geminiService';
import { fetchTrending, searchMulti, fetchByDecade, fetchByGenre, fetchAnime, fetchByCompany, fetchByQuery, fetchDetails, fetchSeasonDetails } from '../services/tmdb';
import { watchPartyService, PartyUpdate } from '../services/watchPartyService';

const VIDSRC_URL = import.meta.env.VITE_VIDSRC_URL || 'https://vidnest.fun';
const VIDFAST_URL = 'https://vidfast.pro';

// Content data
const MOCK_CONTENT: (Movie & { video_id: string })[] = [
  { 
    id: 1, 
    title: 'The Shawshank Redemption', 
    rating: 9.3, 
    release_date: '1994', 
    media_type: 'movie',
    poster_path: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', 
    backdrop_path: 'https://image.tmdb.org/t/p/original/kXfqcd0tIuTlnEhdB9asBuhg9z.jpg', 
    overview: 'Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden.', 
    genre: ['Drama', 'Crime'],
    video_id: 'NmzuHjWmXOc'
  },
  { 
    id: 2, 
    title: 'The Godfather', 
    rating: 9.2, 
    release_date: '1972', 
    media_type: 'movie',
    poster_path: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', 
    backdrop_path: 'https://image.tmdb.org/t/p/original/rSPw7tgCH9c6NqICZef4kZjFOQ5.jpg', 
    overview: 'Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge.', 
    genre: ['Drama', 'Crime'],
    video_id: 'UaVTIH8mujA'
  },
  { 
    id: 3, 
    title: 'The Dark Knight', 
    rating: 9.0, 
    release_date: '2008', 
    media_type: 'movie',
    poster_path: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', 
    backdrop_path: 'https://image.tmdb.org/t/p/original/nMKdUUepR0i5cvHjgNP48uPHKjd.jpg', 
    overview: 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.', 
    genre: ['Action', 'Crime', 'Drama'],
    video_id: 'EXeTwQWrcwY'
  },
  { 
    id: 4, 
    title: 'Breaking Bad', 
    rating: 9.5, 
    release_date: '2008', 
    media_type: 'tv',
    total_seasons: 5,
    poster_path: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pBasCherfkaSL.jpg', 
    backdrop_path: 'https://image.tmdb.org/t/p/original/tsuQN755ODlI0wQkfKqjVR15Ed6.jpg', 
    overview: 'When Walter White, a New Mexico chemistry teacher, is diagnosed with Stage III cancer and given a prognosis of only two years left to live. He becomes filled with a sense of fearlessness and an unrelenting desire to secure his family\'s financial future at any cost as he enters the dangerous world of drugs and crime.', 
    genre: ['Drama', 'Crime'],
    video_id: 'HhesaQXLuRY'
  },
  { 
    id: 5, 
    title: 'Game of Thrones', 
    rating: 9.3, 
    release_date: '2011', 
    media_type: 'tv',
    total_seasons: 8,
    poster_path: 'https://image.tmdb.org/t/p/w500/1XS1qyL1tl6eVxi9yJ26EwM9v98.jpg', 
    backdrop_path: 'https://image.tmdb.org/t/p/original/2OMB0yn59o8bJOnJnBOpxL2vnFc.jpg', 
    overview: 'Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north. Amidst the war, a neglected military order of misfits, the Night\'s Watch, is all that stands between the realms of men and icy horrors beyond.', 
    genre: ['Sci-Fi', 'Drama', 'Action'],
    video_id: 'KPLWWIOCOOQ'
  },
  { 
    id: 6, 
    title: 'Pulp Fiction', 
    rating: 8.9, 
    release_date: '1994', 
    media_type: 'movie',
    poster_path: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', 
    backdrop_path: 'https://image.tmdb.org/t/p/original/suaEOtk1916guXlVTckV52XZK04.jpg', 
    overview: 'A burger-loving hit man, his philosophical partner, a drug-addled gangster\'s moll and a washed-up boxer converge in this sprawling, comedic crime caper. Their adventures unfurl in three stories that ingeniously trip back and forth in time.', 
    genre: ['Thriller', 'Crime'],
    video_id: 's7EdQ4FqbhY'
  },
  {
    id: 7,
    title: 'Chernobyl',
    rating: 9.4,
    release_date: '2019',
    media_type: 'tv',
    total_seasons: 1,
    poster_path: 'https://image.tmdb.org/t/p/w500/hlLXt2tOPT6iUdi33qG9RCftAJ.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg',
    overview: 'In April 1986, an explosion at the Chernobyl nuclear power plant in the Union of Soviet Socialist Republics becomes one of the world\'s worst man-made catastrophes.',
    genre: ['Drama', 'History'],
    video_id: 's9APLXM9Ei8'
  },
  {
      id: 8,
      title: 'Interstellar',
      rating: 8.7,
      release_date: '2014',
      media_type: 'movie',
      poster_path: 'https://image.tmdb.org/t/p/w500/gEU2QniL6C8zEfVbS9fCl7nhdDV.jpg',
      backdrop_path: 'https://image.tmdb.org/t/p/original/xJHokMBLkbke0umzh205HGc1fp2.jpg',
      overview: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
      genre: ['Sci-Fi', 'Adventure'],
      video_id: 'zSWdZVtXT7E'
  }
];

const Section: React.FC<{ 
  title: string, 
  subtitle?: string, 
  icon?: React.ReactNode, 
  rightElement?: React.ReactNode, 
  movies: Movie[], 
  onPlay: (m: Movie) => void, 
  onViewArchive?: () => void,
  onRemove?: (m: Movie) => void,
  onToggleWatchLater?: (m: Movie) => void,
  onMarkWatched?: (m: Movie) => void,
  isWatched?: (id: number) => boolean,
  isInWatchLater?: (id: number) => boolean,

  kidsMode?: boolean,
  showRanking?: boolean
}> = ({ title, subtitle, icon, rightElement, movies, onPlay, onViewArchive, onRemove, onToggleWatchLater, onMarkWatched, isWatched, isInWatchLater, kidsMode, showRanking }) => (
  <div className="space-y-4 md:space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 px-2">
        <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white font-cinematic flex items-center gap-2 sm:gap-3 tracking-wider">
                <span className="flex-shrink-0">{icon}</span> {title}
            </h3>
            {subtitle && <p className="text-[10px] sm:text-xs font-bold text-white/40 uppercase tracking-[0.2em]">{subtitle}</p>}
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
            {rightElement}
            {onViewArchive && (
                <button 
                    onClick={onViewArchive}
                    className="text-[10px] sm:text-xs font-black text-white/80 uppercase tracking-widest px-4 py-2 glass-dark rounded-full hover:bg-white/10 transition-all border border-white/5"
                >
                    View Archive
                </button>
            )}
        </div>
    </div>
    
    <div className={`flex overflow-x-auto gap-4 sm:gap-8 pt-10 pb-6 sm:pb-10 px-4 sm:px-8 no-scrollbar snap-x snap-mandatory ${kidsMode ? 'px-8' : ''}`}>
      {movies.map((movie, index) => (
        <div key={movie.id} className={`min-w-[140px] sm:min-w-[200px] md:min-w-[260px] snap-start group cursor-pointer transition-all duration-300 ease-out relative z-10 hover:z-50 scale-95 hover:scale-105 ${kidsMode ? 'kids-card-hover' : ''}`}>
           <div onClick={() => onPlay(movie)} className="relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden glass-card mb-3 sm:mb-6 aspect-[10/14] border-2 sm:border-4 border-transparent group-hover:border-white/30 transition-all shadow-2xl">
              <img src={movie.poster_path} alt={movie.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              
              {/* Hover Overlay: Synopsis */}
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-end p-4 sm:p-6 backdrop-blur-md">
                 <div className="flex-1 flex items-center justify-center">
                    <div className="w-10 h-10 sm:w-16 sm:h-16 glass rounded-full flex items-center justify-center text-white scale-50 group-hover:scale-100 transition-transform shadow-neon mb-4">
                        <PlayCircle size={24} className="sm:w-10 sm:h-10" fill="white" />
                    </div>
                 </div>
                 
                 <div className="w-full bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-[10px] sm:text-xs text-white/90 line-clamp-3 leading-relaxed font-sans text-center">
                        {movie.overview}
                    </p>
                 </div>
              </div>
              
              {/* Ranking or Rating Badge */}
              <div className="absolute top-1 left-1 z-20">
                 {showRanking ? (
                     <div className="glass-dark px-1.5 py-0.5 rounded-md text-[10px] font-black text-yellow-400 font-cinematic border border-yellow-500/30 shadow-lg flex items-center justify-center min-w-[20px]">
                        <span className="text-[6px] text-white/40 mr-0.5 mt-[1px]">#</span>{index + 1}
                     </div>
                 ) : (
                     <div className="glass-dark px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[6px] sm:text-[8px] font-black text-white uppercase tracking-widest border border-white/10">
                        {movie.rating} Rating
                     </div>
                 )}
              </div>

              {/* Rating moved to bottom left if Ranking is shown */}
              {showRanking && (
                  <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 z-20 opacity-100 group-hover:opacity-0 transition-opacity">
                     <div className="glass-dark px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[6px] sm:text-[8px] font-black text-white uppercase tracking-widest border border-white/10">
                        {movie.rating} Rating
                     </div>
                  </div>
              )}

              {!onRemove && !kidsMode && (
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onToggleWatchLater?.(movie); }}
                        title={isInWatchLater?.(movie.id) ? "Remove from Watch Later" : "Add to Watch Later"}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all border border-white/10 ${isInWatchLater?.(movie.id) ? 'bg-white text-black' : 'glass-dark text-white/60 hover:text-white'}`}
                    >
                        {isInWatchLater?.(movie.id) ? <Check size={16} /> : <Plus size={16} />}
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onMarkWatched?.(movie); }}
                        title={isWatched?.(movie.id) ? "Watched" : "Mark as Watched"}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all border border-white/10 ${isWatched?.(movie.id) ? 'bg-green-500 text-white' : 'glass-dark text-white/60 hover:text-white'}`}
                    >
                        <Eye size={16} />
                    </button>
                  </div>
              )}

              {onRemove && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onRemove(movie); }}
                    title="Remove from List"
                    className="absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 glass-dark rounded-full flex items-center justify-center text-white/60 hover:text-red-400 hover:bg-black/60 transition-all z-20 border border-white/10"
                  >
                    <X size={16} />
                  </button>
              )}
              
              {!onRemove && movie.media_type === 'tv' && (
                  <div className={`absolute top-2 left-2 sm:top-4 sm:left-4 z-10 transition-opacity ${!kidsMode ? 'group-hover:opacity-0' : ''}`}>
                    <div className="bg-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[6px] sm:text-[8px] font-black text-black uppercase tracking-widest shadow-lg">
                        Serial
                    </div>
                  </div>
              )}
           </div>
           
           <div onClick={() => onPlay(movie)} className="space-y-1 sm:space-y-2 px-1 sm:px-2 group-hover:translate-x-1 transition-transform">
               <h4 className="font-bold text-white text-sm sm:text-lg truncate tracking-wide">{movie.title}</h4>
               <div className="flex items-center gap-2 sm:gap-3 text-[8px] sm:text-[10px] font-bold text-white/40 uppercase tracking-widest">
                 <span>{movie.release_date}</span>
                 <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                 <span className="truncate">{movie.genre[0]}</span>
               </div>
           </div>
        </div>
      ))}
    </div>
  </div>
);

interface DashboardProps {
  user: UserProfile;
  onSwitchProfile: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onSwitchProfile }) => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [pixarMovies, setPixarMovies] = useState<Movie[]>([]);
  const [disneyMovies, setDisneyMovies] = useState<Movie[]>([]);
  const [kidsHits, setKidsHits] = useState<Movie[]>([]);
  const [toddlerMovies, setToddlerMovies] = useState<Movie[]>([]);
  const [juniorMovies, setJuniorMovies] = useState<Movie[]>([]);
  const [localHeroes, setLocalHeroes] = useState<Movie[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'movie' | 'tv'>('all');

  // Player State
  const [leftTabOpen, setLeftTabOpen] = useState(false);
  const [rightTabOpen, setRightTabOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCaptionsOn, setIsCaptionsOn] = useState(false);
  
  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Fun Mode State
  const [funMode, setFunMode] = useState(false);
  const [funYear, setFunYear] = useState<number | null>(null);
  const [showFunSelector, setShowFunSelector] = useState(false);
  
  // Kids Mode State
  const [kidsMode, setKidsMode] = useState(false);

  // View Modes
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Watchparty State
  const [isWatchParty, setIsWatchParty] = useState(false);
  const [partyCode, setPartyCode] = useState<string | null>(null);
  const [partyLink, setPartyLink] = useState<string | null>(null);
  const [partyCapacity, setPartyCapacity] = useState(5);
  const [partyMembers, setPartyMembers] = useState<{username: string, status: string, link: string}[]>([]);
  const [partyChatMsg, setPartyChatMsg] = useState('');
  const [partyMessages, setPartyMessages] = useState<{user: string, text: string}[]>([
      {user: 'System', text: 'Welcome to the WSP Public Square!'}
  ]);
  const [isJoining, setIsJoining] = useState(false);
  const [joinInput, setJoinInput] = useState('');
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const partyChatEndRef = useRef<HTMLDivElement>(null);
  const partyChatEndRefOriginal = useRef<HTMLDivElement>(null);

  // Category & Quick Action State
  const [selectedCategory, setSelectedCategory] = useState('Originals');
  const [sortBy, setSortBy] = useState('popularity.desc'); // 'popularity.desc' | 'vote_average.desc' | 'primary_release_date.desc'
  const [showHistoryToast, setShowHistoryToast] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  
  // Watch Later State
  // Supabase Integration & Watch Later State
  // Watch Later State
  const [watchLater, setWatchLater] = useState<Movie[]>(() => {
      const saved = localStorage.getItem('watchLater');
      return saved ? JSON.parse(saved) : [];
  });

  const [watchHistory, setWatchHistory] = useState<Movie[]>(() => {
      const saved = localStorage.getItem('watchHistory');
      return saved ? JSON.parse(saved) : [];
  });

  // Native Spatial Agentic State
  const [spatialTracking, setSpatialTracking] = useState(false);
  const [spatialContextLog, setSpatialContextLog] = useState<string[]>([]);
  const [lastFrameBuffer, setLastFrameBuffer] = useState<string | null>(null);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (spatialTracking && selectedMovie && playerContainerRef.current) {
      interval = setInterval(async () => {
        try {
          const canvas = await html2canvas(playerContainerRef.current!, {
            scale: 0.5, // Low resolution for efficiency
            logging: false,
            useCORS: true,
            backgroundColor: null
          });
          const dataUrl = canvas.toDataURL('image/webp', 0.5);
          setLastFrameBuffer(dataUrl);
          const timestamp = new Date().toLocaleTimeString();
          setSpatialContextLog(prev => [`[${timestamp}] Spatial frame captured (low-res buffer)...`, ...prev].slice(0, 10));
        } catch (err) {
          console.warn('Spatial capture skipped (CORS/Ref issue)');
        }
      }, 300);
    }
    return () => clearInterval(interval);
  }, [spatialTracking, selectedMovie]);

  const handleAgenticControl = (command: 'pause' | 'play' | 'seek', value?: number) => {
    console.log(`xScribe Agentic Action: ${command}`, value);
  };


  useEffect(() => {
      localStorage.setItem('watchLater', JSON.stringify(watchLater));
  }, [watchLater]);

  useEffect(() => {
      localStorage.setItem('watchHistory', JSON.stringify(watchHistory));
  }, [watchHistory]);

  const addToHistory = (movie: Movie) => {
      setWatchHistory(prev => {
          const filtered = prev.filter(m => m.id !== movie.id);
          return [movie, ...filtered].slice(0, 50); // Keep last 50
      });
  };

  const GENRE_MAP: Record<string, number> = {
      'Action': 28,
      'Sci-Fi': 878,
      'Historical': 36,
      'Documentary': 99,
      'Drama': 18,
      'Legends': 12, // Adventure
  };

  useEffect(() => {
      // Always sync to local storage as backup/cache
      localStorage.setItem('watchLater', JSON.stringify(watchLater));
  }, [watchLater]);

  const toggleWatchLater = async (movie: Movie) => {
      const isAlreadyAdded = watchLater.some(m => m.id === movie.id);
      
      // Optimistic Update
      setWatchLater(prev => {
          if (isAlreadyAdded) {
              return prev.filter(m => m.id !== movie.id);
          } else {
              return [...prev, movie];
          }
      });
  };

  // TV Show Specific State
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [sxeInput, setSxeInput] = useState('S1E1');
  const [videoSource, setVideoSource] = useState<'pluto' | 'uranus'>('uranus');
  const [activeSubtitle, setActiveSubtitle] = useState<string | null>(null);
  const [totalSeasonsCount, setTotalSeasonsCount] = useState<number>(1);
  const [episodesInCurrentSeason, setEpisodesInCurrentSeason] = useState<number>(0);
  const [adClicksCount, setAdClicksCount] = useState(0);

  // Redirect Guard & Focus Handling
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // If we are in the middle of a watchparty or playing video, warn the user
      // External redirects from iframes often try to navigate the top window
      if (document.activeElement?.tagName === 'IFRAME') {
         e.preventDefault();
         return (e.returnValue = "Are you sure you want to leave? An external site is trying to redirect you.");
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Handle content changes - Reset Ad Clicks
  useEffect(() => {
    setAdClicksCount(0);
  }, [selectedMovie, selectedSeason, selectedEpisode]);

  const getSubtitles = (movie: Movie) => {
    return [
        { id: 'en', lang: 'English', format: 'SRT', url: 'https://raw.githubusercontent.com/subtitles/english.srt' },
        { id: 'ms', lang: 'Bahasa Melayu', format: 'SRT', url: 'https://raw.githubusercontent.com/subtitles/malay.srt' },
        { id: 'zh', lang: 'Mandarin', format: 'SRT', url: 'https://raw.githubusercontent.com/subtitles/chinese.srt' },
    ];
  };

  const downloadSubtitle = (sub: any, movieTitle: string) => {
    const dummyContent = `1\n00:00:01,000 --> 00:00:04,000\n[${sub.lang} Subtitles for ${movieTitle}]\nEnjoy the movie!`;
    const blob = new Blob([dummyContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${movieTitle.replace(/\s+/g, '_')}_${sub.lang}.srt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleSxEChange = (val: string) => {
    setSxeInput(val);
    const match = val.match(/s(\d+)e(\d+)/i);
    if (match) {
        setSelectedSeason(parseInt(match[1]));
        setSelectedEpisode(parseInt(match[2]));
    }
  };
  
  // Xscribe State
  const [transcript, setTranscript] = useState('');
  const [xScribeContext, setXScribeContext] = useState('');
  const [transcriptError, setTranscriptError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const transcriptRef = useRef<HTMLDivElement>(null);

  // Archive State
  const [showArchive, setShowArchive] = useState(false);
  const [archiveData, setArchiveData] = useState<{
      movies: Movie[];
      tv: Movie[];
      anime: Movie[];
  }>({ movies: [], tv: [], anime: [] });
  const [archiveSort, setArchiveSort] = useState('popularity.desc');

  const handleOpenArchive = async () => {
      setShowArchive(true);
      // Fetch data if empty or needed
      if (archiveData.movies.length === 0) {
          const [movies, tv, anime] = await Promise.all([
              fetchTrending('movie'),
              fetchTrending('tv'),
              fetchAnime(archiveSort) // Using default sort initially
          ]);
          setArchiveData({ 
              movies: movies.slice(0, 20), 
              tv: tv.slice(0, 20), 
              anime: anime.slice(0, 20) 
          });
      }
  };

  useEffect(() => {
      if (showArchive) {
          const loadArchive = async () => {
                const [movies, tv, anime] = await Promise.all([
                    fetchTrending('movie'), 
                    fetchTrending('tv'),
                    fetchAnime(archiveSort)
                ]);
                setArchiveData({ 
                    movies: movies.slice(0, 20), 
                    tv: tv.slice(0, 20), 
                    anime: anime.slice(0, 20) 
                });
          };
          loadArchive();
      }
  }, [archiveSort]);

  useEffect(() => {
    const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Initial Fetch
    const loadContent = async () => {
         if (funMode && funYear) {
            const movies = await fetchByDecade(funYear, 'movie');
            const tvs = await fetchByDecade(funYear, 'tv');
            setTrendingMovies([...movies, ...tvs].sort(() => Math.random() - 0.5));
            setRecommendedMovies(movies);
         } else if (selectedCategory === 'Originals' || kidsMode) { // Fetch kids data if on Originals OR if kidsMode is active
             const [trending, recommended, pixar, disney, boboiboy, upinipin, toddler, junior, classics, educational] = await Promise.all([
                 fetchTrending(),
                 fetchTrending(), // Using trending as fallback for recommended
                 fetchByCompany(3), // Pixar
                 fetchByCompany(2), // Disney
                 fetchByQuery('BoBoiBoy'),
                 fetchByQuery('Upin & Ipin'),
                 fetchByGenre(16, 'movie', 'popularity.desc'), // Animation as base for toddler
                 fetchByGenre(12, 'movie', 'popularity.desc'), // Adventure as base for junior
                 fetchByQuery('Toy Story Monsters Inc A Bug\'s Life'), // Specific classics
                 fetchByQuery('Bluey Sesame Street Mickey Mouse Clubhouse Dora') // Educational content
             ]);
             setTrendingMovies(trending);
             setRecommendedMovies(recommended);
             setPixarMovies([...pixar, ...classics].filter((m: Movie) => m.rating > 7).sort(() => Math.random() - 0.5));
             setDisneyMovies(disney);
             setKidsHits([...trending, ...recommended].filter((m: Movie) => m.rating > 8));
             setLocalHeroes([...boboiboy, ...upinipin]);
             setToddlerMovies([...educational, ...toddler].filter((m: Movie) => m.genre.includes('Family') || m.genre.includes('Animation')).sort(() => Math.random() - 0.5));
             setJuniorMovies(junior.filter((m: Movie) => m.rating > 5)); 
         } else if (GENRE_MAP[selectedCategory]) {
            const genreId = GENRE_MAP[selectedCategory];
            // Fetch based on category and current sort
            const results = await fetchByGenre(genreId, 'movie', sortBy);
            setTrendingMovies(results.slice(0, 15)); // Top 15 Limit
         } else if (selectedCategory === 'Watch Later') {
            // Watch later is handled locally, but we might want to clear trending
            setTrendingMovies(watchLater);
         }
    };
    loadContent();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [funMode, funYear, selectedCategory, sortBy]); // Re-run when sort or category changes

  useEffect(() => {
    const performSearch = async () => {
        if (searchTerm.length > 2) {
            const results = await searchMulti(searchTerm);
            setTrendingMovies(results);
        } else if (searchTerm.length === 0) {
             const trending = await fetchTrending();
             setTrendingMovies(trending);
        }
    };
    const debounce = setTimeout(performSearch, 500);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  useEffect(() => {
    if (selectedMovie) {
        setTranscript('');
        setTranscriptError(null);
        setLeftTabOpen(false);
        setRightTabOpen(false);
        setIsPlaying(true);
        setIsCaptionsOn(false);
        setIsTheaterMode(false);
        setIsWatchParty(false);
        setIsFullscreen(false);
        setSelectedSeason(1);
        setSelectedEpisode(1);
        setVideoSource('uranus');
    }
  }, [selectedMovie]);

  useEffect(() => {
    if (transcript && transcriptRef.current) {
        transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  useEffect(() => {
    if (partyChatEndRef.current) {
        partyChatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [partyMessages]);

  useEffect(() => {
    // Initialize WatchParty Service
    const peerId = watchPartyService.init(user.name, (update: PartyUpdate) => {
        switch (update.type) {
            case 'PLAYBACK':
                setIsPlaying(update.payload.isPlaying);
                // In a true production player, we would sync time here if the API allowed
                break;
            case 'CHAT':
                setPartyMessages(prev => [...prev, update.payload]);
                break;
            case 'MEMBERS':
                const members = update.payload.map((id: string) => ({
                    username: id.split('-')[1] || 'Guest',
                    status: 'success',
                    link: 'Connected'
                }));
                // Add ourselves to the list
                setPartyMembers([{ username: user.name + ' (You)', status: 'success', link: 'Host' }, ...members]);
                break;
            case 'SYNC_REQUEST':
                // Host sends current state to the new joiner
                watchPartyService.broadcast({
                    type: 'PLAYBACK',
                    payload: { isPlaying, currentTime: 0, timestamp: Date.now() }
                });
                break;
        }
    });

    return () => {
        watchPartyService.disconnect();
    };
  }, [user.name]);

  useEffect(() => {
    const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Fetch TV Details and Season Info
  useEffect(() => {
    const fetchTVDetails = async () => {
      if (selectedMovie && selectedMovie.media_type === 'tv') {
        const details = await fetchDetails(selectedMovie.id, 'tv');
        if (details) {
          setTotalSeasonsCount(details.number_of_seasons || 1);
        }
      }
    };
    fetchTVDetails();
  }, [selectedMovie]);

  useEffect(() => {
    const fetchSeasonInfo = async () => {
      if (selectedMovie && selectedMovie.media_type === 'tv') {
        const seasonInfo = await fetchSeasonDetails(selectedMovie.id, selectedSeason);
        if (seasonInfo && seasonInfo.episodes) {
          setEpisodesInCurrentSeason(seasonInfo.episodes.length);
        }
      }
    };
    fetchSeasonInfo();
  }, [selectedMovie, selectedSeason]);

  // Featuring Carousel Auto-play
  useEffect(() => {
    if (trendingMovies.length === 0 || selectedMovie) return;
    
    const interval = setInterval(() => {
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentSlide((prev) => (prev + 1) % Math.min(trendingMovies.length, 10));
            setIsAnimating(false);
        }, 500); // Half of transition time
    }, 8000);

    return () => clearInterval(interval);
  }, [trendingMovies.length, selectedMovie]);

  // Kids Mode Filter: Strict Zero-Tolerance
  const filterKidsContent = (movies: Movie[]) => {
      if (!kidsMode) return movies;
      const blacklist = ['fallout', 'gore', 'bloody', 'horror', 'violence', 'zombie', 'dead', 'stranger things', 'bridgerton', 'squid game', 'the last of us', 'the rings of power'];
      
      return movies.filter(m => {
          const title = m.title.toLowerCase();
          const overview = m.overview.toLowerCase();
          
          // 1. Blacklist check
          if (blacklist.some(word => title.includes(word) || overview.includes(word))) return false;
          
          // 2. Genre check: Must have Animation (16) or Family (10751)
          const isKidsGenre = m.genre.some(g => ['Animation', 'Family'].includes(g));
          
          // 3. Fallback check for safe categories if Animation/Family is missing but it's highly rated and safe
          // Actually, let's stick to the strict rule: Animation or Family is a MUST.
          return isKidsGenre;
      });
  };

  const kidsPool = [...pixarMovies, ...disneyMovies, ...toddlerMovies, ...juniorMovies, ...localHeroes];
  const carouselPool = kidsMode ? (kidsPool.length > 0 ? kidsPool : filterKidsContent(trendingMovies)) : trendingMovies;

  const featuredContent = carouselPool.length > 0 
      ? carouselPool[currentSlide % Math.max(1, carouselPool.length)] 
      : (trendingMovies.length > 0 ? trendingMovies[0] : null); // Fallback to first trending if pool is empty

  const trendingContent = filterKidsContent(trendingMovies).filter(m => m.id !== featuredContent?.id && (activeTab === 'all' || m.media_type === activeTab));
  const recommendedContent = filterKidsContent(recommendedMovies).filter(m => activeTab === 'all' || m.media_type === activeTab);
  
  // Filter Logic
  let filteredContent = trendingMovies;
  if (selectedCategory === 'Watch Later') {
      filteredContent = watchLater;
  }

  const toggleFullscreen = async () => {
    // Prefer targeting the iframe for better performance (less layout thrashing/lag)
    const target = iframeRef.current || playerContainerRef.current;
    if (!target) return;

    if (!document.fullscreenElement) {
        try {
            await target.requestFullscreen();
        } catch (err) { console.error("Fullscreen Error:", err); }
    } else {
        document.exitFullscreen();
    }
  };

  const toggleWatchParty = () => {
      const newState = !isWatchParty;
      setIsWatchParty(newState);
      if (newState) {
          const hostId = watchPartyService.createRoom();
          const link = `${window.location.origin}?party=${hostId}`;
          setPartyCode(hostId.split('-').slice(-1)[0]); // Last part of ID as code
          setPartyLink(link);
          setRightTabOpen(true);
          setPartyMembers([{ username: user.name + ' (You)', status: 'success', link: 'Host' }]);
      } else {
          watchPartyService.disconnect();
          setPartyCode(null);
          setPartyLink(null);
          setPartyMembers([]);
      }
  };

  const handleJoinParty = () => {
      if (!joinInput.trim()) return;
      setIsJoining(true);
      watchPartyService.joinRoom(joinInput.trim());
      setIsWatchParty(true);
      setRightTabOpen(true);
      setTimeout(() => setIsJoining(false), 1000);
  };

  const handleSendPartyMessage = () => {
      if(!partyChatMsg.trim()) return;
      const msg = { user: user.name, text: partyChatMsg, timestamp: Date.now() };
      setPartyMessages([...partyMessages, msg]);
      watchPartyService.broadcast({ type: 'CHAT', payload: msg });
      setPartyChatMsg('');
  };

  const getFunClass = () => {
    if (!funMode || !funYear) return '';
    if (funYear < 1980) return 'fun-mode-70s';
    if (funYear < 1990) return 'fun-mode-80s';
    if (funYear < 2000) return 'fun-mode-90s';
    return 'fun-mode-2000s';
  };

  const getTvFrameClass = () => {
    if (!funMode || !funYear) return '';
    if (funYear < 1980) return 'tv-frame-70s';
    if (funYear < 1990) return 'tv-frame-80s';
    if (funYear < 2000) return 'tv-frame-90s';
    return 'tv-frame-2000s';
  };

  const handleXscribeAnalysis = async () => {
    if (!selectedMovie) return;
    setIsGenerating(true);
    setTranscriptError(null);
    setLeftTabOpen(true); 
    try {
        const spatialIntel = spatialTracking && spatialContextLog.length > 0 
            ? `\n[Native Spatial Data Detected]:\n${spatialContextLog.join('\n')}`
            : '';

        const timestamp = "00:42:00"; // Simulated current timestamp
        const context = selectedMovie.media_type === 'tv' 
            ? `${selectedMovie.title} (Season ${selectedSeason}, Episode ${selectedEpisode}). Overview: ${selectedMovie.overview}`
            : `${selectedMovie.title}. Overview: ${selectedMovie.overview}`;

        const prompt = `You are Xscribe, an advanced AI movie analyst. Check the scene for "${context}" at simulated timestamp ${timestamp}. 
        ${spatialIntel}
        User specifically requested: "${xScribeContext || 'General analysis'}". 
        Produce a high-quality "Social Media Review" format explaining the scene's impact, cinematography, and plot significance. 
        Format as a .txt review with emojis.`;

        // Strip data URL prefix for Gemini inlineData
        const base64Image = lastFrameBuffer ? lastFrameBuffer.split(',')[1] : undefined;
        
        // Use the multimodal spatial discovery service for rich scene analysis
        const text = await generateSpatialDiscovery(prompt, base64Image);
        
        if (!text) throw new Error("No text generated");
        setTranscript(text);
    } catch (e) {
        setTranscriptError("Xscribe is momentarily offline. Verify your context and try summoning again.");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleDownloadTxt = () => {
    if (!transcript) return;
    const element = document.createElement("a");
    const file = new Blob([transcript], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${selectedMovie?.title}_transcript.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopy = () => {
     if(transcript) {
         navigator.clipboard.writeText(transcript);
         alert("Transcript copied!");
     }
  };

  const shareToSocial = (platform: string) => {
    const text = encodeURIComponent(`Streaming ${selectedMovie?.title} on WSP Stream!`);
    let url = '';
    switch(platform) {
        case 'Twitter': url = `https://twitter.com/intent/tweet?text=${text}`; break;
        case 'Facebook': url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`; break;
        case 'Reddit': url = `https://www.reddit.com/submit?title=${text}&type=TEXT`; break;
        case 'Instagram':
            navigator.clipboard.writeText(decodeURIComponent(text));
            alert("Copied to clipboard for Instagram!");
            return;
        default: break;
    }
    if(url) window.open(url, '_blank');
  };

  return (
    <div className={`min-h-screen transition-all duration-700 ${kidsMode ? 'kids-mode-active' : (funMode ? `fun-mode-active crt-overlay retro-grid-bg ${getFunClass()}` : 'bg-[#0a0a0a]')}`}>
      <button title="Secret Anchor" className="opacity-0 absolute pointer-events-none">Hidden</button>
      {/* Navbar - iOS Glassy */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-3 md:px-6 py-3 md:py-4 flex items-center justify-between gap-2 md:gap-4 ${isScrolled ? 'glass-base border-b' : 'bg-transparent'}`}>
        <div className="flex items-center gap-2 md:gap-5">
            {!kidsMode && (
                <h1 className="font-bold text-white tracking-[0.1em] md:tracking-[0.2em] text-sm sm:text-2xl cursor-pointer whitespace-nowrap font-imax flex items-center gap-2 -mr-[0.1em] md:-mr-[0.2em]">
                   {funMode && <Monitor size={18} className="text-retro-neon-blue animate-pulse"/>}
                   WSP <span className="hidden sm:inline">{funMode ? 'RETRO' : 'STREAM'}</span>
                </h1>
            )}
            
            {!kidsMode && (
                <div className="hidden lg:flex items-center gap-1 glass-dark p-1 rounded-2xl">
                    {(['all', 'movie', 'tv'] as const).map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${activeTab === tab ? 'bg-white text-black shadow-lg scale-105' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                        >
                            {tab.toUpperCase()}
                        </button>
                    ))}
                </div>
            )}

            {/* Kids Mode Toggle */}
            <button 
                onClick={() => {
                    setKidsMode(!kidsMode);
                    if (!kidsMode) setFunMode(false);
                }}
                className={`kids-nav-btn flex-shrink-0 transition-all duration-500 scale-75 md:scale-110 origin-left`}
            >
                <span className={`kids-icon-90s ${kidsMode ? 'animate-wobbly' : 'opacity-60 grayscale-[0.5]'} px-4 py-1`}>
                    KIDS
                </span>
            </button>

            {/* Fun Mode Toggle - iOS Style */}
            {!kidsMode && (
                <div className="relative">
                    <button 
                        onClick={() => setShowFunSelector(!showFunSelector)}
                        className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full transition-all border ${funMode ? 'border-retro-neon-pink text-retro-neon-pink bg-retro-neon-pink/10' : 'border-white/20 text-white bg-white/5 hover:bg-white/10'}`}
                    >
                        <Tv size={16} />
                        <span className="hidden md:inline font-bold text-xs">ERA</span>
                        <ChevronDown size={14} className={`transition-transform duration-300 ${showFunSelector ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Fun Mode Dropdown - Single Column Scrollable */}
                    {showFunSelector && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 mt-4 z-50 glass-base rounded-2xl border border-white/20 animate-fade-in w-48 overflow-hidden shadow-2xl">
                            <div className="max-h-[320px] overflow-y-auto no-scrollbar py-2">
                                {[1970, 1980, 1990, 2000, 2010, 2020].map(decade => (
                                    <button 
                                        key={decade}
                                        onClick={() => {
                                            setFunYear(decade);
                                            setFunMode(true);
                                            setShowFunSelector(false);
                                        }}
                                        className={`w-full px-5 py-4 text-left font-bold transition-all flex items-center justify-between ${funYear === decade ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                                    >
                                        <span>{decade}s</span>
                                        {funYear === decade && <div className="w-1.5 h-1.5 rounded-full bg-neu-accent shadow-[0_0_8px_var(--neu-accent)]" />}
                                    </button>
                                ))}
                                <div className="p-2 mt-2 border-t border-white/10">
                                    <button 
                                        className="w-full py-3 rounded-xl font-bold bg-red-500/80 text-white hover:bg-red-500 transition-colors text-xs"
                                        onClick={() => {
                                            setFunMode(false);
                                            setFunYear(null);
                                            setShowFunSelector(false);
                                        }}
                                    >
                                        Disable Fun Mode
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>

        <div className={`flex-1 min-w-[120px] max-w-xl mx-1 sm:mx-4 relative ${kidsMode ? 'kids-btn-hover cursor-pointer' : ''}`}>
            <Search className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 ${kidsMode ? 'text-kids-orange' : 'text-white/40'}`} size={16} />
            <input 
                type="text"
                title="Search movies and TV shows"
                placeholder={kidsMode ? "Find Your Favorite Cartoons!" : "Search..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 sm:pl-12 pr-4 py-2 outline-none transition-all text-[10px] sm:text-base text-center ${kidsMode ? 'bg-white border-kids-black border-4 rounded-2xl text-black' : 'glass-dark rounded-full text-white placeholder:text-white/30 border border-white/5 focus:border-white/20'}`} 
            />
        </div>
          
        <div className="flex items-center gap-2 md:gap-4">
            {!kidsMode && (
                <NeuIconButton className="hidden sm:flex shadow-neu-out">
                    <Bookmark size={20} />
                </NeuIconButton>
            )}
            
            <div className="relative">
                <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className={`flex items-center gap-3 p-1.5 rounded-full transition-all ${kidsMode ? 'bg-white border-2 border-kids-black' : 'glass-dark border border-white/10 hover:border-white/30'}`}
                >
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 shadow-lg">
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    </div>
                    {!kidsMode && <span className="hidden lg:block font-bold text-xs mr-2 text-white/80">{user.name}</span>}
                    <ChevronDown size={14} className={`text-white/40 mr-2 transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 top-full mt-4 w-64 glass-base rounded-2xl border border-white/20 p-2 z-50 animate-fade-in shadow-2xl">
                    <div className="px-4 py-4 border-b border-white/10 mb-2 text-center">
                      <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">Session Identity</p>
                      <p className="font-bold text-white truncate text-lg">{user.name}</p>
                    </div>
                    <div className="space-y-1">
                        <button 
                          onClick={() => { setSelectedCategory('Watch Later'); setShowProfileMenu(false); }}
                          className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm font-bold"
                        >
                          <Clock size={18} />
                          <span>Parchment List</span>
                        </button>
                        <button 
                          onClick={onSwitchProfile}
                          className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-red-500/20 transition-all text-sm font-bold"
                        >
                          <LogOut size={18} />
                          <span>Switch Identity</span>
                        </button>
                    </div>
                  </div>
                )}
            </div>
        </div>
      </nav>

      {/* Hero Section - Cinematic Layout */}
      <header className="relative w-full min-h-[65vh] sm:min-h-[75vh] md:h-[95vh] overflow-hidden">
        {featuredContent && (
            <>
                <div className={`absolute inset-0 transition-all duration-1000 transform ${isAnimating ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}>
                    <div className="absolute inset-0 animate-slow-zoom">
                        <img src={featuredContent.backdrop_path} className="w-full h-full object-cover" alt="Hero" />
                    </div>
                    {/* Gradient Masks */}
                    <div className="absolute inset-0 bg-gradient-to-r from-neu-base via-transparent to-transparent opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-t from-neu-base via-transparent to-black/20" />
                    <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-neu-base to-transparent" />
                    
                    <div className={`absolute inset-0 flex flex-col justify-center items-center text-center pb-12 sm:pb-32 px-6 md:px-20 z-10 md:justify-center md:items-start md:text-left pt-24 md:pt-0`}>
                        <div className={`max-w-4xl mx-auto space-y-4 sm:space-y-6 transition-all duration-700 delay-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'} w-full`}>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3">
                                 <span className="glass-dark text-white px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em]">
                                    Featuring
                                 </span>
                                 <div className="flex items-center text-yellow-500 gap-1 text-[10px] sm:text-sm font-bold bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
                                    <Star size={14} className="sm:w-4 sm:h-4" fill="currentColor" /> {featuredContent.rating} IMDb
                                 </div>
                            </div>

                            <h2 className="text-3xl sm:text-5xl md:text-8xl font-black text-white leading-[1.1] font-cinematic drop-shadow-2xl">
                                 {featuredContent.title}
                             </h2>
                            
                            <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                {featuredContent.genre.map(g => (
                                    <span key={g} className="text-xs font-bold text-white uppercase tracking-widest bg-neu-accent/10 px-3 py-1 rounded-lg">
                                        {g}
                                    </span>
                                ))}
                            </div>

                            <p className="text-white/90 text-sm sm:text-lg md:text-xl line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-2xl font-medium drop-shadow-md">
                                {featuredContent.overview}
                            </p>
                            
                            <div className="flex items-center justify-center md:justify-start gap-6 pt-6">
                                  <button 
                                     onClick={() => setSelectedMovie(featuredContent as any)}
                                     className="bg-white text-black px-5 py-3 sm:px-10 sm:py-5 rounded-full shadow-2xl flex items-center gap-3 sm:gap-4 hover:scale-110 active:scale-95 transition-all group"
                                 >
                                     <Play fill="black" size={18} className="sm:w-6 sm:h-6" /> 
                                     <span className="font-bold text-xs sm:text-lg tracking-widest uppercase">Watch Now</span>
                                 </button>
                                
                                <button 
                                    onClick={() => toggleWatchLater(featuredContent)}
                                    className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full glass-dark transition-all border border-white/10 ${watchLater.some(m => m.id === featuredContent.id) ? 'bg-white text-black' : 'text-white'}`}
                                >
                                    {watchLater.some(m => m.id === featuredContent.id) ? <Check size={20} className="sm:w-6 sm:h-6" /> : <Plus size={20} className="sm:w-6 sm:h-6" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Carousel Indicators - Hidden as per user request */}
                {/* 
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
                    {carouselPool.slice(0, 10).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setIsAnimating(true);
                                setTimeout(() => {
                                    setCurrentSlide(idx);
                                    setIsAnimating(false);
                                }, 500);
                            }}
                            className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === idx ? 'w-8 bg-neu-accent' : 'w-2 bg-gray-400/30 hover:bg-gray-400/50'}`}
                            title={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
                */}

                {/* Vertical Sidebar Info (Right) removed as per request */}
            </>
        )}
      </header>

      {/* Main Content Area */}
      <main className="relative z-20 px-4 md:px-6 mt-4 sm:-mt-16 md:-mt-32 space-y-12 md:space-y-16 pb-20">
         {/* Categories Row - Hidden in Kids Mode */}
         {!kidsMode && (
             <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-4 px-2">
                {['Originals', 'Watch Later', 'Legends', 'Action', 'Sci-Fi', 'Historical', 'Documentary', 'Drama'].map(cat => (
                    <button 
                        key={cat} 
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl glass-dark rounded-3xl border border-white/10 whitespace-nowrap text-xs sm:text-sm font-bold transition-all hover:translate-y-[-2px] ${selectedCategory === cat ? 'text-white glass-dark border border-white/5' : 'text-gray-600 hover:text-white'}`}
                    >
                        {cat}
                    </button>
                ))}
             </div>
         )}

          {/* Watch Later / Archive Category logic */}
          {(selectedCategory === 'Watch Later' || selectedCategory === 'History') ? (
             <Section 
                title={selectedCategory === 'Watch Later' ? "Watch Later" : "Watched History"}
                subtitle={selectedCategory === 'Watch Later' ? "Saved for later viewing" : "Your viewing timeline"}
                icon={selectedCategory === 'Watch Later' ? <Bookmark className="text-white" size={20}/> : <History className="text-white" size={20}/>}
                movies={selectedCategory === 'Watch Later' ? watchLater : watchHistory} 
                onPlay={(m) => { setSelectedMovie(m as any); addToHistory(m); }} 
                onRemove={(m) => {
                    if (selectedCategory === 'Watch Later') toggleWatchLater(m);
                    else setWatchHistory(prev => prev.filter(h => h.id !== m.id));
                }}
                onToggleWatchLater={toggleWatchLater}
                onMarkWatched={addToHistory}
                isWatched={(id) => watchHistory.some(m => m.id === id)}
                isInWatchLater={(id) => watchLater.some(m => m.id === id)}
                kidsMode={kidsMode}
            />
          ) : (
             <>
                 {/* Trending / Filtered Section */}
                 {trendingContent.length > 0 && (
                     <Section 
                        title={selectedCategory === 'Originals' ? "Seni Trending" : `${selectedCategory} Top 15`}
                        subtitle={selectedCategory === 'Originals' ? "The most watched stories this week" : "Curated selections based on your filter"}
                        icon={selectedCategory === 'Originals' ? <TrendingUp className="text-white" size={20}/> : <Layers className="text-white" size={20}/>}
                        rightElement={
                            !['Originals', 'Watch Later'].includes(selectedCategory) && (
                                <div className="flex gap-2">
                                    {[ 
                                        { label: 'Trending', value: 'popularity.desc' }, 
                                        { label: 'All Time', value: 'vote_average.desc' }, 
                                        { label: 'Latest', value: 'primary_release_date.desc' } 
                                    ].map(sortOption => (
                                        <button
                                            key={sortOption.value}
                                            onClick={() => setSortBy(sortOption.value)}
                                            className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${sortBy === sortOption.value ? 'bg-neu-accent text-white border-neu-accent glass-dark border border-white/5' : 'bg-transparent text-gray-500 border-gray-300 hover:text-white'}`}
                                        >
                                            {sortOption.label}
                                        </button>
                                    ))}
                                </div>
                            )
                        }
                        movies={trendingContent} 
                        onPlay={(m) => { setSelectedMovie(m as any); addToHistory(m); }} 
                        onViewArchive={handleOpenArchive}
                        onToggleWatchLater={toggleWatchLater}
                        onMarkWatched={addToHistory}
                        isWatched={(id) => watchHistory.some(m => m.id === id)}
                        isInWatchLater={(id) => watchLater.some(m => m.id === id)}
                        kidsMode={kidsMode}
                        showRanking={selectedCategory === 'Originals'}
                    />
                 )}
        
                 {/* Recommended Section */}
                 {recommendedContent.length > 0 && (
                     <Section 
                        title="Pujangga Recommends" 
                        subtitle="Curated based on your interests"
                        icon={<Eye className="text-white" size={20}/>}
                        movies={recommendedContent} 
                        onPlay={(m) => { setSelectedMovie(m as any); addToHistory(m); }} 
                        onToggleWatchLater={toggleWatchLater}
                        onMarkWatched={addToHistory}
                        isWatched={(id) => watchHistory.some(m => m.id === id)}
                        isInWatchLater={(id) => watchLater.some(m => m.id === id)}
                        kidsMode={kidsMode}
                    />
                 )}
             </>
          )}

          {/* Watchlist Section (Small View) */}
          {!kidsMode && watchLater.length > 0 && selectedCategory !== 'Watch Later' && (
            <Section 
              title="Parchment List" 
              subtitle="Pick up where you left off" 
              icon={<Bookmark className="text-white" size={20}/>} 
              movies={watchLater} 
              onPlay={(m) => { setSelectedMovie(m as any); addToHistory(m); }} 
              onRemove={(m) => toggleWatchLater(m)}
              onToggleWatchLater={toggleWatchLater}
              onMarkWatched={addToHistory}
              isWatched={(id) => watchHistory.some(m => m.id === id)}
              isInWatchLater={(id) => watchLater.some(m => m.id === id)}
            />
          )}

          {kidsMode && (
              <div className="space-y-12 md:space-y-16">
                <Section 
                    title="Local Favorites (BoBoiBoy & Friends)" 
                    subtitle="The best animation from Malaysia"
                    movies={localHeroes} 
                    onPlay={(m) => { setSelectedMovie(m as any); addToHistory(m); }} 
                    onToggleWatchLater={toggleWatchLater}
                    onMarkWatched={addToHistory}
                    isWatched={(id) => watchHistory.some(m => m.id === id)}
                    isInWatchLater={(id) => watchLater.some(m => m.id === id)}
                    kidsMode={kidsMode}
                />
                <Section 
                    title="Pixar Classics" 
                    subtitle="Magical worlds from Pixar"
                    movies={pixarMovies} 
                    onPlay={(m) => { setSelectedMovie(m as any); addToHistory(m); }} 
                    onToggleWatchLater={toggleWatchLater}
                    onMarkWatched={addToHistory}
                    isWatched={(id) => watchHistory.some(m => m.id === id)}
                    isInWatchLater={(id) => watchLater.some(m => m.id === id)}
                    kidsMode={kidsMode}
                />
                <Section 
                    title="Disney Magic" 
                    subtitle="Enchanting Disney stories"
                    movies={disneyMovies} 
                    onPlay={(m) => { setSelectedMovie(m as any); addToHistory(m); }} 
                    onToggleWatchLater={toggleWatchLater}
                    onMarkWatched={addToHistory}
                    isWatched={(id) => watchHistory.some(m => m.id === id)}
                    isInWatchLater={(id) => watchLater.some(m => m.id === id)}
                    kidsMode={kidsMode}
                />
              </div>
          )}

          {/* Analytics & Footer */}
          {!kidsMode && (
              <div className="pt-20 space-y-20">
                  <AnalyticsSection history={watchHistory} />
                  <Footer />
              </div>
          )}
      </main>

      {/* Enhanced Video Player Modal */}
      {selectedMovie && (
        <div className={`fixed inset-0 z-[60] flex items-center justify-center bg-black/95 transition-all duration-500 ${isTheaterMode ? 'p-0' : 'p-4 md:p-10'}`}>
           <div 
             ref={playerContainerRef}
             className={`relative bg-neu-base shadow-2xl overflow-hidden flex flex-col group transition-all duration-500 ${isTheaterMode ? 'w-full h-full rounded-none' : 'w-full max-w-[1400px] h-[85vh] rounded-[2.5rem] border border-white/20'}`}
           >
              {/* Overlay Close */}
              {!isFullscreen && (
                  <button 
                    title="Close Player"
                    onClick={() => setSelectedMovie(null)} 
                    className={`absolute top-8 z-50 w-10 h-10 glass-dark rounded-full flex items-center justify-center text-white/40 hover:text-white transition-all border border-white/10 ${(rightTabOpen || leftTabOpen) ? "opacity-0 pointer-events-none" : "right-8"}`}
                  >
                    <X size={14} />
                  </button>
              )}

              <div className="flex-1 relative flex overflow-hidden bg-black">
                
                {/* LEFT PANEL: AI & Transcription */}
                <div className={`absolute left-0 top-0 bottom-0 z-[60] glass-base border-r border-white/10 transition-all duration-500 flex flex-col ${leftTabOpen ? 'w-[22rem] translate-x-0' : 'w-[22rem] -translate-x-full'}`}>
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                        <div className="flex flex-col">
                            <h3 className="font-bold text-white flex items-center gap-2 uppercase tracking-widest text-sm">
                                <FileText size={18} className="text-white"/> Xscribe
                                {spatialTracking && (
                                    <div className="flex items-center gap-1 ml-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_red]"></div>
                                        <span className="text-[8px] font-black text-red-500 uppercase tracking-tighter">Spatial Tracking</span>
                                    </div>
                                )}
                            </h3>
                            <span className="text-[10px] text-white/40 font-bold uppercase tracking-tighter">AI Scene Analysis & Reviews</span>
                        </div>
                        <button title="Close Xscribe" onClick={() => setLeftTabOpen(false)} className="w-8 h-8 rounded-full glass-dark flex items-center justify-center text-white/40 hover:text-white transition-all border border-white/10"><X size={14}/></button>
                    </div>
                    <div className="flex-1 p-6 overflow-y-auto no-scrollbar space-y-6" ref={transcriptRef}>
                        {transcriptError ? (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-fade-in">
                                <div className="p-6 glass-dark rounded-3xl border border-white/10 text-red-500">
                                    <AlertCircle size={40} />
                                </div>
                                <div className="space-y-2">
                                    <p className="font-bold text-white uppercase tracking-widest text-xs">Xscribe Blockage</p>
                                    <p className="text-xs text-gray-500 leading-relaxed">{transcriptError}</p>
                                </div>
                                <button onClick={handleXscribeAnalysis} className="w-full h-12 rounded-xl glass-dark border border-white/10 hover:bg-white/10 flex items-center justify-center gap-2 text-xs font-bold text-white uppercase tracking-widest transition-all">
                                    <RefreshCw size={16} className={isGenerating ? "animate-spin" : ""} />
                                    Reconnect Xscribe
                                </button>
                            </div>
                        ) : !transcript ? (
                            <div className="text-center mt-4 space-y-6 animate-fade-in">
                                <div className="p-4 glass-dark rounded-3xl border border-white/5">
                                    <h5 className="text-[10px] font-bold uppercase text-white/30 mb-3 tracking-widest">xScribe Context Box</h5>
                                    <textarea 
                                        className="w-full h-32 bg-transparent border-none outline-none text-xs text-white/80 p-2 font-mono resize-none" 
                                        placeholder="e.g., 'Analyze the emotional depth of this scene' or 'Focus on the use of lighting'..."
                                        value={xScribeContext}
                                        onChange={(e) => setXScribeContext(e.target.value)}
                                    />
                                </div>
                                
                                <p className="text-[10px] font-bold text-white/30 leading-relaxed tracking-wider uppercase">
                                    Summon Xscribe for:
                                    <br/>
                                    <span className="text-white font-black">{selectedMovie.title}</span>
                                </p>
                                <button 
                                    onClick={handleXscribeAnalysis}
                                    disabled={isGenerating}
                                    className="w-full h-16 rounded-2xl glass-dark border border-white/10 flex justify-center items-center gap-3 text-lg text-white font-bold hover:bg-white/10 disabled:opacity-50 transition-all"
                                >
                                    {isGenerating ? <Loader2 size={24} className="animate-spin" /> : <Send size={20} />}
                                    Summon Xscribe
                                </button>

                                <button 
                                    onClick={() => setSpatialTracking(!spatialTracking)}
                                    className={`w-full h-12 rounded-xl border flex justify-center items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${spatialTracking ? 'bg-red-500/20 border-red-500 text-red-500' : 'glass-dark border-white/10 text-white/40 hover:text-white hover:bg-white/10'}`}
                                >
                                    <Eye size={16} />
                                    {spatialTracking ? 'Disable Spatial Tracking' : 'Enable Native Spatial xScribe'}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="glass-dark p-6 rounded-3xl text-xs text-white/90 whitespace-pre-wrap font-mono leading-loose border border-white/5 animate-ink-bleed">
                                    {transcript}
                                </div>
                                
                                {spatialTracking && spatialContextLog.length > 0 && (
                                    <div className="glass-dark p-4 rounded-3xl border border-white/5 space-y-3">
                                        <h5 className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                                            <Eye size={12} className="text-red-500" /> Spatial Native Log
                                        </h5>
                                        <div className="space-y-1">
                                            {spatialContextLog.map((log, i) => (
                                                <div key={i} className="text-[8px] font-mono text-white/40 flex justify-between">
                                                    <span>{log}</span>
                                                    <span className="text-red-500/40">CAPTURED</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="p-4 glass-dark rounded-3xl border border-white/5 space-y-3">
                                    <h5 className="text-[10px] font-black text-white/30 uppercase tracking-widest">Agentic Controls</h5>
                                    <div className="grid grid-cols-3 gap-2">
                                        <button onClick={() => handleAgenticControl('play')} className="py-2 rounded-xl glass-light border border-white/5 text-[8px] font-black text-white uppercase tracking-widest hover:bg-white/10">Play</button>
                                        <button onClick={() => handleAgenticControl('pause')} className="py-2 rounded-xl glass-light border border-white/5 text-[8px] font-black text-white uppercase tracking-widest hover:bg-white/10">Pause</button>
                                        <button onClick={() => handleAgenticControl('seek', 30)} className="py-2 rounded-xl glass-light border border-white/5 text-[8px] font-black text-white uppercase tracking-widest hover:bg-white/10">Seek +30s</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {transcript && (
                        <div className="p-6 glass-base border-t border-white/10 space-y-6">
                             <div className="grid grid-cols-2 gap-4">
                                <button title="Export Analysis" onClick={handleDownloadTxt} className="h-12 rounded-xl glass-dark border border-white/10 hover:bg-white/10 text-white flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all">
                                    <Download size={14} /> Export
                                </button>
                                <button title="Copy Analysis" onClick={handleCopy} className="h-12 rounded-xl glass-dark border border-white/10 hover:bg-white/10 text-white flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all">
                                    <Copy size={14} /> Copy
                                </button>
                             </div>
                             <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase font-bold text-white/40 tracking-[0.2em]">Share Scene</span>
                                <div className="flex gap-2">
                                    {['Instagram', 'Facebook', 'Twitter', 'Reddit'].map(p => (
                                        <button key={p} title={`Share on ${p}`} onClick={() => shareToSocial(p)} className="w-10 h-10 rounded-full glass-dark border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all hover:scale-110">
                                            {p === 'Instagram' && <Instagram size={16}/>}
                                            {p === 'Facebook' && <Facebook size={16}/>}
                                            {p === 'Twitter' && <Twitter size={16}/>}
                                            {p === 'Reddit' && <MessageCircle size={16}/>}
                                        </button>
                                    ))}
                                </div>
                             </div>
                        </div>
                    )}
                </div>

                <button title={leftTabOpen ? "Close Xscribe" : "Open Xscribe"} onClick={() => setLeftTabOpen(!leftTabOpen)} className={`absolute top-1/2 left-0 z-50 transform -translate-y-1/2 bg-neu-base/60 backdrop-blur-lg p-3 rounded-r-2xl shadow-neu-out hover:text-white transition-all ${leftTabOpen ? 'translate-x-[22rem]' : 'translate-x-0'}`}>
                    {leftTabOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
                </button>

                {/* VIDEO ENGINE */}
                <div className="flex-1 relative flex flex-col items-center justify-center p-8">
                    <div className={`relative transition-all duration-500 ${funMode ? `w-[90%] h-[80%] ${getTvFrameClass()} crt-screen crt-curve` : 'w-full h-full'}`}>
                        {/* 70s TV Extra Details */}
                        {funMode && funYear && funYear < 1980 && (
                            <div className="absolute -right-24 top-1/2 -translate-y-1/2 hidden lg:flex flex-col">
                                <div className="tv-knob" title="Volume"></div>
                                <div className="tv-knob" title="Channel"></div>
                                <div className="w-12 h-32 bg-[#4e342e] rounded-lg glass-dark border border-white/5 mt-4 border border-black/20"></div>
                            </div>
                        )}
                        
                        <iframe 
                            className="w-full h-full rounded-sm" 
                            src={
                                 videoSource === 'pluto' 
                                 ? (selectedMovie.media_type === 'movie' 
                                     ? `${VIDSRC_URL}/movie/${selectedMovie.id}?iframe=true&controls=0&showinfo=0&modestbranding=1&autoplay=1`
                                     : `${VIDSRC_URL}/tv/${selectedMovie.id}/${selectedSeason}/${selectedEpisode}?iframe=true&controls=0&showinfo=0&modestbranding=1&autoplay=1`)
                                 : (selectedMovie.media_type === 'movie'
                                     ? `${VIDFAST_URL}/movie/${selectedMovie.id}?autoPlay=true&theme=F59E0B`
                                     : `${VIDFAST_URL}/tv/${selectedMovie.id}/${selectedSeason}/${selectedEpisode}?autoPlay=true&theme=F59E0B&autoNext=true&nextButton=true`)
                            }
                            allow="autoplay; encrypted-media" 
                            allowFullScreen
                            ref={iframeRef}
                            title={`${selectedMovie.title} Player`}
                        ></iframe>

                        {/* Click-Guard Overlay: Intercepts the first few ad-trigger clicks */}
                        {adClicksCount < 2 && (
                            <div 
                                className="absolute inset-0 z-30 cursor-pointer bg-transparent"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setAdClicksCount(prev => prev + 1);
                                }}
                            />
                        )}

                        {selectedMovie.media_type === 'tv' && (
                            <div className="absolute top-10 left-10 glass-dark text-white px-6 py-2 rounded-full text-xs font-black tracking-widest uppercase z-20">
                                S{selectedSeason} • E{selectedEpisode}
                            </div>
                        )}


                        {isCaptionsOn && (
                           <div className="absolute bottom-10 w-full flex justify-center px-12 z-20">
                               <span className="glass-dark text-white px-8 py-3 rounded-3xl text-xl font-cinematic animate-fade-in text-center max-w-2xl border border-white/10">
                                 "The shadows tell the truth when the light fades."
                               </span>
                           </div>
                        )}
                    </div>
                </div>

                <button title={rightTabOpen ? "Close Details" : "Open Details"} onClick={() => setRightTabOpen(!rightTabOpen)} className={`absolute top-1/2 right-0 z-50 transform -translate-y-1/2 bg-neu-base/60 backdrop-blur-lg p-3 rounded-l-2xl shadow-neu-out hover:text-white transition-all ${rightTabOpen ? '-translate-x-[22rem]' : 'translate-x-0'}`}>
                    {rightTabOpen ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
                </button>

                {/* RIGHT PANEL: Party & Stats */}
                <div className={`absolute right-0 top-0 bottom-0 z-[60] glass-base border-l border-white/10 transition-all duration-500 flex flex-col ${rightTabOpen ? 'w-[22rem] translate-x-0' : 'w-[22rem] translate-x-full'}`}>
                    {isWatchParty ? (
                        <div className="flex flex-col h-full animate-slide-up">
                             <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                                <h3 className="font-bold text-white flex items-center gap-2 uppercase tracking-widest text-sm">
                                    <Users size={18} className="text-white"/> Public Square
                                </h3>
                                <button title="Close Public Square" onClick={() => setRightTabOpen(false)} className="text-white/40 hover:text-white transition-colors"><ChevronRight/></button>
                             </div>
                              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {/* Host Controls Section */}
                                 <div className="p-5 glass-dark rounded-[2.5rem] border border-white/10 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Share Link</span>
                                            <span className="text-[10px] font-bold text-white truncate max-w-[120px]">{partyLink || 'Generating...'}</span>
                                        </div>
                                        <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-xl">
                                            <span className="text-[10px] font-bold text-white uppercase">Code: {partyCode || '---'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                        <span className="text-[10px] font-bold text-white/30 uppercase">Capacity</span>
                                        <div className="flex items-center gap-3">
                                            <button title="Decrease Capacity" onClick={() => setPartyCapacity(Math.max(1, partyCapacity - 1))} className="w-6 h-6 rounded-lg glass-dark border border-white/10 flex items-center justify-center text-[10px] text-white/40 hover:text-white">-</button>
                                            <span className="text-xs font-bold text-white">{partyMembers.length}/{partyCapacity}</span>
                                            <button title="Increase Capacity" onClick={() => setPartyCapacity(Math.min(5, partyCapacity + 1))} className="w-6 h-6 rounded-lg glass-dark border border-white/10 flex items-center justify-center text-[10px] text-white/40 hover:text-white">+</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Member Status List (from Mockup) */}
                                 <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest px-2">Member Quota Tracking</h4>
                                    <div className="space-y-2">
                                        {partyMembers.map((member: {username: string, status: string, link: string}, i: number) => (
                                            <div key={i} className="flex items-center justify-between p-3 glass-dark rounded-2xl border border-white/5 transition-all hover:scale-[1.02]">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold text-white tracking-tight">{member.username}</span>
                                                    <span className="text-[8px] text-white/40 truncate max-w-[100px]">{member.link}</span>
                                                </div>
                                                <div className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter ${
                                                    member.status === 'success' ? 'bg-green-500/10 text-green-500' :
                                                    member.status === 'connecting' ? 'bg-blue-500/10 text-blue-500 animate-pulse' :
                                                    member.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                                                    'bg-yellow-500/10 text-yellow-500'
                                                }`}>
                                                    {member.status}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="h-px bg-gray-200/50 my-2"></div>

                                {partyMessages.map((msg, idx) => (
                                    <div key={idx} className="glass-dark p-4 rounded-2xl border border-white/5 animate-fade-in">
                                        <span className="font-black text-white text-[10px] block uppercase tracking-tighter mb-1">{msg.user}</span>
                                        <span className="text-xs text-white/70 leading-relaxed font-medium">{msg.text}</span>
                                    </div>
                                ))}
                                <div ref={partyChatEndRef}/>
                             </div>
                             <div className="p-6 glass-base border-t border-white/10 flex gap-3">
                                 <input 
                                     type="text"
                                     placeholder="Whisper to the crowd..." 
                                     className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-xs font-bold text-white outline-none focus:border-white/30 transition-all" 
                                     value={partyChatMsg} 
                                     onChange={e => setPartyChatMsg(e.target.value)} 
                                     onKeyDown={e => e.key === "Enter" && handleSendPartyMessage()} 
                                 />
                                <button title="Send Message" onClick={handleSendPartyMessage} className="w-12 h-12 rounded-xl glass-dark border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"><Send size={18}/></button>
                             </div>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full animate-slide-up">
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                                <h3 className="font-bold text-white flex items-center gap-2 uppercase tracking-widest text-sm">
                                    <Layers size={18} className="text-white"/> Artifact Info
                                </h3>
                                <button title="Close Details" onClick={() => setRightTabOpen(false)} className="w-8 h-8 rounded-full glass-dark flex items-center justify-center text-white/40 hover:text-white transition-all border border-white/10 hover-scale-premium"><X size={14}/></button>
                            </div>
                            <div className="flex-1 p-6 space-y-8 overflow-y-auto no-scrollbar">
                                {/* JOIN PARTY PORTAL */}
                                 <div className="p-6 glass-dark rounded-[2rem] border border-white/5 space-y-4">
                                     <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest px-2">Join Watchparty</h4>
                                     <div className="flex gap-2">
                                         <input 
                                             type="text"
                                             placeholder="Enter Room Code..." 
                                             className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-[10px] font-black text-white outline-none focus:border-white/30 transition-all"
                                             value={joinInput}
                                             onChange={(e) => setJoinInput(e.target.value)}
                                         />
                                         <button 
                                             onClick={handleJoinParty} 
                                             title="Join Party"
                                             className="w-12 h-12 rounded-xl glass-dark border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all disabled:opacity-50 hover-scale-premium"
                                             disabled={isJoining}
                                         >
                                             {isJoining ? <Loader2 size={16} className="animate-spin"/> : <ArrowRight size={16}/>}
                                         </button>
                                     </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-6 glass-dark rounded-[2rem] border border-white/5">
                                        <h4 className="font-bold text-white text-xl mb-1 tracking-tight">{selectedMovie.title}</h4>
                                        <div className="flex gap-3 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                                            <span>{selectedMovie.release_date}</span>
                                            <span className="text-white">{selectedMovie.media_type === 'movie' ? 'Cinematic' : 'Serial'}</span>
                                        </div>
                                    </div>
                                </div>

                                 {selectedMovie.media_type === 'tv' && (
                                    <div className="p-4 sm:p-6 glass-dark rounded-[2rem] border border-white/10 space-y-8">
                                        {/* Season Selector */}
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] text-center">Season</h4>
                                            <div className="flex items-center justify-between gap-4 px-2">
                                                <button 
                                                    title="Previous Season"
                                                    onClick={() => { setSelectedSeason(prev => Math.max(1, prev - 1)); setSelectedEpisode(1); }}
                                                    className={`w-10 h-10 rounded-full glass-dark border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all ${selectedSeason === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                                                >
                                                    <ChevronLeft size={18} />
                                                </button>
                                                
                                                <div 
                                                    key={`${selectedSeason}-${episodesInCurrentSeason}`}
                                                    className="flex-1 overflow-x-auto no-scrollbar flex justify-start items-center gap-3 py-2 scroll-smooth px-4 animate-fade-in-blur overscroll-contain"
                                                >
                                                    {Array.from({length: totalSeasonsCount}, (_, i) => i + 1).map(s => (
                                                        <button 
                                                            key={s} 
                                                            onClick={() => { setSelectedSeason(s); setSelectedEpisode(1); }} 
                                                            className={`min-w-[56px] h-14 rounded-2xl flex items-center justify-center text-lg font-black transition-all flex-shrink-0 hover-scale-premium ${selectedSeason === s ? 'bg-white text-black shadow-neon scale-110' : 'glass-dark border border-white/10 text-white/30 hover:text-white'}`}
                                                        >
                                                            {s}
                                                        </button>
                                                    ))}
                                                </div>

                                                <button 
                                                    title="Next Season"
                                                    onClick={() => { setSelectedSeason(prev => Math.min(totalSeasonsCount, prev + 1)); setSelectedEpisode(1); }}
                                                    className={`w-10 h-10 rounded-full glass-dark border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all ${selectedSeason === totalSeasonsCount ? 'opacity-0 pointer-events-none' : ''}`}
                                                >
                                                    <ChevronRight size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Episode Selector */}
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] text-center">Episode</h4>
                                            <div className="flex items-center justify-between gap-4 px-2">
                                                <button 
                                                    title="Previous Episode"
                                                    onClick={() => {
                                                        if (selectedEpisode > 1) setSelectedEpisode(prev => prev - 1);
                                                        else if (selectedSeason > 1) {
                                                            setSelectedSeason(prev => prev - 1);
                                                            // Note: We don't know prev season episode count yet, so we just go to a high number and let the UI adjust?
                                                            // Better: stay on 1 or handle logic elsewhere.
                                                            setSelectedEpisode(1);
                                                        }
                                                    }}
                                                    className={`w-10 h-10 rounded-full glass-dark border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all hover-scale-premium ${selectedSeason === 1 && selectedEpisode === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                                                >
                                                    <ChevronLeft size={18} />
                                                </button>

                                                <div 
                                                    key={`${selectedSeason}-${episodesInCurrentSeason}`}
                                                    className="flex-1 overflow-x-auto no-scrollbar flex justify-start items-center gap-3 py-2 scroll-smooth px-4 animate-fade-in-blur overscroll-contain"
                                                >
                                                    {Array.from({length: episodesInCurrentSeason || 1}, (_, i) => i + 1).map(e => (
                                                        <button 
                                                            key={e} 
                                                            onClick={() => setSelectedEpisode(e)} 
                                                            className={`min-w-[56px] h-14 rounded-2xl flex items-center justify-center text-lg font-black transition-all flex-shrink-0 hover-scale-premium ${selectedEpisode === e ? 'bg-neu-accent text-white shadow-neon scale-110' : 'glass-dark border border-white/10 text-white/30 hover:text-white'}`}
                                                        >
                                                            {e}
                                                        </button>
                                                    ))}
                                                </div>

                                                <button 
                                                    title="Next Episode"
                                                    onClick={() => {
                                                        if (selectedEpisode < episodesInCurrentSeason) setSelectedEpisode(prev => prev + 1);
                                                        else if (selectedSeason < totalSeasonsCount) {
                                                            setSelectedSeason(prev => prev + 1);
                                                            setSelectedEpisode(1);
                                                        }
                                                    }}
                                                    className={`w-10 h-10 rounded-full glass-dark border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all hover-scale-premium ${selectedSeason === totalSeasonsCount && selectedEpisode === episodesInCurrentSeason ? 'opacity-0 pointer-events-none' : ''}`}
                                                >
                                                    <ChevronRight size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-white/5 flex flex-col items-center gap-2">
                                            <div className="relative w-full max-w-[200px]">
                                                <input 
                                                    value={`S${selectedSeason} E${selectedEpisode}`}
                                                    readOnly
                                                    title="Selected Season and Episode"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-center text-white font-black tracking-widest uppercase text-xs"
                                                />
                                            </div>
                                            <div className="flex justify-between w-full px-4">
                                                <button 
                                                    onClick={() => {
                                                        if (selectedEpisode > 1) setSelectedEpisode(prev => prev - 1);
                                                        else if (selectedSeason > 1) {
                                                            setSelectedSeason(prev => prev - 1);
                                                            setSelectedEpisode(1);
                                                        }
                                                    }}
                                                    disabled={selectedSeason === 1 && selectedEpisode === 1}
                                                    className="text-[8px] font-black text-white/20 hover:text-white uppercase tracking-widest disabled:opacity-0 transition-all hover-scale-premium"
                                                >
                                                    PREV
                                                </button>
                                                <span className="text-[10px] font-black text-neu-accent tracking-[0.3em]">S{selectedSeason} : E{selectedEpisode}</span>
                                                <button 
                                                    onClick={() => {
                                                        if (selectedEpisode < episodesInCurrentSeason) setSelectedEpisode(prev => prev + 1);
                                                        else if (selectedSeason < totalSeasonsCount) {
                                                            setSelectedSeason(prev => prev + 1);
                                                            setSelectedEpisode(1);
                                                        }
                                                    }}
                                                    disabled={selectedSeason === totalSeasonsCount && selectedEpisode === episodesInCurrentSeason}
                                                    className="text-[8px] font-black text-white/20 hover:text-white uppercase tracking-widest disabled:opacity-0 transition-all hover-scale-premium"
                                                >
                                                    NEXT
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                 <div className="space-y-4">
                                    <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-2">Automated Discovery</h4>
                                    <div className="space-y-3">
                                        {getSubtitles(selectedMovie).map(sub => (
                                            <div key={sub.id} className="p-4 glass-dark rounded-2xl border border-white/5 flex items-center justify-between transition-all hover:scale-[1.02]">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold text-white tracking-tight">{sub.lang}</span>
                                                    <span className="text-[8px] text-white/40 uppercase tracking-widest">{sub.format} • Verified</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={() => downloadSubtitle(sub, selectedMovie.title)}
                                                        className="w-10 h-10 rounded-xl glass-dark border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
                                                        title="Download SRT"
                                                    >
                                                        <Download size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => setActiveSubtitle(sub.id)}
                                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeSubtitle === sub.id ? 'bg-white text-black' : 'glass-dark border border-white/10 text-white/60 hover:text-white'}`}
                                                        title="Inject to Player"
                                                    >
                                                        {activeSubtitle === sub.id ? <Check size={16} /> : <Plus size={16} />}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="h-px bg-white/10 my-2"></div>
                                    
                                    <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-2">External Upload</h4>
                                    <div className="relative group">
                                        <input 
                                            type="file" 
                                            aria-label="Upload Subtitle File"
                                            accept=".srt,.vtt"
                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                            onChange={(e) => {
                                                if (e.target.files?.length) {
                                                    alert(`Subtitle "${e.target.files[0].name}" loaded! (Note: External player injection limits may apply)`);
                                                }
                                            }}
                                        />
                                        <button className="w-full py-4 px-6 rounded-2xl glass-dark border border-white/10 group-hover:bg-white/10 text-xs font-bold flex justify-between items-center text-white/70 transition-all pointer-events-none">
                                            <span>Manual Upload (.srt)</span>
                                            <Captions size={14} className="group-hover:scale-110 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
              </div>

              <div className="h-24 glass-base z-50 flex items-center justify-between px-10 border-t border-white/10">
                  {/* Playback Controls Hidden as per request */}
                  {/* <div className="flex items-center gap-6">
                     <NeuIconButton 
                        onClick={() => {
                            const newIsPlaying = !isPlaying;
                            setIsPlaying(newIsPlaying);
                            if (isWatchParty) {
                                watchPartyService.broadcast({
                                    type: 'PLAYBACK',
                                    payload: { isPlaying: newIsPlaying, currentTime: 0, timestamp: Date.now() }
                                });
                            }
                        }} 
                        title={isPlaying ? "Pause" : "Play"} 
                        className="w-16 h-16 flex items-center justify-center !rounded-2xl bg-neu-accent text-white shadow-lg active:scale-90 transition-all"
                     >
                        {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                     </NeuIconButton>
                     <NeuIconButton title="Skip Forward" className="w-12 h-12 flex items-center justify-center !rounded-xl">
                        <SkipForward size={20} />
                     </NeuIconButton>
                     <div className="text-[10px] font-black tracking-widest text-white/60">04:20 : 01:32:00</div>
                  </div> */}

                  {/* Progress Bar Hidden as per request */}
                 {/* <div className="flex-1 mx-12 hidden lg:block">
                     <div className="h-2 bg-neu-shadowDark/20 rounded-full glass-dark border border-white/5 relative group cursor-pointer">
                         <div className="h-full bg-neu-accent w-1/3 rounded-full relative shadow-[0_0_10px_rgba(108,92,231,0.5)]">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform"></div>
                         </div>
                     </div>
                 </div> */}

                 <div className="flex items-center gap-4 ml-auto">
                     <button 
                        onClick={() => setVideoSource((prev: 'pluto' | 'uranus') => prev === 'pluto' ? 'uranus' : 'pluto')}
                        className="px-6 h-12 rounded-xl glass-dark border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center gap-3 group hover-scale-premium"
                        title="Switch Video Server"
                     >
                        <RefreshCw size={14} className={`transition-all duration-500 ${videoSource === 'uranus' ? 'animate-spin' : 'group-hover:rotate-180'}`} />
                        <span className="hidden sm:inline">{videoSource === 'pluto' ? 'Server: Pluto' : 'Server: Uranus'}</span>
                     </button>

                     <button 
                        onClick={toggleWatchParty} 
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all hover-scale-premium ${isWatchParty ? 'bg-white text-black shadow-2xl scale-110' : 'glass-dark border border-white/10 text-white hover:bg-white/10'}`}
                        title="Watchparty"
                     >
                        <Users size={20} />
                     </button>

                     <button 
                        onClick={() => setIsTheaterMode(!isTheaterMode)} 
                        className={`w-12 h-12 rounded-xl hidden md:flex items-center justify-center transition-all ${isTheaterMode ? 'bg-white text-black shadow-2xl scale-110' : 'glass-dark border border-white/10 text-white hover:bg-white/10'}`}
                        title="Theater Mode"
                     >
                        <Monitor size={20} />
                     </button>

                     <button 
                        onClick={toggleFullscreen} 
                        className="w-12 h-12 rounded-xl glass-dark border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all"
                        title="Fullscreen"
                     >
                        {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                     </button>
                 </div>
              </div>

           </div>
        </div>
      )}
      {/* ARCHIVE OVERLAY */}
      {showArchive && (
          <div className="fixed inset-0 z-[60] bg-[#0a0a0a]/95 backdrop-blur-3xl overflow-y-auto no-scrollbar animate-fade-in custom-scrollbar">
              <div className="p-4 md:p-10 flex flex-col gap-6 md:gap-10">
                  <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <h1 className="text-2xl md:text-4xl font-black text-white font-cinematic uppercase tracking-widest flex items-center gap-2 md:gap-4 pr-16 md:pr-0">
                          <Layers size={24} className="md:w-10 md:h-10 text-white" />
                          The Archive
                      </h1>
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
                           <div className="flex glass-dark rounded-xl p-1 border border-white/5">
                                {[ 
                                    { label: 'Popular', value: 'popularity.desc' }, 
                                    { label: 'Top Rated', value: 'vote_average.desc' }, 
                                ].map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setArchiveSort(opt.value)}
                                        className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${archiveSort === opt.value ? 'bg-white text-black shadow-2xl' : 'text-white/40 hover:text-white'}`}
                                        title={`Sort by ${opt.label}`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                           </div>

                           <div className="absolute top-0 right-0 md:relative md:top-auto md:right-auto">
                               <button 
                                    onClick={() => setShowArchive(false)} 
                                    className="w-10 h-10 rounded-full glass-dark flex items-center justify-center text-white/40 hover:text-white transition-all border border-white/10"
                                    title="Close Archive"
                                >
                                    <X size={14} />
                               </button>
                           </div>
                      </div>
                  </div>

                  <div className="space-y-12 pb-20">
                       <Section 
                        title="Top 20 Movies" 
                        subtitle="Cinematic Masterpieces"
                        movies={archiveData.movies}
                        onPlay={(m) => { setSelectedMovie(m as any); setShowArchive(false); }}
                        kidsMode={kidsMode}
                        showRanking
                      />
                       <Section 
                        title="Top 20 Series" 
                        subtitle="Binge-worthy Collections"
                        movies={archiveData.tv}
                        onPlay={(m) => { setSelectedMovie(m as any); setShowArchive(false); }}
                        kidsMode={kidsMode}
                        showRanking
                      />
                       <Section 
                        title="Top Anime" 
                        subtitle="Animation from Japan"
                        movies={archiveData.anime}
                        onPlay={(m) => { setSelectedMovie(m as any); setShowArchive(false); }}
                        kidsMode={kidsMode}
                        showRanking
                      />
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

