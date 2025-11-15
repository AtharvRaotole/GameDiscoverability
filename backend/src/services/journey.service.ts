/**
 * Journey Service
 * Handles emotional journey creation, retrieval, and management
 */

import { pool } from "../config/database";
import type { EmotionProfile } from "./emotion-analysis.service";

export interface Journey {
  id: string;
  title: string;
  description: string;
  games: Array<{
    gameId: string;
    order: number;
    emotionState?: EmotionProfile;
  }>;
  emotionalArc: EmotionalArc;
  totalHours: number;
  createdBy?: string;
  isCurated: boolean;
  createdAt: string;
}

export interface EmotionalArc {
  emotions: EmotionProfile[];
  transitions: Array<{
    from: number;
    to: number;
    emotion: keyof EmotionProfile;
    intensity: number;
  }>;
}

export interface JourneyCreationData {
  title: string;
  description: string;
  gameIds: string[];
  userId?: string;
  isCurated?: boolean;
}

/**
 * Create a new journey
 */
export async function createJourney(
  data: JourneyCreationData
): Promise<Journey> {
  const { title, description, gameIds, userId, isCurated = false } = data;

  // Validate all game IDs exist
  const gameIdsPlaceholder = gameIds.map((_, i) => `$${i + 1}`).join(",");
  const gamesResult = await pool.query(
    `SELECT id, name, estimated_hours, emotion_profile FROM games WHERE id IN (${gameIdsPlaceholder})`,
    gameIds
  );

  if (gamesResult.rows.length !== gameIds.length) {
    throw new Error("Some game IDs are invalid");
  }

  const games = gamesResult.rows;

  // Calculate emotional arc
  const emotionalArc = await getEmotionalArc(gameIds);

  // Calculate total hours
  const totalHours = games.reduce(
    (sum, game) => sum + (game.estimated_hours || 6),
    0
  );

  // Create game sequence
  const gameSequence = gameIds.map((gameId, index) => ({
    gameId,
    order: index + 1,
    emotionState: games.find((g) => g.id === gameId)?.emotion_profile,
  }));

  // Insert journey
  const result = await pool.query(
    `INSERT INTO journeys (title, description, game_sequence, emotional_arc, created_by, is_curated)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, created_at`,
    [
      title,
      description,
      JSON.stringify(gameSequence),
      JSON.stringify(emotionalArc),
      userId || null,
      isCurated,
    ]
  );

  const journeyId = result.rows[0].id;

  return {
    id: journeyId,
    title,
    description,
    games: gameSequence,
    emotionalArc,
    totalHours,
    createdBy: userId,
    isCurated,
    createdAt: result.rows[0].created_at,
  };
}

/**
 * Get emotional arc from game sequence
 */
export async function getEmotionalArc(
  gameIds: string[]
): Promise<EmotionalArc> {
  const placeholders = gameIds.map((_, i) => `$${i + 1}`).join(",");
  const result = await pool.query(
    `SELECT id, emotion_profile FROM games WHERE id IN (${placeholders}) ORDER BY array_position(ARRAY[${placeholders}], id)`,
    [...gameIds, ...gameIds]
  );

  const emotions: EmotionProfile[] = result.rows.map((row) =>
    row.emotion_profile || getNeutralEmotionProfile()
  );

  // Calculate transitions
  const transitions = [];
  for (let i = 0; i < emotions.length - 1; i++) {
    const from = emotions[i];
    const to = emotions[i + 1];

    // Find the emotion with biggest change
    const emotionKeys: (keyof EmotionProfile)[] = [
      "joy",
      "melancholy",
      "tension",
      "wonder",
      "nostalgia",
      "catharsis",
      "comfort",
      "challenge",
    ];

    let maxChange = 0;
    let maxEmotion: keyof EmotionProfile = "joy";

    for (const key of emotionKeys) {
      const change = Math.abs(to[key] - from[key]);
      if (change > maxChange) {
        maxChange = change;
        maxEmotion = key;
      }
    }

    transitions.push({
      from: i,
      to: i + 1,
      emotion: maxEmotion,
      intensity: maxChange,
    });
  }

  return { emotions, transitions };
}

/**
 * Get curated journeys
 */
export async function getCuratedJourneys(): Promise<Journey[]> {
  const result = await pool.query(
    `SELECT 
      j.id, j.title, j.description, j.game_sequence, j.emotional_arc,
      j.is_curated, j.created_at,
      jsonb_array_length(j.game_sequence) as game_count
     FROM journeys j
     WHERE j.is_curated = true
     ORDER BY j.created_at DESC`
  );

  // Fetch full game data for each journey
  const journeysWithGames = await Promise.all(
    result.rows.map(async (row) => {
      const gameSequence = row.game_sequence || [];
      const gameIds = gameSequence.map((g: any) => g.gameId);

      // Fetch game details
      let gamesWithDetails = [];
      if (gameIds.length > 0) {
        const gamesResult = await pool.query(
          `SELECT id, name, header_image, capsule_image, soul_score, price
           FROM games 
           WHERE id = ANY($1::text[])`,
          [gameIds]
        );

        const gamesMap = new Map(gamesResult.rows.map((g: any) => [g.id, g]));

        gamesWithDetails = gameSequence.map((seq: any) => {
          const game = gamesMap.get(seq.gameId);
          return {
            gameId: seq.gameId,
            order: seq.order,
            name: game?.name,
            headerImage: game?.header_image,
            capsuleImage: game?.capsule_image,
            soulScore: game?.soul_score,
            price: game?.price,
          };
        });
      }

      const totalHours = gamesWithDetails.reduce(
        (sum: number, g: any) => sum + (g.estimatedHours || 6),
        0
      );

      return {
        id: row.id,
        title: row.title,
        description: row.description,
        games: gamesWithDetails,
        emotionalArc: row.emotional_arc || { emotions: [], transitions: [] },
        totalHours,
        isCurated: row.is_curated,
        createdAt: row.created_at,
      };
    })
  );

  return journeysWithGames;
}

/**
 * Get user journeys
 */
export async function getUserJourneys(userId: string): Promise<Journey[]> {
  const result = await pool.query(
    `SELECT 
      j.id, j.title, j.description, j.game_sequence, j.emotional_arc,
      j.created_by, j.is_curated, j.created_at
     FROM journeys j
     WHERE j.created_by = $1
     ORDER BY j.created_at DESC`,
    [userId]
  );

  // Fetch full game data for each journey
  const journeysWithGames = await Promise.all(
    result.rows.map(async (row) => {
      const gameSequence = row.game_sequence || [];
      const gameIds = gameSequence.map((g: any) => g.gameId);

      // Fetch game details
      let gamesWithDetails = [];
      if (gameIds.length > 0) {
        const gamesResult = await pool.query(
          `SELECT id, name, header_image, capsule_image, soul_score, price
           FROM games 
           WHERE id = ANY($1::text[])`,
          [gameIds]
        );

        const gamesMap = new Map(gamesResult.rows.map((g: any) => [g.id, g]));

        gamesWithDetails = gameSequence.map((seq: any) => {
          const game = gamesMap.get(seq.gameId);
          return {
            gameId: seq.gameId,
            order: seq.order,
            name: game?.name,
            headerImage: game?.header_image,
            capsuleImage: game?.capsule_image,
            soulScore: game?.soul_score,
            price: game?.price,
          };
        });
      }

      const totalHours = gamesWithDetails.reduce(
        (sum: number, g: any) => sum + (g.estimatedHours || 6),
        0
      );

      return {
        id: row.id,
        title: row.title,
        description: row.description,
        games: gamesWithDetails,
        emotionalArc: row.emotional_arc || { emotions: [], transitions: [] },
        totalHours,
        createdBy: row.created_by,
        isCurated: row.is_curated,
        createdAt: row.created_at,
      };
    })
  );

  return journeysWithGames;
}

/**
 * Get journey by ID
 */
export async function getJourneyById(journeyId: string): Promise<Journey | null> {
  const result = await pool.query(
    `SELECT 
      j.id, j.title, j.description, j.game_sequence, j.emotional_arc,
      j.created_by, j.is_curated, j.created_at
     FROM journeys j
     WHERE j.id = $1`,
    [journeyId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  const games = row.game_sequence || [];
  const totalHours = games.reduce(
    (sum: number, g: any) => sum + (g.estimatedHours || 6),
    0
  );

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    games: games,
    emotionalArc: row.emotional_arc || { emotions: [], transitions: [] },
    totalHours,
    createdBy: row.created_by,
    isCurated: row.is_curated,
    createdAt: row.created_at,
  };
}

/**
 * Fork a journey (create a copy)
 */
export async function forkJourney(
  journeyId: string,
  userId: string,
  modifications?: {
    title?: string;
    description?: string;
    gameIds?: string[];
  }
): Promise<Journey> {
  const original = await getJourneyById(journeyId);
  if (!original) {
    throw new Error("Journey not found");
  }

  const gameIds = modifications?.gameIds || original.games.map((g) => g.gameId);
  const title = modifications?.title || `${original.title} (Fork)`;
  const description = modifications?.description || original.description;

  return createJourney({
    title,
    description,
    gameIds,
    userId,
    isCurated: false,
  });
}

/**
 * Get neutral emotion profile
 */
function getNeutralEmotionProfile(): EmotionProfile {
  return {
    joy: 0.5,
    melancholy: 0.5,
    tension: 0.5,
    wonder: 0.5,
    nostalgia: 0.5,
    catharsis: 0.5,
    comfort: 0.5,
    challenge: 0.5,
  };
}

