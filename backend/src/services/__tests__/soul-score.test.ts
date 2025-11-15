import {
  calculateSoulScore,
  analyzeReviewDepth,
  measureArtisticIntent,
  calculateEmotionalRange,
} from "../soul-score.service";

describe("SoulScoreService", () => {
  describe("calculateSoulScore", () => {
    it("should calculate soul score from factors", () => {
      const factors = {
        communityDepth: 0.8,
        artisticIntent: 0.7,
        emotionalRange: 0.9,
        playerImpact: 0.6,
        indieBonus: 1.0,
      };

      const score = calculateSoulScore(factors);

      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it("should return 0 for all zero factors", () => {
      const factors = {
        communityDepth: 0,
        artisticIntent: 0,
        emotionalRange: 0,
        playerImpact: 0,
        indieBonus: 0,
      };

      const score = calculateSoulScore(factors);
      expect(score).toBe(0);
    });
  });

  describe("analyzeReviewDepth", () => {
    it("should analyze review depth from reviews", () => {
      const reviews = [
        { text: "This game changed my life", rating: 5 },
        { text: "Made me cry, so profound", rating: 5 },
        { text: "It's okay", rating: 3 },
      ];

      const depth = analyzeReviewDepth(reviews);

      expect(depth).toBeGreaterThanOrEqual(0);
      expect(depth).toBeLessThanOrEqual(1);
    });

    it("should return 0.5 for empty reviews", () => {
      const depth = analyzeReviewDepth([]);
      expect(depth).toBe(0.5);
    });
  });

  describe("measureArtisticIntent", () => {
    it("should measure artistic intent from game data", () => {
      const game = {
        description: "An experimental artistic game",
        genres: ["indie", "narrative"],
        tags: ["artistic", "unique", "innovative"],
      };

      const intent = measureArtisticIntent(game);

      expect(intent).toBeGreaterThan(0.5);
      expect(intent).toBeLessThanOrEqual(1);
    });
  });

  describe("calculateEmotionalRange", () => {
    it("should calculate emotional range from profile", () => {
      const profile = {
        joy: 0.9,
        melancholy: 0.1,
        tension: 0.8,
        wonder: 0.2,
        nostalgia: 0.7,
        catharsis: 0.3,
        comfort: 0.6,
        challenge: 0.4,
      };

      const range = calculateEmotionalRange(profile);

      expect(range).toBeGreaterThanOrEqual(0);
      expect(range).toBeLessThanOrEqual(1);
    });
  });
});

