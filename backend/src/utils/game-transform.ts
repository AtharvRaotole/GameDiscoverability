/**
 * Transform database game objects to frontend format
 * Converts snake_case to camelCase and ensures all fields are present
 */

export function transformGame(game: any): any {
  if (!game) return null;

  // Extract emotion profile
  const emotionProfile = typeof game.emotion_profile === 'object' 
    ? game.emotion_profile 
    : (game.emotion_profile ? JSON.parse(game.emotion_profile) : null);

  // Extract genres and tags
  const genres = Array.isArray(game.genres) 
    ? game.genres 
    : (game.genres ? JSON.parse(game.genres) : []);
  
  const tags = Array.isArray(game.tags) 
    ? game.tags 
    : (game.tags ? JSON.parse(game.tags) : []);

  // Extract release year from release_date
  const releaseYear = game.release_date 
    ? new Date(game.release_date).getFullYear() 
    : null;

  return {
    id: game.id,
    name: game.name || '',
    description: game.description || game.short_description || '',
    shortDescription: game.short_description || null,
    headerImage: game.header_image || game.capsule_image || '',
    capsuleImage: game.capsule_image || game.header_image || '',
    releaseDate: game.release_date || null,
    releaseYear,
    price: game.price ? parseFloat(game.price) : 0,
    steamUrl: game.steam_url || `https://store.steampowered.com/app/${game.id}`,
    soulScore: game.soul_score || 0,
    emotionProfile,
    genres,
    tags,
    // Optional fields
    estimatedHours: game.estimated_hours || null,
    playerMode: game.player_mode || null,
  };
}

export function transformGames(games: any[]): any[] {
  return games.map(transformGame).filter(Boolean);
}

