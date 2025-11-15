/**
 * Game Controller
 * Handles game-related API requests
 */

import { Request, Response } from "express";
import { pool } from "../config/database";
import { importGameFromSteam, batchImportGames } from "../services/game-import.service";
import { getSimilarToGame } from "../services/recommendation.service";
import { transformGame, transformGames } from "../utils/game-transform";
import { cache } from "../config/redis";
import { z } from "zod";

/**
 * GET /api/games/:id
 * Get game by ID
 */
export async function getGame(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT 
        id, name, description, short_description,
        header_image, capsule_image, release_date, price,
        steam_url, soul_score, emotion_profile, genres, tags
      FROM games
      WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Game not found" });
    }

    return res.json({ game: transformGame(result.rows[0]) });
  } catch (error) {
    console.error("Error getting game:", error);
    return res.status(500).json({
      error: "Failed to get game",
    });
  }
}

/**
 * GET /api/games
 * Get all games with pagination
 */
export async function getAllGames(req: Request, res: Response) {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    const sortBy = (req.query.sortBy as string) || "soul_score";
    const order = (req.query.order as string) || "DESC";

    // Create cache key
    const cacheKey = `games:all:${limit}:${offset}:${sortBy}:${order}`;
    
    // Check cache (cache for 30 minutes)
    const cached = await cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Validate sortBy to prevent SQL injection
    const allowedSorts = ["soul_score", "name", "release_date", "price", "created_at"];
    const sortColumn = allowedSorts.includes(sortBy) ? sortBy : "soul_score";
    const sortOrder = order.toUpperCase() === "ASC" ? "ASC" : "DESC";

    // Get total count
    const countResult = await pool.query("SELECT COUNT(*) as total FROM games");
    const total = parseInt(countResult.rows[0].total);

    // Get games
    const result = await pool.query(
      `SELECT 
        id, name, description, short_description,
        header_image, capsule_image, release_date, price,
        steam_url, soul_score, emotion_profile, genres, tags,
        created_at
      FROM games
      ORDER BY ${sortColumn} ${sortOrder}
      LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const response = {
      games: transformGames(result.rows),
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    };

    // Cache response for 30 minutes
    await cache.set(cacheKey, response, 1800);

    return res.json(response);
  } catch (error) {
    console.error("Error getting all games:", error);
    return res.status(500).json({
      error: "Failed to get games",
    });
  }
}

/**
 * GET /api/games/:id/similar
 * Get similar games
 */
export async function getSimilar(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;

    const matches = await getSimilarToGame(id, limit);

    return res.json({ games: matches.map((m) => transformGame(m.game)) });
  } catch (error) {
    console.error("Error getting similar games:", error);
    return res.status(500).json({
      error: "Failed to get similar games",
    });
  }
}

/**
 * POST /api/games/import
 * Import game from Steam
 */
export async function importGame(req: Request, res: Response) {
  try {
    const { steamAppId } = z
      .object({
        steamAppId: z.string(),
      })
      .parse(req.body);

    await importGameFromSteam(steamAppId);

    return res.status(201).json({
      message: "Game imported successfully",
      gameId: steamAppId,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: error.issues,
      });
    }

    console.error("Error importing game:", error);
    return res.status(500).json({
      error: "Failed to import game",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

/**
 * POST /api/games/import/batch
 * Batch import games
 */
export async function batchImport(req: Request, res: Response) {
  try {
    const { steamAppIds } = z
      .object({
        steamAppIds: z.array(z.string()).min(1).max(100),
      })
      .parse(req.body);

    const results = await batchImportGames(steamAppIds);

    return res.json(results);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: error.issues,
      });
    }

    console.error("Error batch importing games:", error);
    return res.status(500).json({
      error: "Failed to batch import games",
    });
  }
}

