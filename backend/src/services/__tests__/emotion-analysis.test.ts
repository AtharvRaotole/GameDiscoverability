import {
  extractEmotions,
  calculateEmotionSimilarity,
  type EmotionProfile,
} from "../emotion-analysis.service";

// Mock OpenAI
jest.mock("openai", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  joy: 0.3,
                  melancholy: 0.7,
                  tension: 0.2,
                  wonder: 0.5,
                  nostalgia: 0.6,
                  catharsis: 0.4,
                  comfort: 0.3,
                  challenge: 0.2,
                }),
              },
            },
          ],
        }),
      },
    },
  })),
}));

describe("EmotionAnalysisService", () => {
  describe("extractEmotions", () => {
    it("should extract emotions from text", async () => {
      const result = await extractEmotions(
        "I want to feel melancholic but hopeful"
      );

      expect(result).toHaveProperty("joy");
      expect(result).toHaveProperty("melancholy");
      expect(result).toHaveProperty("tension");
      expect(result).toHaveProperty("wonder");
      expect(result).toHaveProperty("nostalgia");
      expect(result).toHaveProperty("catharsis");
      expect(result).toHaveProperty("comfort");
      expect(result).toHaveProperty("challenge");

      // All values should be between 0 and 1
      Object.values(result).forEach((value) => {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1);
      });
    });
  });

  describe("calculateEmotionSimilarity", () => {
    it("should calculate similarity between two emotion profiles", () => {
      const profile1: EmotionProfile = {
        joy: 0.8,
        melancholy: 0.2,
        tension: 0.3,
        wonder: 0.7,
        nostalgia: 0.5,
        catharsis: 0.6,
        comfort: 0.4,
        challenge: 0.5,
      };

      const profile2: EmotionProfile = {
        joy: 0.7,
        melancholy: 0.3,
        tension: 0.4,
        wonder: 0.6,
        nostalgia: 0.5,
        catharsis: 0.5,
        comfort: 0.5,
        challenge: 0.5,
      };

      const similarity = calculateEmotionSimilarity(profile1, profile2);

      expect(similarity).toBeGreaterThanOrEqual(0);
      expect(similarity).toBeLessThanOrEqual(1);
    });

    it("should return 1 for identical profiles", () => {
      const profile: EmotionProfile = {
        joy: 0.5,
        melancholy: 0.5,
        tension: 0.5,
        wonder: 0.5,
        nostalgia: 0.5,
        catharsis: 0.5,
        comfort: 0.5,
        challenge: 0.5,
      };

      const similarity = calculateEmotionSimilarity(profile, profile);
      expect(similarity).toBeCloseTo(1, 2);
    });
  });
});

