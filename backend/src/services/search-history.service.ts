/**
 * Search History Service
 * Tracks user emotional searches
 */

import { pool } from "../config/database";

export interface SearchHistoryEntry {
  id: string;
  userId: string;
  queryText: string;
  emotionVector?: number[];
  extractedEmotions?: any;
  createdAt: string;
}

/**
 * Save search to history
 */
export async function saveSearch(
  userId: string,
  queryText: string,
  emotionVector?: number[],
  extractedEmotions?: any
): Promise<SearchHistoryEntry> {
  const result = await pool.query(
    `INSERT INTO emotional_searches (user_id, query_text, emotion_vector, extracted_emotions)
     VALUES ($1, $2, $3, $4)
     RETURNING id, user_id, query_text, emotion_vector, extracted_emotions, created_at`,
    [userId, queryText, emotionVector || null, extractedEmotions || null]
  );

  return {
    id: result.rows[0].id,
    userId: result.rows[0].user_id,
    queryText: result.rows[0].query_text,
    emotionVector: result.rows[0].emotion_vector,
    extractedEmotions: result.rows[0].extracted_emotions,
    createdAt: result.rows[0].created_at,
  };
}

/**
 * Get user search history
 */
export async function getUserSearchHistory(
  userId: string,
  limit = 20
): Promise<SearchHistoryEntry[]> {
  const result = await pool.query(
    `SELECT id, user_id, query_text, emotion_vector, extracted_emotions, created_at
     FROM emotional_searches
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [userId, limit]
  );

  return result.rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    queryText: row.query_text,
    emotionVector: row.emotion_vector,
    extractedEmotions: row.extracted_emotions,
    createdAt: row.created_at,
  }));
}

/**
 * Delete search from history
 */
export async function deleteSearch(
  userId: string,
  searchId: string
): Promise<void> {
  await pool.query(
    "DELETE FROM emotional_searches WHERE id = $1 AND user_id = $2",
    [searchId, userId]
  );
}

/**
 * Clear all search history
 */
export async function clearSearchHistory(userId: string): Promise<void> {
  await pool.query("DELETE FROM emotional_searches WHERE user_id = $1", [
    userId,
  ]);
}

