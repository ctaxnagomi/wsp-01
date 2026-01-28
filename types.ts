
export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  rating: number;
  release_date: string;
  genre: string[];
  media_type: 'movie' | 'tv';
  total_seasons?: number;
}

export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string; // base64
  isError?: boolean;
  sources?: { uri: string; title: string }[];
}

export type AuthMode = 'LOGIN' | 'GUEST_PIN' | 'QRGGIF';

export enum GemModel {
    CHAT = 'gemini-3-pro-preview',
    FAST = 'gemini-3-flash-preview',
    IMAGE = 'gemini-3-pro-image-preview',
    AUDIO = 'gemini-2.5-flash-native-audio-preview-09-2025',
    SEARCH = 'gemini-3-flash-preview'
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  watchlist: number[]; // Array of Movie IDs
}
