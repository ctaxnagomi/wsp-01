
import { createClient } from '@supabase/supabase-js';
import { Movie } from '../types';

// Initialize Supabase Client
// Note: These env vars must be set in .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

// Auth Helpers
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUpWithEmail = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

// Data Helpers - Watch List
// Table Schema needed in Supabase:
// table: watch_list
// columns: id (int8, primary), user_id (uuid, foreign key), movie_id (int4), movie_data (jsonb)

export const addToWatchList = async (userId: string, movie: Movie) => {
  const { data, error } = await supabase
    .from('watch_list')
    .insert([
      { user_id: userId, movie_id: movie.id, movie_data: movie }
    ])
    .select();
  return { data, error };
};

export const removeFromWatchList = async (userId: string, movieId: number) => {
  const { error } = await supabase
    .from('watch_list')
    .delete()
    .eq('user_id', userId)
    .eq('movie_id', movieId);
  return { error };
};

export const getWatchList = async (userId: string) => {
  const { data, error } = await supabase
    .from('watch_list')
    .select('*')
    .eq('user_id', userId);
  
  if (data) {
      return data.map(item => item.movie_data as Movie);
  }
  return [];
};
