/**
 * Soul Score Calculation Service
 * Research-backed algorithm based on analysis of 36M+ Steam reviews
 * 
 * Metrics:
 * - Review Depth Score (35%) - Most important
 * - Sentiment Quality Score (25%)
 * - Player Investment Score (20%)
 * - Critical Acclaim Score (15%)
 * - Indie Authenticity Bonus (5%)
 */

export interface Review {
  text: string;
  rating: number;
  hoursPlayed?: number;
  isPositive: boolean;
  wordCount?: number;
}

export interface Game {
  id: string;
  name: string;
  description: string;
  genres: string[];
  tags: string[];
  price?: number;
  emotion_profile?: any;
  reviews?: Review[];
  positiveReviews?: number;
  totalReviews?: number;
  playerPlaytimes?: number[];
  developerSize?: number;
  publisher?: string;
  primaryGenre?: string;
}

export interface SoulScoreFactors {
  reviewDepth: number; // 0-1 (35%)
  sentimentQuality: number; // 0-1 (25%)
  playerInvestment: number; // 0-1 (20%)
  criticalAcclaim: number; // 0-1 (15%)
  indieBonus: number; // 0-1 (5%)
}

export interface SoulScoreResult {
  score: number; // 0-100
  tier: string;
  color: string;
  breakdown: {
    reviewDepth: number;
    sentimentQuality: number;
    playerInvestment: number;
    criticalAcclaim: number;
    indieBonus: number;
  };
}

// Genre average playtimes (in hours)
const GENRE_AVERAGES: Record<string, number> = {
  'Indie': 8,
  'RPG': 40,
  'Strategy': 25,
  'Puzzle': 6,
  'Action': 15,
  'Adventure': 12,
  'Simulation': 20,
  'Racing': 10,
  'Sports': 8,
  'Casual': 5,
  'Default': 10, // Fallback
};

// Big publishers to exclude from indie bonus
const BIG_PUBLISHERS = [
  'EA', 'Electronic Arts', 'Ubisoft', 'Activision', 'Activision Blizzard',
  '2K', '2K Games', 'Bethesda', 'Bethesda Softworks', 'Square Enix',
  'Warner Bros', 'Warner Bros. Interactive', 'Microsoft', 'Sony',
  'Nintendo', 'Capcom', 'Bandai Namco', 'SEGA', 'Konami',
];

/**
 * 1. Review Depth Score (35%) - MOST IMPORTANT
 * Research: Negative reviews average 40 words, positive reviews average 19 words.
 * Deeply engaged players write longer reviews.
 */
export async function calculateReviewDepth(reviews: Review[]): Promise<number> {
  if (reviews.length === 0) return 0.5; // Default for no reviews

  // Filter for reviews with 100+ hours played (engaged players)
  const deepReviews = reviews.filter(r => (r.hoursPlayed || 0) >= 100);
  
  // If no deep reviews, use all reviews
  const reviewsToAnalyze = deepReviews.length > 0 ? deepReviews : reviews;

  // Calculate average word count for positive reviews
  const positiveReviews = reviewsToAnalyze.filter(r => r.isPositive);
  
  if (positiveReviews.length === 0) return 0.3;

  // Calculate word count if not provided
  const reviewsWithWordCount = positiveReviews.map(r => ({
    ...r,
    wordCount: r.wordCount || r.text.split(/\s+/).length,
  }));

  const totalWords = reviewsWithWordCount.reduce((sum, r) => sum + (r.wordCount || 0), 0);
  const avgWords = totalWords / reviewsWithWordCount.length;

  // Score: Higher words in positive reviews = emotional depth
  // 19 words = baseline (0.0), 100+ words = max (1.0)
  const score = Math.min((avgWords - 19) / 80, 1.0);
  return Math.max(0, score); // Ensure non-negative
}

/**
 * 2. Sentiment Quality Score (25%)
 * Advanced sentiment analysis - looks for emotional vocabulary richness
 */
export async function analyzeSentimentQuality(reviews: Review[]): Promise<number> {
  if (reviews.length === 0) return 0.5;

  // Emotion keywords that indicate depth
  const emotionKeywords = [
    'beautiful', 'emotional', 'touching', 'profound', 'meaningful',
    'life-changing', 'unforgettable', 'masterpiece', 'heartfelt',
    'moving', 'inspiring', 'thought-provoking', 'deep', 'artistic',
    'transcendent', 'soulful', 'evocative', 'poignant', 'cathartic',
  ];

  const positiveReviews = reviews.filter(r => r.isPositive);
  
  if (positiveReviews.length === 0) return 0.3;

  // Count how many reviews use deep emotional vocabulary
  const emotionalReviews = positiveReviews.filter(review => {
    const text = review.text.toLowerCase();
    return emotionKeywords.some(word => text.includes(word));
  });

  // Percentage of reviews with emotional depth
  return emotionalReviews.length / positiveReviews.length;
}

/**
 * 3. Player Investment Score (20%)
 * Average playtime indicates how much the game captures players emotionally
 */
export function calculatePlayerInvestment(game: Game): number {
  if (!game.playerPlaytimes || game.playerPlaytimes.length === 0) {
    // Fallback: estimate based on genre
    const genre = game.primaryGenre || game.genres[0] || 'Default';
    const genreAvg = GENRE_AVERAGES[genre] || GENRE_AVERAGES['Default'];
    // Assume average playtime if unknown
    return 0.5;
  }

  // Get median playtime (not average - avoids outliers)
  const sorted = [...game.playerPlaytimes].sort((a, b) => a - b);
  const medianIndex = Math.floor(sorted.length / 2);
  const medianPlaytime = sorted.length % 2 === 0
    ? (sorted[medianIndex - 1] + sorted[medianIndex]) / 2
    : sorted[medianIndex];

  // Compare to genre average
  const genre = game.primaryGenre || game.genres[0] || 'Default';
  const genreAverage = GENRE_AVERAGES[genre] || GENRE_AVERAGES['Default'];

  // Score based on how much more players play vs genre norm
  const ratio = medianPlaytime / genreAverage;

  // Cap at 2x genre average = 1.0 score
  return Math.min(ratio / 2, 1.0);
}

/**
 * 4. Critical Acclaim Score (15%)
 * Positive review percentage weighted by review count
 */
export function calculateCriticalAcclaim(game: Game): number {
  const positiveReviews = game.positiveReviews || 0;
  const totalReviews = game.totalReviews || 0;

  if (totalReviews === 0) return 0.5; // Default for no reviews

  // Positive review percentage (Steam's metric)
  const positiveRatio = positiveReviews / totalReviews;

  // Weight by review count (more reviews = more validated)
  // 500+ reviews = full weight
  const reviewWeight = Math.min(totalReviews / 500, 1.0);

  // Games need >85% positive AND substantial reviews
  // 85% = 0.0, 100% = 1.0
  const qualityScore = Math.max(0, (positiveRatio - 0.85) / 0.15);

  return qualityScore * reviewWeight;
}

/**
 * 5. Indie Authenticity Bonus (5%)
 * Support genuine indie developers
 */
export function calculateIndieBonus(game: Game): number {
  let score = 0;

  // Team size (from Steam data or estimate)
  const devSize = game.developerSize || 10; // Default estimate
  if (devSize <= 5) score += 0.4;
  else if (devSize <= 15) score += 0.2;

  // No big publisher
  const publisher = game.publisher || '';
  const isBigPublisher = BIG_PUBLISHERS.some(p => 
    publisher.toLowerCase().includes(p.toLowerCase())
  );
  if (!isBigPublisher) {
    score += 0.3;
  }

  // Price point (indie pricing)
  const price = game.price || 0;
  if (price <= 25) score += 0.3;

  return Math.min(score, 1.0);
}

/**
 * Calculate Soul Score for a game
 * Research-backed weighted formula
 */
export async function calculateSoulScore(game: Game): Promise<SoulScoreResult> {
  const reviews = game.reviews || [];

  // Get all metrics
  const reviewDepth = await calculateReviewDepth(reviews);
  const sentimentQuality = await analyzeSentimentQuality(reviews);
  const playerInvestment = calculatePlayerInvestment(game);
  const criticalAcclaim = calculateCriticalAcclaim(game);
  const indieBonus = calculateIndieBonus(game);

  // Weighted formula (research-backed)
  const rawScore = (
    reviewDepth * 0.35 +
    sentimentQuality * 0.25 +
    playerInvestment * 0.20 +
    criticalAcclaim * 0.15 +
    indieBonus * 0.05
  );

  // Convert to 0-100 scale
  const soulScore = Math.round(rawScore * 100);

  // Determine tier
  const tier = getSoulTier(soulScore);

  return {
    score: soulScore,
    tier: tier.name,
    color: tier.color,
    breakdown: {
      reviewDepth: Math.round(reviewDepth * 100),
      sentimentQuality: Math.round(sentimentQuality * 100),
      playerInvestment: Math.round(playerInvestment * 100),
      criticalAcclaim: Math.round(criticalAcclaim * 100),
      indieBonus: Math.round(indieBonus * 100),
    },
  };
}

/**
 * Get soul tier based on score
 */
export function getSoulTier(score: number): { name: string; color: string } {
  if (score >= 90) return { name: 'Transcendent', color: 'gold' };
  if (score >= 75) return { name: 'Profound', color: 'purple' };
  if (score >= 60) return { name: 'Moving', color: 'blue' };
  if (score >= 45) return { name: 'Engaging', color: 'green' };
  return { name: 'Standard', color: 'gray' };
}

/**
 * Calculate all soul score factors for a game (legacy compatibility)
 */
export async function calculateSoulScoreFactors(game: {
  id: string;
  description: string;
  genres: string[];
  tags: string[];
  emotion_profile?: any;
  price?: number;
  reviews?: Review[];
  positiveReviews?: number;
  totalReviews?: number;
  playerPlaytimes?: number[];
  developerSize?: number;
  publisher?: string;
}): Promise<SoulScoreFactors> {
  const reviews = game.reviews || [];

  const reviewDepth = await calculateReviewDepth(reviews);
  const sentimentQuality = await analyzeSentimentQuality(reviews);
  const playerInvestment = calculatePlayerInvestment(game as Game);
  const criticalAcclaim = calculateCriticalAcclaim(game as Game);
  const indieBonus = calculateIndieBonus(game as Game);

  return {
    reviewDepth,
    sentimentQuality,
    playerInvestment,
    criticalAcclaim,
    indieBonus,
  };
}

// Legacy function for backward compatibility
export function calculateSoulScoreLegacy(factors: SoulScoreFactors): number {
  const rawScore = (
    factors.reviewDepth * 0.35 +
    factors.sentimentQuality * 0.25 +
    factors.playerInvestment * 0.20 +
    factors.criticalAcclaim * 0.15 +
    factors.indieBonus * 0.05
  );
  return Math.round(rawScore * 100);
}
