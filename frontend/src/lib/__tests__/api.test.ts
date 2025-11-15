import { api, ApiError } from "../api";

// Mock fetch
global.fetch = jest.fn();

describe("API Client", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("discover", () => {
    it("should make POST request to /api/discover", async () => {
      const mockResponse = {
        emotionVector: { embedding: [1, 2, 3], emotions: {} },
        results: [],
        total: 0,
        hasMore: false,
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await api.discover("test query");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/discover"),
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining("test query"),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw ApiError on non-ok response", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: "Server error" }),
      });

      await expect(api.discover("test")).rejects.toThrow(ApiError);
    });
  });

  describe("extractEmotions", () => {
    it("should make POST request to /api/emotions/extract", async () => {
      const mockResponse = [
        { word: "melancholic", intensity: 0.8, category: "melancholy" },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await api.extractEmotions("test text");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/emotions/extract"),
        expect.objectContaining({
          method: "POST",
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });
});

