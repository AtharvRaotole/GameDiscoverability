/**
 * API client for GameSoul backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || "An error occurred",
        response.status,
        errorData
      );
    }

    return response.json();
  } catch (error) {
    // Re-throw ApiError as-is
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle network errors - catch all fetch failures
    const isNetworkError = 
      error instanceof TypeError ||
      (error instanceof Error && (
        error.message.includes('fetch') ||
        error.message.includes('Failed to fetch') ||
        error.message.includes('NetworkError') ||
        error.message.includes('network') ||
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('ERR_CONNECTION_REFUSED')
      ));
    
    if (isNetworkError) {
      throw new ApiError(
        `Failed to connect to backend. Is the server running at ${API_BASE_URL}?`,
        0,
        { 
          originalError: error instanceof Error ? error.message : String(error),
          url,
          endpoint
        }
      );
    }
    
    // Wrap other errors
    throw new ApiError(
      error instanceof Error ? error.message : "An unexpected error occurred",
      0,
      { originalError: error }
    );
  }
}

export const api = {
  /**
   * Discover games based on emotional query
   */
  discover: async (query: string, options?: {
    limit?: number;
    offset?: number;
    filters?: Record<string, unknown>;
  }) => {
    return fetchApi<{
      emotionVector: {
        embedding: number[];
        emotions: Record<string, number>;
      };
      results: Array<{
        game: unknown;
        matchScore: number;
        soulScore: number;
        emotionAlignment: number;
      }>;
      total: number;
      hasMore: boolean;
    }>("/api/discover", {
      method: "POST",
      body: JSON.stringify({ query, ...options }),
    });
  },

  /**
   * Get all games
   */
  getAllGames: async (options?: {
    limit?: number;
    offset?: number;
    sortBy?: string;
    order?: "ASC" | "DESC";
  }) => {
    const params = new URLSearchParams();
    if (options?.limit) params.append("limit", options.limit.toString());
    if (options?.offset) params.append("offset", options.offset.toString());
    if (options?.sortBy) params.append("sortBy", options.sortBy);
    if (options?.order) params.append("order", options.order);
    
    const query = params.toString();
    return fetchApi<{
      games: unknown[];
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    }>(`/api/games${query ? `?${query}` : ""}`);
  },

  /**
   * Get game details
   */
  getGame: async (gameId: string) => {
    return fetchApi<{ game: unknown }>(`/api/games/${gameId}`);
  },

  /**
   * Get similar games
   */
  getSimilarGames: async (gameId: string, limit = 10) => {
    return fetchApi<unknown[]>(`/api/games/${gameId}/similar?limit=${limit}`);
  },

  /**
   * Extract emotions from text (real-time)
   */
  extractEmotions: async (text: string) => {
    return fetchApi<Array<{
      word: string;
      intensity: number;
      category: string;
    }>>("/api/emotions/extract", {
      method: "POST",
      body: JSON.stringify({ text }),
    });
  },

  /**
   * Get curated journeys
   */
  getCuratedJourneys: async () => {
    return fetchApi<{ journeys: unknown[] }>("/api/journeys/curated");
  },

  /**
   * Get user journeys
   */
  getUserJourneys: async (userId: string) => {
    return fetchApi<{ journeys: unknown[] }>(`/api/journeys/user/${userId}`);
  },

  /**
   * Get journey by ID
   */
  getJourney: async (journeyId: string) => {
    return fetchApi<{ journey: unknown }>(`/api/journeys/${journeyId}`);
  },

  /**
   * Fork a journey
   */
  forkJourney: async (journeyId: string, modifications?: {
    title?: string;
    description?: string;
    gameIds?: string[];
  }) => {
    return fetchApi<{ journey: unknown }>(`/api/journeys/${journeyId}/fork`, {
      method: "POST",
      body: JSON.stringify({ modifications }),
    });
  },

  /**
   * Library endpoints
   */
  getLibrary: async (userId: string, status?: string) => {
    const url = status
      ? `/api/library/${userId}?status=${status}`
      : `/api/library/${userId}`;
    return fetchApi<{ library: unknown[] }>(url);
  },

  addToLibrary: async (userId: string, gameId: string, status: "playing" | "completed" | "wishlist") => {
    return fetchApi<{ entry: unknown }>("/api/library", {
      method: "POST",
      body: JSON.stringify({ userId, gameId, status }),
    });
  },

  updateLibraryStatus: async (userId: string, gameId: string, status: "playing" | "completed" | "wishlist") => {
    return fetchApi<{ entry: unknown }>(`/api/library/${userId}/${gameId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  removeFromLibrary: async (userId: string, gameId: string) => {
    return fetchApi(`/api/library/${userId}/${gameId}`, {
      method: "DELETE",
    });
  },

  getLibraryStats: async (userId: string) => {
    return fetchApi<{ stats: { total: number; playing: number; completed: number; wishlist: number } }>(
      `/api/library/${userId}/stats`
    );
  },

  getEmotionalTimeline: async (userId: string) => {
    return fetchApi<{ timeline: unknown[] }>(`/api/library/${userId}/timeline`);
  },

  /**
   * Search history endpoints
   */
  getSearchHistory: async (userId: string, limit = 20) => {
    return fetchApi<{ history: unknown[] }>(`/api/search-history/${userId}?limit=${limit}`);
  },

  saveSearch: async (userId: string, queryText: string, emotionVector?: number[], extractedEmotions?: unknown) => {
    return fetchApi<{ entry: unknown }>("/api/search-history", {
      method: "POST",
      body: JSON.stringify({ userId, queryText, emotionVector, extractedEmotions }),
    });
  },

  deleteSearch: async (userId: string, searchId: string) => {
    return fetchApi(`/api/search-history/${userId}/${searchId}`, {
      method: "DELETE",
    });
  },

  clearSearchHistory: async (userId: string) => {
    return fetchApi(`/api/search-history/${userId}`, {
      method: "DELETE",
    });
  },
};

