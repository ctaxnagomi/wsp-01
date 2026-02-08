
import React, { useState, useEffect, useRef } from 'react';
import { NeuCard, NeuInput, NeuIconButton, NeuButton } from './NeumorphicUI';
import { 
  Play, Info, Search, Plus, Star, LogOut, ChevronDown, 
  X as CloseIcon, ChevronLeft, ChevronRight, Download, Copy, 
  Facebook, Instagram, Twitter, MessageCircle, 
  Maximize, Minimize, SkipForward, Pause, Captions, FileText, Send, Share2,
  AlertCircle, RefreshCw, Tv, Film, Layers, Monitor, Users, Link as LinkIcon, Check,
  TrendingUp, Clock, Bookmark, PlayCircle, Eye, ScrollText, Loader2, ArrowRight, Sparkles
} from 'lucide-react';
import { Movie, UserProfile } from '../types';
import { generateChatResponse } from '../services/geminiService';
import { fetchTrending, searchMulti, fetchByDecade, fetchByGenre } from '../services/tmdb';
import { watchPartyService, PartyUpdate } from '../services/watchPartyService';

const VIDSRC_URL = import.meta.env.VITE_VIDSRC_URL || 'https://vidnest.fun';

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

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'movie' | 'tv'>('all');

  // Player State
  const [leftTabOpen, setLeftTabOpen] = useState(false);
  const [rightTabOpen, setRightTabOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCaptionsOn, setIsCaptionsOn] = useState(false);
  
  // Fun Mode State
  const [funMode, setFunMode] = useState(false);
  const [funYear, setFunYear] = useState<number | null>(null);
  const [showFunSelector, setShowFunSelector] = useState(false);

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
  const [partyChatEndRef] = useState(useRef<HTMLDivElement>(null)); // Ref pattern adjustment if needed, but keeping original ref logic is better
  const partyChatEndRefOriginal = useRef<HTMLDivElement>(null);

  // Category & Quick Action State
  const [selectedCategory, setSelectedCategory] = useState('Originals');
  const [sortBy, setSortBy] = useState('popularity.desc'); // 'popularity.desc' | 'vote_average.desc' | 'primary_release_date.desc'
  const [showHistoryToast, setShowHistoryToast] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  
  // Watch Later State
  const [watchLater, setWatchLater] = useState<Movie[]>(() => {
      const saved = localStorage.getItem('watchLater');
      return saved ? JSON.parse(saved) : [];
  });

  const GENRE_MAP: Record<string, number> = {
      'Action': 28,
      'Sci-Fi': 878,
      'Historical': 36,
      'Documentary': 99,
      'Drama': 18,
      'Legends': 12, // Adventure
  };

  useEffect(() => {
      localStorage.setItem('watchLater', JSON.stringify(watchLater));
  }, [watchLater]);

  const toggleWatchLater = (movie: Movie) => {
      setWatchLater(prev => {
          if (prev.some(m => m.id === movie.id)) {
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
  const [videoSource, setVideoSource] = useState<'vidsrc' | 'vidfastpro'>('vidsrc');

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
         } else if (selectedCategory === 'Originals') {
            const trending = await fetchTrending();
            setTrendingMovies(trending);
            setRecommendedMovies(trending.slice().reverse());
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
        setVideoSource('vidsrc');
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

  const featuredContent = trendingMovies.length > 0 ? trendingMovies[0] : null;
  const trendingContent = trendingMovies.filter(m => m.id !== featuredContent?.id && (activeTab === 'all' || m.media_type === activeTab));
  const recommendedContent = recommendedMovies.filter(m => activeTab === 'all' || m.media_type === activeTab);
  
  // Filter Logic
  let filteredContent = trendingMovies;
  if (selectedCategory === 'Watch Later') {
      filteredContent = watchLater;
  }

  const toggleFullscreen = async () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
        try {
            await playerContainerRef.current.requestFullscreen();
        } catch (err) { console.error(err); }
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
        const timestamp = "00:42:00"; // Simulated current timestamp
        const context = selectedMovie.media_type === 'tv' 
            ? `${selectedMovie.title} (Season ${selectedSeason}, Episode ${selectedEpisode}). Overview: ${selectedMovie.overview}`
            : `${selectedMovie.title}. Overview: ${selectedMovie.overview}`;

        const prompt = `You are Xscribe, an advanced AI movie analyst. Check the scene at timestamp ${timestamp} for "${context}". 
        User specifically requested: "${xScribeContext || 'General analysis'}". 
        Produce a high-quality "Social Media Review" format (suitable for Facebook) explaining the scene's impact, cinematography, and plot significance. 
        Format as a .txt review with emojis.`;

        const text = await generateChatResponse(prompt, [], true);
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
    <div className={`min-h-screen transition-all duration-700 ${funMode ? `fun-mode-active crt-overlay retro-grid-bg ${getFunClass()}` : 'bg-neu-base'}`}>
      <button title="Secret Anchor" className="opacity-0 absolute pointer-events-none">Hidden</button>
      {/* Navbar - Floating & Glassy */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 flex items-center justify-between gap-4 ${isScrolled ? 'bg-neu-base/80 backdrop-blur-xl shadow-neu-out border-b border-white/20' : 'bg-transparent'}`}>
        <div className="flex items-center gap-8">
            <h1 className="font-bold text-neu-accent tracking-[0.2em] text-2xl cursor-pointer whitespace-nowrap font-imax animate-pulse flex items-center gap-2">
               {funMode && <Monitor size={24} className="text-retro-neon-blue"/>}
               WSP {funMode ? 'RETRO' : 'STREAM'}
            </h1>
            
            <div className="hidden lg:flex items-center gap-2 bg-neu-base/40 p-1 rounded-2xl shadow-neu-in">
                {(['all', 'movie', 'tv'] as const).map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-xl text-xs font-black tracking-widest transition-all ${activeTab === tab ? 'bg-neu-accent text-white shadow-neu-out translate-y-[-2px]' : 'text-gray-500 hover:text-neu-text'}`}
                    >
                        {tab.toUpperCase()}
                    </button>
                ))}
            </div>
            
            {/* Fun Mode Toggle */}
            <button 
                title="Toggle Fun Mode Selector"
                onClick={() => setShowFunSelector(!showFunSelector)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${funMode ? 'border-retro-neon-pink text-retro-neon-pink' : 'border-neu-accent text-neu-accent'}`}
            >
                <Tv size={18} />
                <span className="font-bold text-xs">FUN MODE</span>
            </button>
        </div>

        {/* Fun Mode Year Selector Modal/Dropdown */}
        {showFunSelector && (
            <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 p-6 bg-neu-base rounded-3xl shadow-neu-out border border-white/30 animate-fade-in w-80">
                <h4 className="text-center font-black text-neu-text uppercase tracking-widest text-xs mb-4">Choose Era</h4>
                <div className="grid grid-cols-2 gap-3">
                    {[1970, 1980, 1990, 2000, 2010, 2020].map(decade => (
                        <button 
                            key={decade}
                            title={`Select ${decade}s Era`}
                            onClick={() => {
                                setFunYear(decade);
                                setFunMode(true);
                                setShowFunSelector(false);
                            }}
                            className={`py-3 rounded-xl font-bold transition-all ${funYear === decade ? 'bg-neu-accent text-white shadow-neu-in' : 'bg-neu-base shadow-neu-btn text-gray-500 hover:text-neu-accent'}`}
                        >
                            {decade}s
                        </button>
                    ))}
                    <button 
                        className="col-span-2 py-3 mt-2 rounded-xl font-bold bg-red-400 text-white shadow-neu-btn"
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
        )}

        <div className="flex-1 max-w-xl mx-4 relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <NeuInput 
                placeholder="Search stories, legends, cinema..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-white/30 border-white/20 backdrop-blur-sm" 
            />
        </div>
          
        <div className="flex items-center gap-4">
            <NeuIconButton className="hidden sm:flex shadow-neu-out">
                <Bookmark size={20} />
            </NeuIconButton>
            
            <div className="relative">
                <button 
                    title="Profile Menu"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-3 p-1.5 rounded-full bg-neu-base shadow-neu-out hover:shadow-neu-in transition-all"
                >
                    <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-neu-accent">
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="hidden lg:block font-bold text-sm mr-2 text-neu-text">{user.name}</span>
                    <ChevronDown size={14} className={`text-gray-400 mr-2 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 top-full mt-4 w-56 bg-neu-base rounded-2xl shadow-neu-out p-3 z-50 animate-fade-in border border-white/30">
                    <div className="px-4 py-3 border-b border-gray-200/50 mb-2">
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Profile Session</p>
                      <p className="font-bold text-neu-text truncate text-lg">{user.name}</p>
                    </div>
                    <button 
                      onClick={() => { setSelectedCategory('Watch Later'); setShowProfileMenu(false); }}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:text-neu-accent hover:bg-white/40 transition-all text-sm font-bold"
                    >
                      <Clock size={18} />
                      <span>My Watch List</span>
                    </button>
                    <button 
                      onClick={onSwitchProfile}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:text-neu-accent hover:bg-white/40 transition-all text-sm font-bold"
                    >
                      <LogOut size={18} />
                      <span>Switch Identity</span>
                    </button>
                  </div>
                )}
            </div>
        </div>
      </nav>

      {/* Hero Section - Cinematic Layout */}
      <header className="relative w-full h-[95vh] overflow-hidden">
        {featuredContent && (
            <>
                <div className="absolute inset-0 animate-slow-zoom">
                    <img src={featuredContent.backdrop_path} className="w-full h-full object-cover" alt="Hero" />
                </div>
                {/* Gradient Masks */}
                <div className="absolute inset-0 bg-gradient-to-r from-neu-base via-transparent to-transparent opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-neu-base via-transparent to-black/20" />
                <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-neu-base to-transparent" />
                
                <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-20 z-10">
                    <div className="max-w-3xl space-y-6 animate-fade-in">
                        <div className="flex items-center gap-3">
                             <span className="glass-dark text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                                Featuring
                             </span>
                             <div className="flex items-center text-yellow-500 gap-1 text-sm font-bold">
                                <Star size={16} fill="currentColor" /> {featuredContent.rating} IMDb
                             </div>
                        </div>

                        <h2 className="text-6xl md:text-8xl font-black text-neu-text leading-[1.1] font-cinematic drop-shadow-2xl">
                            {featuredContent.title}
                        </h2>
                        
                        <div className="flex flex-wrap gap-2">
                            {featuredContent.genre.map(g => (
                                <span key={g} className="text-xs font-bold text-neu-accent uppercase tracking-widest bg-neu-accent/10 px-3 py-1 rounded-lg">
                                    {g}
                                </span>
                            ))}
                        </div>

                        <p className="text-gray-600 text-lg md:text-xl line-clamp-3 leading-relaxed max-w-2xl font-medium">
                            {featuredContent.overview}
                        </p>
                        
                        <div className="flex items-center gap-6 pt-6">
                             <button 
                                onClick={() => setSelectedMovie(featuredContent as any)}
                                className="bg-neu-accent text-white px-10 py-5 rounded-2xl shadow-neu-out flex items-center gap-4 hover:scale-105 active:scale-95 transition-all group"
                            >
                                <Play fill="currentColor" size={24} className="group-hover:animate-pulse" /> 
                                <span className="font-black text-lg tracking-widest uppercase">Start Journey</span>
                            </button>
                            
                            <NeuIconButton 
                                onClick={() => toggleWatchLater(featuredContent)}
                                className={`w-16 h-16 flex items-center justify-center !rounded-2xl group transition-all ${watchLater.some(m => m.id === featuredContent.id) ? '!bg-neu-accent !text-white' : ''}`}
                                title={watchLater.some(m => m.id === featuredContent.id) ? "Remove from Watch Later" : "Add to Watch Later"}
                            >
                                {watchLater.some(m => m.id === featuredContent.id) ? <Check size={24} /> : <Plus size={24} className="group-hover:rotate-90 transition-transform" />}
                            </NeuIconButton>
                        </div>
                    </div>
                </div>

                {/* Vertical Sidebar Info (Right) - Retro/Fun Switch */}
                <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-8 hidden xl:flex z-10 animate-fade-in">
                     <NeuIconButton 
                        onClick={() => setShowFunSelector(!showFunSelector)}
                        className={`w-14 h-14 !rounded-2xl transition-all duration-500 group ${funMode ? 'shadow-neu-in bg-neu-base border border-retro-neon-pink/50' : 'shadow-neu-out bg-neu-base hover:scale-110'}`}
                        title="Toggle Fun Mode"
                    >
                        <Sparkles 
                            size={24} 
                            className={`transition-all duration-500 ${funMode ? 'text-retro-neon-pink animate-spin-slow' : 'text-neu-accent group-hover:rotate-12'}`} 
                        />
                    </NeuIconButton>
                </div>
            </>
        )}
      </header>

      {/* Main Content Area */}
      <main className="relative z-20 px-6 -mt-32 space-y-16 pb-20">
         {/* Categories Row */}
         <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-4 px-2">
            {['Originals', 'Watch Later', 'Legends', 'Action', 'Sci-Fi', 'Historical', 'Documentary', 'Drama'].map(cat => (
                <button 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-8 py-4 rounded-2xl bg-neu-base shadow-neu-out whitespace-nowrap text-sm font-bold transition-all hover:translate-y-[-2px] ${selectedCategory === cat ? 'text-neu-accent shadow-neu-in' : 'text-gray-600 hover:text-neu-accent'}`}
                >
                    {cat}
                </button>
            ))}
         </div>

         {/* Trending / Filtered Section */}
         {trendingContent.length > 0 && (
             <Section 
                title={selectedCategory === 'Originals' ? "Seni Trending" : `${selectedCategory} Top 15`}
                subtitle={selectedCategory === 'Originals' ? "The most watched stories this week" : "Curated selections based on your filter"}
                icon={selectedCategory === 'Originals' ? <TrendingUp className="text-neu-accent" size={20}/> : <Layers className="text-neu-accent" size={20}/>}
                rightElement={
                    // Sort Controls only show for specific categories, not 'Originals' or 'Watch Later'
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
                                    className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${sortBy === sortOption.value ? 'bg-neu-accent text-white border-neu-accent shadow-neu-in' : 'bg-transparent text-gray-500 border-gray-300 hover:text-neu-text'}`}
                                >
                                    {sortOption.label}
                                </button>
                            ))}
                        </div>
                    )
                }
                movies={trendingContent} 
                onPlay={(m) => setSelectedMovie(m as any)} 
            />
         )}

         {/* Recommended Section */}
         {recommendedContent.length > 0 && (
             <Section 
                title="Pujangga Recommends" 
                subtitle="Curated based on your interests"
                icon={<Eye className="text-neu-accent" size={20}/>}
                movies={recommendedContent} 
                onPlay={(m) => setSelectedMovie(m as any)} 
            />
         )}

         {/* Watchlist Section */}
         <Section 
            title="Parchment List" 
            subtitle="Pick up where you left off"
            icon={<Bookmark className="text-neu-accent" size={20}/>}
            movies={filteredContent.slice(0, 3)} 
            onPlay={(m) => setSelectedMovie(m as any)} 
         />
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
                    className="absolute top-8 right-8 z-50 p-4 glass rounded-full text-white hover:bg-red-500 transition-all hover:rotate-90"
                  >
                    <CloseIcon size={24} />
                  </button>
              )}

              <div className="flex-1 relative flex overflow-hidden bg-black">
                
                {/* LEFT PANEL: AI & Transcription */}
                <div className={`absolute left-0 top-0 bottom-0 z-40 bg-neu-base/90 backdrop-blur-2xl border-r border-white/20 transition-all duration-500 flex flex-col ${leftTabOpen ? 'w-[22rem] translate-x-0' : 'w-[22rem] -translate-x-full'}`}>
                    <div className="p-6 border-b border-gray-200/50 flex justify-between items-center bg-white/40">
                        <div className="flex flex-col">
                            <h3 className="font-black text-neu-text flex items-center gap-2 uppercase tracking-widest text-sm">
                                <FileText size={18} className="text-neu-accent"/> Xscribe
                            </h3>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">AI Scene Analysis & Reviews</span>
                        </div>
                        <button title="Close Xscribe" onClick={() => setLeftTabOpen(false)} className="text-gray-400 hover:text-red-500"><ChevronLeft/></button>
                    </div>
                    
                    <div className="flex-1 p-6 overflow-y-auto space-y-6" ref={transcriptRef}>
                        {transcriptError ? (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-fade-in">
                                <div className="p-6 bg-neu-base shadow-neu-out rounded-3xl text-red-500">
                                    <AlertCircle size={40} />
                                </div>
                                <div className="space-y-2">
                                    <p className="font-black text-gray-700 uppercase tracking-widest text-xs">Xscribe Blockage</p>
                                    <p className="text-xs text-gray-500 leading-relaxed">{transcriptError}</p>
                                </div>
                                <NeuButton onClick={handleXscribeAnalysis} variant="primary" className="w-full flex items-center justify-center gap-2">
                                    <RefreshCw size={16} className={isGenerating ? "animate-spin" : ""} />
                                    Reconnect Xscribe
                                </NeuButton>
                            </div>
                        ) : !transcript ? (
                            <div className="text-center mt-4 space-y-6 animate-fade-in">
                                <div className="p-4 bg-neu-base shadow-neu-in rounded-3xl border border-white/50">
                                    <h5 className="text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">xScribe Context Box</h5>
                                    <textarea 
                                        className="w-full h-32 bg-transparent border-none outline-none text-xs text-gray-700 p-2 font-mono resize-none" 
                                        placeholder="e.g., 'Analyze the emotional depth of this scene' or 'Focus on the use of lighting'..."
                                        value={xScribeContext}
                                        onChange={(e) => setXScribeContext(e.target.value)}
                                    />
                                </div>
                                
                                <p className="text-[10px] font-bold text-gray-400 leading-relaxed tracking-wider uppercase">
                                    Summon Xscribe for:
                                    <br/>
                                    <span className="text-neu-accent">{selectedMovie.title}</span>
                                </p>
                                <NeuButton 
                                    title="Summon Xscribe"
                                    onClick={handleXscribeAnalysis}
                                    disabled={isGenerating}
                                    className="w-full h-16 !rounded-2xl flex justify-center items-center gap-3 text-lg"
                                >
                                    {isGenerating ? <Loader2 size={24} className="animate-spin" /> : <Send size={20} />}
                                    Summon Xscribe
                                </NeuButton>
                            </div>
                        ) : (
                            <div className="bg-white/60 p-6 rounded-3xl shadow-neu-in text-xs text-gray-700 whitespace-pre-wrap font-mono leading-loose border border-white/50 animate-ink-bleed">
                                {transcript}
                            </div>
                        )}
                    </div>

                    {transcript && (
                        <div className="p-6 bg-white/40 border-t border-gray-200/50 space-y-6">
                             <div className="grid grid-cols-2 gap-4">
                                <button title="Export Analysis" onClick={handleDownloadTxt} className="h-12 rounded-xl bg-neu-base shadow-neu-btn hover:text-neu-accent flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                    <Download size={14} /> Export
                                </button>
                                <button title="Copy Analysis" onClick={handleCopy} className="h-12 rounded-xl bg-neu-base shadow-neu-btn hover:text-neu-accent flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                    <Copy size={14} /> Copy
                                </button>
                             </div>
                             <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em]">Share Scene</span>
                                <div className="flex gap-2">
                                    {['Instagram', 'Facebook', 'Twitter', 'Reddit'].map(p => (
                                        <button key={p} title={`Share on ${p}`} onClick={() => shareToSocial(p)} className="w-10 h-10 rounded-full shadow-neu-btn flex items-center justify-center hover:scale-110 transition-transform">
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

                <button title={leftTabOpen ? "Close Xscribe" : "Open Xscribe"} onClick={() => setLeftTabOpen(!leftTabOpen)} className={`absolute top-1/2 left-0 z-50 transform -translate-y-1/2 bg-neu-base/60 backdrop-blur-lg p-3 rounded-r-2xl shadow-neu-out hover:text-neu-accent transition-all ${leftTabOpen ? 'translate-x-[22rem]' : 'translate-x-0'}`}>
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
                                <div className="w-12 h-32 bg-[#4e342e] rounded-lg shadow-neu-in mt-4 border border-black/20"></div>
                            </div>
                        )}
                        
                        <iframe 
                            className="w-full h-full rounded-sm" 
                            src={
                                videoSource === 'vidsrc' 
                                ? (selectedMovie.media_type === 'movie' 
                                    ? `${VIDSRC_URL}/movie/${selectedMovie.id}?iframe=true&controls=0&showinfo=0&modestbranding=1&autoplay=1`
                                    : `${VIDSRC_URL}/tv/${selectedMovie.id}/${selectedSeason}/${selectedEpisode}?iframe=true&controls=0&showinfo=0&modestbranding=1&autoplay=1`)
                                : (selectedMovie.media_type === 'movie'
                                    ? `https://vidfast.pro/movie/${selectedMovie.id}?autoPlay=true&theme=F59E0B`
                                    : `https://vidfast.pro/tv/${selectedMovie.id}/${selectedSeason}/${selectedEpisode}?autoPlay=true&theme=F59E0B&autoNext=true&nextButton=true`)
                            }
                            allow="autoplay; encrypted-media" 
                            allowFullScreen
                            title={`${selectedMovie.title} Player`}
                        ></iframe>

                        {selectedMovie.media_type === 'tv' && (
                            <div className="absolute top-10 left-10 glass-dark text-white px-6 py-2 rounded-full text-xs font-black tracking-widest uppercase z-20">
                                S{selectedSeason} • E{selectedEpisode}
                            </div>
                        )}

                        <div className="absolute bottom-[-3rem] right-0 flex items-center gap-2">
                             <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Server:</span>
                             <button 
                                onClick={() => setVideoSource(prev => prev === 'vidsrc' ? 'vidfastpro' : 'vidsrc')}
                                className="px-3 py-1 rounded-lg bg-neu-base shadow-neu-out hover:shadow-neu-in text-[10px] font-black uppercase tracking-widest text-neu-accent transition-all flex items-center gap-2"
                             >
                                <RefreshCw size={10} className={videoSource === 'vidfastpro' ? 'animate-spin' : ''} />
                                {videoSource === 'vidsrc' ? 'VidSrc (Default)' : 'VidFast (Backup)'}
                             </button>
                        </div>

                        {isCaptionsOn && (
                           <div className="absolute bottom-10 w-full flex justify-center px-12 z-20">
                               <span className="glass-dark text-white px-8 py-3 rounded-3xl text-xl font-cinematic animate-fade-in text-center max-w-2xl border border-white/10">
                                 "The shadows tell the truth when the light fades."
                               </span>
                           </div>
                        )}
                    </div>
                </div>

                <button title={rightTabOpen ? "Close Details" : "Open Details"} onClick={() => setRightTabOpen(!rightTabOpen)} className={`absolute top-1/2 right-0 z-50 transform -translate-y-1/2 bg-neu-base/60 backdrop-blur-lg p-3 rounded-l-2xl shadow-neu-out hover:text-neu-accent transition-all ${rightTabOpen ? '-translate-x-[22rem]' : 'translate-x-0'}`}>
                    {rightTabOpen ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
                </button>

                {/* RIGHT PANEL: Party & Stats */}
                <div className={`absolute right-0 top-0 bottom-0 z-40 bg-neu-base/90 backdrop-blur-2xl border-l border-white/20 transition-all duration-500 flex flex-col ${rightTabOpen ? 'w-[22rem] translate-x-0' : 'w-[22rem] translate-x-full'}`}>
                    {isWatchParty ? (
                        <div className="flex flex-col h-full">
                             <div className="p-6 border-b border-gray-200/50 flex justify-between items-center bg-white/40">
                                <h3 className="font-black text-neu-text flex items-center gap-2 uppercase tracking-widest text-sm">
                                    <Users size={18} className="text-neu-accent"/> Public Square
                                </h3>
                                <button title="Close Public Square" onClick={() => setRightTabOpen(false)} className="text-gray-400 hover:text-red-500"><ChevronRight/></button>
                             </div>
                              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {/* Host Controls Section */}
                                <div className="p-5 bg-neu-base shadow-neu-in rounded-3xl border border-white/40 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Share Link</span>
                                            <span className="text-[10px] font-bold text-neu-accent truncate max-w-[120px]">{partyLink || 'Generating...'}</span>
                                        </div>
                                        <div className="bg-neu-accent/10 border border-neu-accent/20 px-3 py-1 rounded-xl">
                                            <span className="text-[10px] font-black text-neu-accent uppercase">Code: {partyCode || '---'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-200/30">
                                        <span className="text-[10px] font-black text-gray-400 uppercase">Capacity</span>
                                        <div className="flex items-center gap-3">
                                            <button title="Decrease Capacity" onClick={() => setPartyCapacity(Math.max(1, partyCapacity - 1))} className="w-6 h-6 rounded-lg shadow-neu-btn flex items-center justify-center text-xs">-</button>
                                            <span className="text-xs font-black text-neu-text">{partyMembers.length}/{partyCapacity}</span>
                                            <button title="Increase Capacity" onClick={() => setPartyCapacity(Math.min(5, partyCapacity + 1))} className="w-6 h-6 rounded-lg shadow-neu-btn flex items-center justify-center text-xs">+</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Member Status List (from Mockup) */}
                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Member Quota Tracking</h4>
                                    <div className="space-y-2">
                                        {partyMembers.map((member: {username: string, status: string, link: string}, i: number) => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-white/30 rounded-2xl border border-white/50 shadow-neu-out-sm transition-all hover:scale-[1.02]">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-neu-text tracking-tight">{member.username}</span>
                                                    <span className="text-[8px] text-gray-400 truncate max-w-[100px]">{member.link}</span>
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
                                    <div key={idx} className="bg-white/40 p-4 rounded-2xl shadow-neu-out-sm border border-white/30 animate-fade-in">
                                        <span className="font-black text-neu-accent text-[10px] block uppercase tracking-tighter mb-1">{msg.user}</span>
                                        <span className="text-xs text-gray-700 leading-relaxed font-medium">{msg.text}</span>
                                    </div>
                                ))}
                                <div ref={partyChatEndRef}/>
                             </div>
                             <div className="p-6 bg-white/40 border-t border-gray-200/50 flex gap-3">
                                <NeuInput className="!py-3 !px-4 text-xs font-bold" placeholder="Whisper to the crowd..." value={partyChatMsg} onChange={e => setPartyChatMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendPartyMessage()}/>
                                <NeuIconButton onClick={handleSendPartyMessage} className="!p-3 shadow-neu-out !rounded-2xl"><Send size={18}/></NeuIconButton>
                             </div>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full">
                            <div className="p-6 border-b border-gray-200/50 flex justify-between items-center bg-white/40">
                                <h3 className="font-black text-neu-text flex items-center gap-2 uppercase tracking-widest text-sm">
                                    <Layers size={18} className="text-neu-accent"/> Artifact Info
                                </h3>
                                <button title="Close Details" onClick={() => setRightTabOpen(false)} className="text-gray-400 hover:text-red-500"><ChevronRight/></button>
                            </div>
                            <div className="flex-1 p-6 space-y-8 overflow-y-auto">
                                {/* JOIN PARTY PORTAL */}
                                <div className="p-6 bg-neu-base shadow-neu-in rounded-[2rem] border border-white/50 space-y-4">
                                     <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Join Watchparty</h4>
                                     <div className="flex gap-2">
                                         <NeuInput 
                                             placeholder="Enter Room Code..." 
                                             className="!text-[10px] font-black"
                                             value={joinInput}
                                             onChange={(e) => setJoinInput(e.target.value)}
                                         />
                                         <NeuIconButton 
                                             onClick={handleJoinParty} 
                                             title="Join Party"
                                             className="!p-3 !rounded-xl"
                                             disabled={isJoining}
                                         >
                                             {isJoining ? <Loader2 size={16} className="animate-spin"/> : <ArrowRight size={16}/>}
                                         </NeuIconButton>
                                     </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-6 bg-neu-base shadow-neu-in rounded-[2rem] border border-white/50">
                                        <h4 className="font-black text-neu-text text-xl mb-1">{selectedMovie.title}</h4>
                                        <div className="flex gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            <span>{selectedMovie.release_date}</span>
                                            <span className="text-neu-accent">{selectedMovie.media_type === 'movie' ? 'Cinematic' : 'Serial'}</span>
                                        </div>
                                    </div>
                                </div>

                                {selectedMovie.media_type === 'tv' && (
                                    <div className="p-6 bg-white/40 shadow-neu-out rounded-[2rem] border border-white/30 space-y-6">
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Season</h4>
                                            <div className="flex gap-4 overflow-x-auto no-scrollbar py-4 px-2 -mx-2">
                                                {Array.from({length: selectedMovie.total_seasons || 1}, (_, i) => i + 1).map(s => (
                                                    <button 
                                                        key={s} 
                                                        onClick={() => setSelectedSeason(s)} 
                                                        className={`min-w-[48px] h-12 rounded-2xl flex items-center justify-center text-xs font-black transition-all flex-shrink-0 ${selectedSeason === s ? 'bg-neu-accent text-white shadow-neu-out scale-110 border-2 border-white/20' : 'bg-neu-base text-gray-500 shadow-neu-btn hover:text-neu-text'}`}
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Episode / Jump</h4>
                                            <div className="relative group">
                                                <NeuInput 
                                                    value={sxeInput} 
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSxEChange(e.target.value)} 
                                                    className="!text-center font-black !rounded-3xl shadow-neu-in !py-4 text-lg tracking-widest uppercase border-2 border-transparent focus:border-cyan-400 transition-all"
                                                    placeholder="S1E1"
                                                />
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-cyan-500 opacity-50 uppercase tracking-tighter pointer-events-none">
                                                    S<i>x</i>E<i>yy</i>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center px-2">
                                                <button title="Previous Episode" onClick={() => setSelectedEpisode(Math.max(1, selectedEpisode - 1))} className="text-[10px] font-bold text-gray-400 hover:text-neu-accent uppercase">Prev</button>
                                                <div className="text-[10px] font-black text-neu-accent">S{selectedSeason} : E{selectedEpisode}</div>
                                                <button title="Next Episode" onClick={() => setSelectedEpisode(selectedEpisode + 1)} className="text-[10px] font-bold text-gray-400 hover:text-neu-accent uppercase">Next</button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Subtitle Management</h4>
                                    <div className="grid gap-3">
                                        <button 
                                            onClick={() => window.open(`https://www.opensubtitles.org/en/search/sublanguageid-all/moviename-${encodeURIComponent(selectedMovie.title)}`, '_blank')}
                                            title="Search on OpenSubtitles" 
                                            className="w-full py-4 px-6 rounded-2xl bg-neu-base shadow-neu-btn hover:shadow-neu-in text-xs font-bold flex justify-between items-center text-neu-text hover:text-neu-accent transition-all group"
                                        >
                                            <span>Search Subtitles</span>
                                            <Search size={14} className="group-hover:scale-110 transition-transform" />
                                        </button>
                                        
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
                                            <button className="w-full py-4 px-6 rounded-2xl bg-neu-base shadow-neu-btn group-hover:shadow-neu-in text-xs font-bold flex justify-between items-center text-neu-text group-hover:text-neu-accent transition-all pointer-events-none">
                                                <span>Upload Subtitle (.srt)</span>
                                                <Captions size={14} className="group-hover:scale-110 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
              </div>

              {/* CONSOLE: Bottom Player Bar */}
              <div className="h-24 bg-neu-base/90 backdrop-blur-xl z-50 flex items-center justify-between px-10 border-t border-white/30">
                  <div className="flex items-center gap-6">
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
                     <div className="text-[10px] font-black tracking-widest text-neu-text/60">04:20 : 01:32:00</div>
                  </div>

                 <div className="flex-1 mx-12 hidden lg:block">
                     <div className="h-2 bg-neu-shadowDark/20 rounded-full shadow-neu-in relative group cursor-pointer">
                         <div className="h-full bg-neu-accent w-1/3 rounded-full relative shadow-[0_0_10px_rgba(108,92,231,0.5)]">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform"></div>
                         </div>
                     </div>
                 </div>

                 <div className="flex items-center gap-4">
                     <NeuIconButton onClick={() => setIsCaptionsOn(!isCaptionsOn)} active={isCaptionsOn} className="w-12 h-12 !rounded-xl" title="Captions">
                        <Captions size={20} />
                     </NeuIconButton>
                     <NeuIconButton onClick={toggleWatchParty} active={isWatchParty} className="w-12 h-12 !rounded-xl" title="Watchparty">
                        <Users size={20} />
                     </NeuIconButton>
                     <NeuIconButton onClick={() => setIsTheaterMode(!isTheaterMode)} active={isTheaterMode} className="w-12 h-12 !rounded-xl hidden md:flex" title="Theater Mode">
                        <Monitor size={20} />
                     </NeuIconButton>
                     <NeuIconButton onClick={toggleFullscreen} className="w-12 h-12 !rounded-xl" title="Fullscreen">
                        {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                     </NeuIconButton>
                 </div>
              </div>

           </div>
        </div>
      )}
    </div>
  );
};

const Section: React.FC<{ title: string, subtitle?: string, icon?: React.ReactNode, rightElement?: React.ReactNode, movies: Movie[], onPlay: (m: Movie) => void }> = ({ title, subtitle, icon, rightElement, movies, onPlay }) => (
  <div className="space-y-6">
    <div className="flex items-end justify-between px-2">
        <div className="space-y-1">
            <h3 className="text-3xl font-black text-neu-text font-cinematic flex items-center gap-3 tracking-wider">
                {icon} {title}
            </h3>
            {subtitle && <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-4">
            {rightElement}
            <button title="View Full Archive" className="text-xs font-black text-neu-accent uppercase tracking-widest hover:underline px-4 py-2 bg-neu-accent/10 rounded-xl">View Archive</button>
        </div>
    </div>
    
    <div className="flex overflow-x-auto space-x-8 pb-10 px-4 no-scrollbar">
      {movies.map(movie => (
        <div key={movie.id} onClick={() => onPlay(movie)} className="min-w-[220px] md:min-w-[280px] group cursor-pointer transition-all">
           <div className="relative rounded-[2rem] overflow-hidden shadow-neu-out mb-6 aspect-[10/14] border-4 border-transparent group-hover:border-neu-accent/30 transition-all">
              <img src={movie.poster_path} alt={movie.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                 <div className="w-16 h-16 glass rounded-full flex items-center justify-center text-white scale-50 group-hover:scale-100 transition-transform">
                    <PlayCircle size={40} fill="rgba(255,255,255,0.2)" />
                 </div>
                 <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] translate-y-4 group-hover:translate-y-0 transition-transform duration-500">Play Reel</span>
              </div>
              
              <div className="absolute top-4 left-4">
                 <div className="glass-dark px-3 py-1 rounded-full text-[8px] font-black text-white uppercase tracking-widest">
                    {movie.rating} Rating
                 </div>
              </div>
              
              {movie.media_type === 'tv' && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-neu-accent px-3 py-1 rounded-full text-[8px] font-black text-white uppercase tracking-widest shadow-lg">
                        Serial
                    </div>
                  </div>
              )}
           </div>
           
           <div className="space-y-2 px-2 group-hover:translate-x-1 transition-transform">
               <h4 className="font-black text-neu-text text-lg truncate tracking-wide">{movie.title}</h4>
               <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                 <span>{movie.release_date}</span>
                 <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                 <span className="truncate">{movie.genre[0]}</span>
               </div>
           </div>
        </div>
      ))}
    </div>
  </div>
);
