import { Movie } from "../types";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const fetchTrending = async (
  type: "movie" | "tv" | "all" = "all",
): Promise<Movie[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`,
    );
    const data = await response.json();
    return data.results.map(mapTMDBToMovie);
  } catch (error) {
    console.error("Error fetching trending:", error);
    return [];
  }
};

export const fetchByGenre = async (
  genreId: number, 
  type: 'movie' | 'tv' = 'movie',
  sortBy: string = 'popularity.desc'
): Promise<Movie[]> => {
  try {
    const response = await fetch(
       `${BASE_URL}/discover/${type}?api_key=${API_KEY}&with_genres=${genreId}&sort_by=${sortBy}&vote_count.gte=100`
    );
    const data = await response.json();
    return data.results.map(mapTMDBToMovie);
  } catch (error) {
    console.error(`Error fetching genre ${genreId}:`, error);
    return [];
  }
};

export const fetchByDecade = async (decade: number, type: 'movie' | 'tv' = 'movie'): Promise<Movie[]> => {
  try {
    const startYear = decade;
    const endYear = decade + 9;
    const dateParam = type === 'movie' ? 'primary_release_date' : 'first_air_date';
    const response = await fetch(
      `${BASE_URL}/discover/${type}?api_key=${API_KEY}&${dateParam}.gte=${startYear}-01-01&${dateParam}.lte=${endYear}-12-31&sort_by=popularity.desc`
    );
    const data = await response.json();
    return data.results.map(mapTMDBToMovie);
  } catch (error) {
    console.error(`Error fetching ${type} from decade ${decade}:`, error);
    return [];
  }
};

export const searchMulti = async (query: string): Promise<Movie[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`,
    );
    const data = await response.json();
    return data.results
      .filter(
        (item: any) => item.media_type === "movie" || item.media_type === "tv",
      )
      .map(mapTMDBToMovie);
  } catch (error) {
    console.error("Error searching:", error);
    return [];
  }
};

export const fetchDetails = async (
  id: number,
  type: "movie" | "tv",
): Promise<any> => {
  try {
    const response = await fetch(
      `${BASE_URL}/${type}/${id}?api_key=${API_KEY}`,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching details:", error);
    return null;
  }
};

const mapTMDBToMovie = (item: any): Movie => {
  return {
    id: item.id,
    title: item.title || item.name,
    poster_path: item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : "https://via.placeholder.com/500x750",
    backdrop_path: item.backdrop_path
      ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
      : "https://via.placeholder.com/1920x1080",
    overview: item.overview,
    rating: item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : 0,
    release_date:
      (item.release_date || item.first_air_date || "").split("-")[0] || "N/A",
    genre: [], // Genres are IDs in list, handled differently if needed, keeping simple for now
    media_type: item.media_type || (item.title ? "movie" : "tv"),
    total_seasons: item.number_of_seasons,
  };
};
