/**
 * TasteRay API Service
 * Integrates with TasteRay recommendation engine API
 * Note: This is a recommendation engine, not a game catalog.
 * Game data should come from Steam API or manual entry.
 */

import { env } from "../config/env";
import { cache } from "../config/redis";

export interface TasteRayRecommendation {
  item: {
    name: string;
    vertical: string;
    type: string;
    metadata: Record<string, any>;
  };
  explanation: {
    why_match: string;
    key_factors: string[];
    potential_concerns: string[];
  };
  confidence: number;
  metadata: Record<string, any>;
}

export interface TasteRayRecommendationRequest {
  vertical: string;
  context: {
    preferences: string[];
    constraints?: Record<string, any>;
    history?: Array<{
      item: string;
      rating: string;
      metadata?: Record<string, any>;
    }>;
  };
  items?: Array<{
    id: string;
    name: string;
    description?: string;
    metadata?: Record<string, any>;
  }>;
  options?: {
    count?: number;
    streaming?: boolean;
    include_alternatives?: boolean;
    explanation_depth?: "brief" | "detailed";
  };
}

/**
 * TasteRay API Service Class
 */
export class TasteRayService {
  private baseUrl = "https://api.tasteray.com";
  private apiKey: string | null;

  constructor() {
    this.apiKey = env.TASTERAY_API_KEY || null;
  }

  /**
   * Get recommendations using TasteRay API
   * This can be used to get game recommendations based on user preferences
   */
  async getRecommendations(
    preferences: string[],
    constraints?: Record<string, any>,
    gameItems?: Array<{
      id: string;
      name: string;
      description?: string;
      metadata?: Record<string, any>;
    }>
  ): Promise<TasteRayRecommendation[]> {
    if (!this.apiKey) {
      console.warn("TasteRay API key not configured");
      return [];
    }

    // Check cache
    const cacheKey = `tasteray:recommend:${JSON.stringify({ preferences, constraints })}`;
    const cached = await cache.get<TasteRayRecommendation[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const requestBody: TasteRayRecommendationRequest = {
        vertical: "entertainment",
        context: {
          preferences,
          constraints: constraints || {},
        },
        options: {
          count: 10,
          explanation_depth: "detailed",
          include_alternatives: true,
        },
      };

      // If specific games provided, include them
      if (gameItems && gameItems.length > 0) {
        requestBody.items = gameItems;
      }

      const response = await this.makeRequest("/v1/recommend", {
        method: "POST",
        body: JSON.stringify(requestBody),
      });

      const recommendations = response.recommendations || [];

      // Cache for 1 hour
      await cache.set(cacheKey, recommendations, 3600);

      return recommendations;
    } catch (error) {
      console.error("TasteRay recommendation error:", error);
      return [];
    }
  }

  /**
   * Get explanation for why a game matches
   */
  async explainMatch(
    gameName: string,
    userPreferences: string[]
  ): Promise<{
    explanation: {
      summary: string;
      detailed_reasoning: {
        taste_alignment: string[];
        constraint_satisfaction: string[];
        unique_factors: string[];
      };
      potential_concerns: string[];
    };
    confidence: number;
  } | null> {
    if (!this.apiKey) {
      return null;
    }

    try {
      const response = await this.makeRequest("/v1/explain", {
        method: "POST",
        body: JSON.stringify({
          vertical: "entertainment",
          item: {
            name: gameName,
            type: "game",
          },
          context: {
            user_preferences: userPreferences,
          },
          options: {
            depth: "detailed",
          },
        }),
      });

      return {
        explanation: response.explanation,
        confidence: response.confidence,
      };
    } catch (error) {
      console.error("TasteRay explain error:", error);
      return null;
    }
  }

  /**
   * Check API health
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await this.makeRequest("/v1/health", {
        method: "GET",
      });
      return response.status === "healthy";
    } catch (error) {
      return false;
    }
  }

  /**
   * Get usage statistics
   */
  async getUsage(): Promise<{
    usage: {
      requests_made: number;
      requests_limit: number;
      requests_remaining: number;
      percentage_used: number;
    };
    tier: {
      name: string;
      rate_limit: string;
    };
  } | null> {
    if (!this.apiKey) {
      return null;
    }

    try {
      const response = await this.makeRequest("/v1/usage", {
        method: "GET",
      });
      return response;
    } catch (error) {
      console.error("TasteRay usage error:", error);
      return null;
    }
  }

  /**
   * Make HTTP request to TasteRay API
   */
  private async makeRequest(
    endpoint: string,
    options: {
      method?: string;
      body?: string;
    } = {}
  ): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.apiKey) {
      headers["X-API-Key"] = this.apiKey;
    }

    const response = await fetch(url, {
      method: options.method || "GET",
      headers,
      body: options.body,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Invalid TasteRay API key");
      }
      if (response.status === 429) {
        const retryAfter = response.headers.get("retry-after");
        throw new Error(
          `Rate limit exceeded. Retry after ${retryAfter} seconds`
        );
      }
      const errorData = await response.json().catch(() => ({})) as { error?: { message?: string } };
      throw new Error(
        errorData.error?.message || `TasteRay API error: ${response.status}`
      );
    }

    return response.json();
  }
}

// Export singleton instance
export const tasterayService = new TasteRayService();
