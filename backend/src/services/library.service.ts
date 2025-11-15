/**
 * Library Service
 * Handles user game library management
 */

import { pool } from "../config/database";

export type LibraryStatus = "playing" | "completed" | "wishlist";

export interface LibraryEntry {
  id: string;
  userId: string;
  gameId: string;
  status: LibraryStatus;
  addedAt: string;
  game?: any;
}

/**
 * Ensure user exists in database (creates if doesn't exist)
 * This is a temporary workaround until proper authentication is implemented
 */
async function ensureUserExists(userId: string): Promise<void> {
  try {
    // Check if user exists
    const userCheck = await pool.query("SELECT id FROM users WHERE id = $1", [userId]);
    
    if (userCheck.rows.length === 0) {
      // Create a minimal user record
      // Using UUID-based values to ensure uniqueness
      // Replace hyphens with a shorter identifier for username
      const usernameBase = userId.replace(/-/g, '').substring(0, 12);
      await pool.query(
        `INSERT INTO users (id, email, username)
         VALUES ($1, $2, $3)
         ON CONFLICT (id) DO NOTHING`,
        [userId, `${userId}@gamesoul.local`, `user-${usernameBase}`]
      );
    }
  } catch (error: any) {
    // If there's a unique constraint violation on email/username, try with a different username
    if (error?.code === '23505' && error?.constraint?.includes('username')) {
      // Retry with a more unique username
      try {
        const usernameBase = userId.replace(/-/g, '').substring(0, 16);
        await pool.query(
          `INSERT INTO users (id, email, username)
           VALUES ($1, $2, $3)
           ON CONFLICT (id) DO NOTHING`,
          [userId, `${userId}@gamesoul.local`, `user-${usernameBase}-${Date.now().toString().slice(-6)}`]
        );
      } catch (retryError) {
        // If still fails, user might already exist from another operation
        console.warn("Error ensuring user exists (retry):", retryError);
      }
    } else {
      console.warn("Error ensuring user exists:", error);
    }
  }
}

/**
 * Add game to user library
 */
export async function addToLibrary(
  userId: string,
  gameId: string,
  status: LibraryStatus
): Promise<LibraryEntry> {
  // Ensure user exists in database
  await ensureUserExists(userId);

  // Check if game exists
  const gameCheck = await pool.query("SELECT id FROM games WHERE id = $1", [
    gameId,
  ]);
  if (gameCheck.rows.length === 0) {
    throw new Error("Game not found");
  }

  // Upsert library entry
  const result = await pool.query(
    `INSERT INTO user_libraries (user_id, game_id, status)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, game_id)
     DO UPDATE SET status = $3, added_at = NOW()
     RETURNING id, user_id, game_id, status, added_at`,
    [userId, gameId, status]
  );

  return {
    id: result.rows[0].id,
    userId: result.rows[0].user_id,
    gameId: result.rows[0].game_id,
    status: result.rows[0].status,
    addedAt: result.rows[0].added_at,
  };
}

/**
 * Get user library
 */
export async function getUserLibrary(
  userId: string,
  status?: LibraryStatus
): Promise<LibraryEntry[]> {
  // Ensure user exists (for new users, this will create them)
  await ensureUserExists(userId);

  let query = `
    SELECT 
      ul.id, ul.user_id, ul.game_id, ul.status, ul.added_at,
      g.id as game_id, g.name, g.description, g.short_description,
      g.header_image, g.capsule_image, g.soul_score, g.price, 
      g.release_date, g.emotion_profile, g.genres, g.tags
    FROM user_libraries ul
    JOIN games g ON ul.game_id = g.id
    WHERE ul.user_id = $1
  `;
  const params: any[] = [userId];

  if (status) {
    query += " AND ul.status = $2";
    params.push(status);
  }

  query += " ORDER BY ul.added_at DESC";

  const result = await pool.query(query, params);

  return result.rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    gameId: row.game_id,
    status: row.status,
    addedAt: row.added_at,
    game: {
      id: row.game_id,
      name: row.name,
      description: row.description,
      shortDescription: row.short_description,
      headerImage: row.header_image,
      capsuleImage: row.capsule_image,
      soulScore: row.soul_score,
      price: row.price,
      releaseDate: row.release_date,
      emotionProfile: row.emotion_profile,
      genres: row.genres || [],
      tags: row.tags || [],
    },
  }));
}

/**
 * Update library entry status
 */
export async function updateLibraryStatus(
  userId: string,
  gameId: string,
  status: LibraryStatus
): Promise<LibraryEntry> {
  const result = await pool.query(
    `UPDATE user_libraries
     SET status = $3
     WHERE user_id = $1 AND game_id = $2
     RETURNING id, user_id, game_id, status, added_at`,
    [userId, gameId, status]
  );

  if (result.rows.length === 0) {
    throw new Error("Library entry not found");
  }

  return {
    id: result.rows[0].id,
    userId: result.rows[0].user_id,
    gameId: result.rows[0].game_id,
    status: result.rows[0].status,
    addedAt: result.rows[0].added_at,
  };
}

/**
 * Remove game from library
 */
export async function removeFromLibrary(
  userId: string,
  gameId: string
): Promise<void> {
  await pool.query(
    "DELETE FROM user_libraries WHERE user_id = $1 AND game_id = $2",
    [userId, gameId]
  );
}

/**
 * Get library statistics
 */
export async function getLibraryStats(userId: string): Promise<{
  total: number;
  playing: number;
  completed: number;
  wishlist: number;
}> {
  // Ensure user exists
  await ensureUserExists(userId);

  const result = await pool.query(
    `SELECT 
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'playing') as playing,
      COUNT(*) FILTER (WHERE status = 'completed') as completed,
      COUNT(*) FILTER (WHERE status = 'wishlist') as wishlist
     FROM user_libraries
     WHERE user_id = $1`,
    [userId]
  );

  const row = result.rows[0];
  return {
    total: parseInt(row.total, 10),
    playing: parseInt(row.playing, 10),
    completed: parseInt(row.completed, 10),
    wishlist: parseInt(row.wishlist, 10),
  };
}

/**
 * Get emotional timeline from completed games
 */
export async function getEmotionalTimeline(userId: string): Promise<Array<{
  gameId: string;
  gameName: string;
  completedAt: string;
  emotionProfile: any;
}>> {
  const result = await pool.query(
    `SELECT 
      ul.game_id, ul.added_at,
      g.name, g.emotion_profile
     FROM user_libraries ul
     JOIN games g ON ul.game_id = g.id
     WHERE ul.user_id = $1 AND ul.status = 'completed'
     ORDER BY ul.added_at ASC`,
    [userId]
  );

  return result.rows.map((row) => ({
    gameId: row.game_id,
    gameName: row.name,
    completedAt: row.added_at,
    emotionProfile: row.emotion_profile,
  }));
}

