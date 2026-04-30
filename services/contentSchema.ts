/**
 * Content Catalog Schema
 * 
 * Categorized list of movies, TV shows, and anime with TMDB IDs.
 * Used for curated collections and ensuring accurate metadata.
 * All TMDB IDs are real and can be used with the TMDB API.
 */

export type ContentType = 'movie' | 'series';
export type ContentCategory = 'movies' | 'series' | 'anime';

export interface ContentEntry {
  tmdbId: number;
  title: string;
  type: ContentType;
  category: ContentCategory;
  tags: string[];
  totalSeasons?: number; // Only for series
  yearStart: number;
  yearEnd?: number | null; // null = still airing
  status: 'released' | 'airing' | 'ended' | 'upcoming';
}

// ─── MOVIES ──────────────────────────────────────────────────────
export const MOVIES_CATALOG: ContentEntry[] = [
  {
    tmdbId: 278,
    title: 'The Shawshank Redemption',
    type: 'movie',
    category: 'movies',
    tags: ['Drama', 'Crime', 'Classic'],
    yearStart: 1994,
    status: 'released',
  },
  {
    tmdbId: 533535,
    title: 'Deadpool & Wolverine',
    type: 'movie',
    category: 'movies',
    tags: ['Action', 'Comedy', 'Superhero'],
    yearStart: 2024,
    status: 'released',
  },
  {
    tmdbId: 917007,
    title: 'Gladiator II',
    type: 'movie',
    category: 'movies',
    tags: ['Action', 'Drama', 'Adventure'],
    yearStart: 2024,
    status: 'released',
  },
  {
    tmdbId: 1184918,
    title: 'The Wild Robot',
    type: 'movie',
    category: 'movies',
    tags: ['Animation', 'Sci-Fi', 'Family'],
    yearStart: 2024,
    status: 'released',
  },
  {
    tmdbId: 762509,
    title: 'Mufasa: The Lion King',
    type: 'movie',
    category: 'movies',
    tags: ['Animation', 'Adventure', 'Family'],
    yearStart: 2024,
    status: 'released',
  },
  {
    tmdbId: 939243,
    title: 'Sonic the Hedgehog 3',
    type: 'movie',
    category: 'movies',
    tags: ['Action', 'Adventure', 'Family'],
    yearStart: 2024,
    status: 'released',
  },
  {
    tmdbId: 1022789,
    title: 'Inside Out 2',
    type: 'movie',
    category: 'movies',
    tags: ['Animation', 'Adventure', 'Comedy'],
    yearStart: 2024,
    status: 'released',
  },
  {
    tmdbId: 872585,
    title: 'Oppenheimer',
    type: 'movie',
    category: 'movies',
    tags: ['Drama', 'History', 'Thriller'],
    yearStart: 2023,
    status: 'released',
  },
];

// ─── TV SERIES ───────────────────────────────────────────────────
export const SERIES_CATALOG: ContentEntry[] = [
  {
    tmdbId: 1396,
    title: 'Breaking Bad',
    type: 'series',
    category: 'series',
    tags: ['Drama', 'Crime', 'Thriller'],
    totalSeasons: 5,
    yearStart: 2008,
    yearEnd: 2013,
    status: 'ended',
  },
  {
    tmdbId: 94997,
    title: 'House of the Dragon',
    type: 'series',
    category: 'series',
    tags: ['Fantasy', 'Drama', 'Action'],
    totalSeasons: 2,
    yearStart: 2022,
    yearEnd: null,
    status: 'airing',
  },
  {
    tmdbId: 100088,
    title: 'The Last of Us',
    type: 'series',
    category: 'series',
    tags: ['Drama', 'Action', 'Sci-Fi'],
    totalSeasons: 2,
    yearStart: 2023,
    yearEnd: null,
    status: 'airing',
  },
  {
    tmdbId: 114472,
    title: 'Shogun',
    type: 'series',
    category: 'series',
    tags: ['Drama', 'History', 'War'],
    totalSeasons: 1,
    yearStart: 2024,
    yearEnd: null,
    status: 'airing',
  },
  {
    tmdbId: 66732,
    title: 'Stranger Things',
    type: 'series',
    category: 'series',
    tags: ['Sci-Fi', 'Horror', 'Drama'],
    totalSeasons: 5,
    yearStart: 2016,
    yearEnd: null,
    status: 'airing',
  },
  {
    tmdbId: 111110,
    title: 'The Penguin',
    type: 'series',
    category: 'series',
    tags: ['Crime', 'Drama'],
    totalSeasons: 1,
    yearStart: 2024,
    yearEnd: null,
    status: 'airing',
  },
  {
    tmdbId: 93405,
    title: 'Squid Game',
    type: 'series',
    category: 'series',
    tags: ['Thriller', 'Drama', 'Action'],
    totalSeasons: 2,
    yearStart: 2021,
    yearEnd: null,
    status: 'airing',
  },
  {
    tmdbId: 124151,
    title: 'Dune: Prophecy',
    type: 'series',
    category: 'series',
    tags: ['Sci-Fi', 'Drama'],
    totalSeasons: 1,
    yearStart: 2024,
    yearEnd: null,
    status: 'airing',
  },
];

// ─── ANIME ───────────────────────────────────────────────────────
export const ANIME_CATALOG: ContentEntry[] = [
  {
    tmdbId: 95479,
    title: 'Jujutsu Kaisen',
    type: 'series',
    category: 'anime',
    tags: ['Animation', 'Action', 'Fantasy', 'Shounen'],
    totalSeasons: 3,
    yearStart: 2020,
    yearEnd: null,
    status: 'airing',
  },
  {
    tmdbId: 85937,
    title: 'Demon Slayer: Kimetsu no Yaiba',
    type: 'series',
    category: 'anime',
    tags: ['Animation', 'Action', 'Fantasy', 'Shounen'],
    totalSeasons: 5,
    yearStart: 2019,
    yearEnd: null,
    status: 'airing',
  },
  {
    tmdbId: 235484,
    title: 'Dan Da Dan',
    type: 'series',
    category: 'anime',
    tags: ['Animation', 'Action', 'Comedy', 'Supernatural'],
    totalSeasons: 1,
    yearStart: 2024,
    yearEnd: null,
    status: 'airing',
  },
  {
    tmdbId: 37854,
    title: 'One Piece',
    type: 'series',
    category: 'anime',
    tags: ['Animation', 'Action', 'Adventure', 'Shounen'],
    totalSeasons: 21,
    yearStart: 1999,
    yearEnd: null,
    status: 'airing',
  },
  {
    tmdbId: 72636,
    title: 'Solo Leveling',
    type: 'series',
    category: 'anime',
    tags: ['Animation', 'Action', 'Fantasy'],
    totalSeasons: 2,
    yearStart: 2024,
    yearEnd: null,
    status: 'airing',
  },
  {
    tmdbId: 128893,
    title: 'Chainsaw Man',
    type: 'series',
    category: 'anime',
    tags: ['Animation', 'Action', 'Horror', 'Seinen'],
    totalSeasons: 1,
    yearStart: 2022,
    yearEnd: null,
    status: 'airing',
  },
];


// ─── COMBINED CATALOG ────────────────────────────────────────────
export const CONTENT_CATALOG: ContentEntry[] = [
  ...MOVIES_CATALOG,
  ...SERIES_CATALOG,
  ...ANIME_CATALOG,
];

// ─── UTILITY FUNCTIONS ──────────────────────────────────────────
export const getByCategory = (category: ContentCategory): ContentEntry[] =>
  CONTENT_CATALOG.filter((entry) => entry.category === category);

export const getByType = (type: ContentType): ContentEntry[] =>
  CONTENT_CATALOG.filter((entry) => entry.type === type);

export const getByTag = (tag: string): ContentEntry[] =>
  CONTENT_CATALOG.filter((entry) =>
    entry.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
  );

export const getAiring = (): ContentEntry[] =>
  CONTENT_CATALOG.filter((entry) => entry.status === 'airing');

export const findByTmdbId = (tmdbId: number): ContentEntry | undefined =>
  CONTENT_CATALOG.find((entry) => entry.tmdbId === tmdbId);

export const getCatalogStats = () => ({
  totalMovies: MOVIES_CATALOG.length,
  totalSeries: SERIES_CATALOG.length,
  totalAnime: ANIME_CATALOG.length,
  totalEntries: CONTENT_CATALOG.length,
  currentlyAiring: getAiring().length,
});
