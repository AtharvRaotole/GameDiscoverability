/**
 * Journey Controller
 * Handles journey-related API requests
 */

import { Request, Response } from "express";
import {
  createJourney,
  getCuratedJourneys,
  getUserJourneys,
  getJourneyById,
  forkJourney,
  type JourneyCreationData,
} from "../services/journey.service";
import { cache } from "../config/redis";
import { z } from "zod";

const createJourneySchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  gameIds: z.array(z.string()).min(2).max(20),
});

/**
 * GET /api/journeys/curated
 * Get all curated journeys
 */
export async function getCurated(_req: Request, res: Response) {
  try {
    // Check cache (cache for 1 hour)
    const cacheKey = "journeys:curated";
    const cached = await cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const journeys = await getCuratedJourneys();
    const response = { journeys };
    
    // Cache for 1 hour
    await cache.set(cacheKey, response, 3600);
    
    return res.json(response);
  } catch (error) {
    console.error("Error getting curated journeys:", error);
    return res.status(500).json({
      error: "Failed to get curated journeys",
    });
  }
}

/**
 * GET /api/journeys/user/:userId
 * Get user's journeys
 */
export async function getUser(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "User ID required" });
    }

    const journeys = await getUserJourneys(userId);
    return res.json({ journeys });
  } catch (error) {
    console.error("Error getting user journeys:", error);
    return res.status(500).json({
      error: "Failed to get user journeys",
    });
  }
}

/**
 * GET /api/journeys/:id
 * Get journey by ID
 */
export async function getById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const journey = await getJourneyById(id);

    if (!journey) {
      return res.status(404).json({ error: "Journey not found" });
    }

    return res.json({ journey });
  } catch (error) {
    console.error("Error getting journey:", error);
    return res.status(500).json({
      error: "Failed to get journey",
    });
  }
}

/**
 * POST /api/journeys
 * Create a new journey
 */
export async function create(req: Request, res: Response) {
  try {
    const body = createJourneySchema.parse(req.body);
    const userId = req.body.userId as string | undefined; // TODO: Get from auth

    const data: JourneyCreationData = {
      title: body.title,
      description: body.description || "",
      gameIds: body.gameIds,
      userId: userId || undefined,
      isCurated: false,
    };

    const journey = await createJourney(data);
    return res.status(201).json({ journey });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: error.issues,
      });
    }

    console.error("Error creating journey:", error);
    return res.status(500).json({
      error: "Failed to create journey",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

/**
 * POST /api/journeys/:id/fork
 * Fork a journey
 */
export async function fork(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.body.userId; // TODO: Get from auth
    const modifications = req.body.modifications || {};

    if (!userId || typeof userId !== "string") {
      return res.status(401).json({ error: "Authentication required" });
    }

    const journey = await forkJourney(id, userId, modifications);
    return res.status(201).json({ journey });
  } catch (error) {
    console.error("Error forking journey:", error);
    return res.status(500).json({
      error: "Failed to fork journey",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

