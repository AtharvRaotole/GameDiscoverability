/**
 * Zustand store for discovery/search state
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { EmotionVector, GameMatch, FilterState } from "@/lib/types";

interface DiscoveryStore {
  // Search state
  query: string;
  emotionVector: EmotionVector | null;
  results: GameMatch[];
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
  total: number;

  // Filter state
  filters: FilterState;

  // Actions
  setQuery: (query: string) => void;
  setEmotionVector: (vector: EmotionVector) => void;
  setResults: (results: GameMatch[], total: number, hasMore: boolean) => void;
  addResults: (results: GameMatch[], hasMore: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  reset: () => void;
}

const defaultFilters: FilterState = {
  soulScoreRange: [0, 100],
  priceRange: [0, 60],
  genres: [],
  releaseYearRange: [2010, new Date().getFullYear()],
  playerMode: [],
  gameLength: [],
};

export const useDiscoveryStore = create<DiscoveryStore>()(
  persist(
    (set) => ({
      // Initial state
      query: "",
      emotionVector: null,
      results: [],
      isLoading: false,
      hasMore: false,
      error: null,
      total: 0,
      filters: defaultFilters,

      // Actions
      setQuery: (query) => set({ query }),
      setEmotionVector: (vector) => set({ emotionVector: vector }),
      setResults: (results, total, hasMore) =>
        set({ results, total, hasMore }),
      addResults: (results, hasMore) =>
        set((state) => ({
          results: [...state.results, ...results],
          hasMore,
        })),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      updateFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),
      resetFilters: () => set({ filters: defaultFilters }),
      reset: () =>
        set({
          query: "",
          emotionVector: null,
          results: [],
          isLoading: false,
          hasMore: false,
          error: null,
          total: 0,
          filters: defaultFilters,
        }),
    }),
    {
      name: "discovery-storage",
      partialize: (state) => ({
        query: state.query,
        filters: state.filters,
      }),
    }
  )
);

