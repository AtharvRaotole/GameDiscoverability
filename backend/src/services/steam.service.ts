/**
 * Steam API Service
 * Alternative source for game data if TasteRay doesn't provide game catalog
 * Uses Steam Web API for game information
 */

import { cache } from "../config/redis";

export interface SteamGame {
  appid: string;
  name: string;
  type?: string;
  is_free?: boolean;
}

export interface SteamGameDetails {
  steam_appid: string;
  name: string;
  short_description: string;
  detailed_description: string;
  header_image: string;
  capsule_image: string;
  release_date: {
    coming_soon: boolean;
    date: string;
  };
  price_overview?: {
    currency: string;
    initial: number;
    final: number;
  };
  genres: Array<{ id: string; description: string }>;
  categories: Array<{ id: string; description: string }>;
  platforms: Record<string, boolean>;
  reviews?: {
    total: number;
    positive: number;
    negative: number;
    review_score?: number; // 0-100
    review_score_desc?: string; // "Very Positive", "Overwhelmingly Positive", etc.
  };
  recommendations?: {
    total: number;
  };
  metacritic?: {
    score: number;
    url?: string;
  };
  developers?: string[];
  publishers?: string[];
}

/**
 * Steam API Service
 * Note: Steam Web API requires an API key from https://steamcommunity.com/dev/apikey
 */
export class SteamService {
  private baseUrl = "https://store.steampowered.com/api";

  constructor() {
    // Steam API key is optional for most endpoints
  }

  /**
   * Search games by name
   */
  async searchGames(query: string, limit = 20): Promise<SteamGame[]> {
    // Check cache
    const cacheKey = `steam:search:${query}:${limit}`;
    const cached = await cache.get<SteamGame[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Note: Steam doesn't have a direct search API
      // This would need to use Steam Store search or SteamSpy API
      // For now, return empty - games should be populated manually or via import
      console.warn("Steam search not fully implemented - use game import instead");
      return [];
    } catch (error) {
      console.error("Steam search error:", error);
      return [];
    }
  }

  /**
   * Get game details by Steam App ID
   */
  async getGameDetails(appId: string): Promise<SteamGameDetails | null> {
    // Check cache
    const cacheKey = `steam:game:${appId}`;
    const cached = await cache.get<SteamGameDetails>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/appdetails?appids=${appId}&l=english`
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json() as Record<string, any>;
      const gameData = data[appId];

      if (!gameData || !gameData.success) {
        return null;
      }

      const game = gameData.data;

      // Cache for 24 hours
      await cache.set(cacheKey, game, 86400);

      return game;
    } catch (error) {
      console.error(`Steam getGameDetails error for ${appId}:`, error);
      return null;
    }
  }

  /**
   * Get multiple game details
   */
  async getMultipleGameDetails(
    appIds: string[]
  ): Promise<SteamGameDetails[]> {
    const games = await Promise.all(
      appIds.map((id) => this.getGameDetails(id))
    );
    return games.filter((game): game is SteamGameDetails => game !== null);
  }
}

// Export singleton instance
export const steamService = new SteamService();

