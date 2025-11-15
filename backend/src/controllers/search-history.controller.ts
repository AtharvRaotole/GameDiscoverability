/**
 * Search History Controller
 * Handles search history API requests
 */

import { Request, Response } from "express";
import {
  saveSearch,
  getUserSearchHistory,
  deleteSearch,
  clearSearchHistory,
} from "../services/search-history.service";
import { z } from "zod";

/**
 * POST /api/search-history
 * Save search to history
 */
export async function save(req: Request, res: Response) {
  try {
    const { userId, queryText, emotionVector, extractedEmotions } = z
      .object({
        userId: z.string(),
        queryText: z.string(),
        emotionVector: z.array(z.number()).optional(),
        extractedEmotions: z.any().optional(),
      })
      .parse(req.body);

    const entry = await saveSearch(userId, queryText, emotionVector, extractedEmotions);
    return res.status(201).json({ entry });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: error.issues,
      });
    }

    console.error("Error saving search:", error);
    return res.status(500).json({
      error: "Failed to save search",
    });
  }
}

/**
 * GET /api/search-history/:userId
 * Get user search history
 */
export async function getHistory(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit as string) || 20;

    if (!userId) {
      return res.status(400).json({ error: "User ID required" });
    }

    const history = await getUserSearchHistory(userId, limit);
    return res.json({ history });
  } catch (error) {
    console.error("Error getting search history:", error);
    return res.status(500).json({
      error: "Failed to get search history",
    });
  }
}

/**
 * DELETE /api/search-history/:userId/:searchId
 * Delete search from history
 */
export async function deleteEntry(req: Request, res: Response) {
  try {
    const { userId, searchId } = req.params;

    await deleteSearch(userId, searchId);
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting search:", error);
    return res.status(500).json({
      error: "Failed to delete search",
    });
  }
}

/**
 * DELETE /api/search-history/:userId
 * Clear all search history
 */
export async function clear(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    await clearSearchHistory(userId);
    return res.status(204).send();
  } catch (error) {
    console.error("Error clearing search history:", error);
    return res.status(500).json({
      error: "Failed to clear search history",
    });
  }
}

