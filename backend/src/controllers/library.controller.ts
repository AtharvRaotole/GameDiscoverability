/**
 * Library Controller
 * Handles library-related API requests
 */

import { Request, Response } from "express";
import {
  addToLibrary,
  getUserLibrary,
  updateLibraryStatus,
  removeFromLibrary,
  getLibraryStats,
  getEmotionalTimeline,
  type LibraryStatus,
} from "../services/library.service";
import { z } from "zod";

const libraryStatusSchema = z.enum(["playing", "completed", "wishlist"]);

/**
 * GET /api/library/:userId
 * Get user library
 */
export async function getLibrary(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const status = req.query.status as LibraryStatus | undefined;

    if (!userId) {
      return res.status(400).json({ error: "User ID required" });
    }

    const library = await getUserLibrary(userId, status);
    return res.json({ library });
  } catch (error) {
    console.error("Error getting library:", error);
    return res.status(500).json({
      error: "Failed to get library",
    });
  }
}

/**
 * POST /api/library
 * Add game to library
 */
export async function addGame(req: Request, res: Response) {
  try {
    const { userId, gameId, status } = z
      .object({
        userId: z.string(),
        gameId: z.string(),
        status: libraryStatusSchema,
      })
      .parse(req.body);

    const entry = await addToLibrary(userId, gameId, status);
    return res.status(201).json({ entry });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: error.issues,
      });
    }

    console.error("Error adding to library:", error);
    return res.status(500).json({
      error: "Failed to add to library",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

/**
 * PATCH /api/library/:userId/:gameId
 * Update library entry status
 */
export async function updateStatus(req: Request, res: Response) {
  try {
    const { userId, gameId } = req.params;
    const { status } = z
      .object({
        status: libraryStatusSchema,
      })
      .parse(req.body);

    const entry = await updateLibraryStatus(userId, gameId, status);
    return res.json({ entry });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: error.issues,
      });
    }

    console.error("Error updating library:", error);
    return res.status(500).json({
      error: "Failed to update library",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

/**
 * DELETE /api/library/:userId/:gameId
 * Remove game from library
 */
export async function removeGame(req: Request, res: Response) {
  try {
    const { userId, gameId } = req.params;

    await removeFromLibrary(userId, gameId);
    return res.status(204).send();
  } catch (error) {
    console.error("Error removing from library:", error);
    return res.status(500).json({
      error: "Failed to remove from library",
    });
  }
}

/**
 * GET /api/library/:userId/stats
 * Get library statistics
 */
export async function getStats(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID required" });
    }

    const stats = await getLibraryStats(userId);
    return res.json({ stats });
  } catch (error) {
    console.error("Error getting library stats:", error);
    return res.status(500).json({
      error: "Failed to get library stats",
    });
  }
}

/**
 * GET /api/library/:userId/timeline
 * Get emotional timeline
 */
export async function getTimeline(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID required" });
    }

    const timeline = await getEmotionalTimeline(userId);
    return res.json({ timeline });
  } catch (error) {
    console.error("Error getting timeline:", error);
    return res.status(500).json({
      error: "Failed to get timeline",
    });
  }
}

