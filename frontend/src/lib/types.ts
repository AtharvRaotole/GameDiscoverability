/**
 * Core type definitions for GameSoul
 */

export interface EmotionVector {
  embedding: number[]; // 3072 dimensions from OpenAI
  emotions: EmotionProfile;
}

export interface EmotionProfile {
  joy: number; // 0-1
  melancholy: number;
  tension: number;
  wonder: number;
  nostalgia: number;
  catharsis: number;
  comfort: number;
  challenge: number;
}

export interface EmotionTag {
  word: string;
  intensity: number; // 0-1
  category: keyof EmotionProfile;
}

export interface Game {
  id: string; // Steam App ID
  name: string;
  description: string;
  shortDescription?: string;
  headerImage: string;
  capsuleImage: string;
  releaseDate: string;
  price: number;
  steamUrl: string;
  soulScore: number; // 0-100
  emotionVector?: EmotionVector;
  emotionProfile?: EmotionProfile;
  genres: string[];
  tags: string[];
  estimatedHours?: number;
  playerMode?: "Solo" | "Co-op" | "Multiplayer";
  releaseYear?: number;
}

export interface GameMatch {
  game: Game;
  matchScore: number; // 0-100
  soulScore: number;
  emotionAlignment: number; // 0-100
}

export interface SearchOptions {
  limit?: number;
  minSoulScore?: number;
  genres?: string[];
  priceRange?: { min: number; max: number };
  excludeGameIds?: string[];
  boostIndie?: boolean;
}

export interface FilterState {
  soulScoreRange: [number, number];
  priceRange: [number, number];
  genres: string[];
  releaseYearRange: [number, number];
  playerMode: ("Solo" | "Co-op" | "Multiplayer")[];
  gameLength: string[];
}

export interface Journey {
  id: string;
  title: string;
  description: string;
  games: Game[];
  emotionalArc: EmotionalArc;
  totalHours: number;
  creator?: User;
  completionCount: number;
  isCurated: boolean;
}

export interface EmotionalArc {
  emotions: EmotionProfile[];
  transitions: EmotionTransition[];
}

export interface EmotionTransition {
  from: number; // game index
  to: number;
  emotion: keyof EmotionProfile;
  intensity: number;
}

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  gameId: string;
  userId: string;
  text: string;
  sentiment: number; // -1 to 1
  date: string;
}

export interface TasteRayGame {
  id: string;
  name: string;
  description: string;
  genres: string[];
  tags: string[];
  releaseDate: string;
  price: number;
  steamUrl: string;
  images: {
    header: string;
    capsule: string;
  };
}

export interface TimelineEntry {
  gameId: string;
  gameName: string;
  completedAt: string;
  emotionProfile: EmotionProfile;
}

