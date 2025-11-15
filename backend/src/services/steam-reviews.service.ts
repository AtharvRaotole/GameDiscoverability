/**
 * Steam Reviews Service
 * Fetches review statistics from Steam Store API
 */

import { cache } from "../config/redis";

export interface SteamReviewSummary {
  success: number;
  query_summary: {
    num_reviews: number;
    review_score: number; // 0-100
    review_score_desc: string; // "Very Positive", "Overwhelmingly Positive", etc.
    total_positive: number;
    total_negative: number;
    total_reviews: number;
  };
}

/**
 * Get review summary for a Steam game
 */
export async function getSteamReviewSummary(appId: string): Promise<SteamReviewSummary | null> {
  // Check cache
  const cacheKey = `steam:reviews:${appId}`;
  const cached = await cache.get<SteamReviewSummary>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(
      `https://store.steampowered.com/appreviews/${appId}?json=1&language=all&purchase_type=all&num_per_page=0`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json() as SteamReviewSummary;

    if (!data.success || !data.query_summary) {
      return null;
    }

    // Cache for 24 hours
    await cache.set(cacheKey, data, 86400);

    return data;
  } catch (error) {
    console.error(`Steam review summary error for ${appId}:`, error);
    return null;
  }
}

