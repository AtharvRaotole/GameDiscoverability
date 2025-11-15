/**
 * Emotion Analysis Service
 * Analyzes text to extract emotional profiles using GPT-4
 */

import OpenAI from "openai";
import { env } from "../config/env";
import { generateEmbedding } from "./embedding.service";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export interface EmotionProfile {
  joy: number; // 0-1
  melancholy: number;
  tension: number;
  wonder: number;
  nostalgia: number;
  catharsis: number;
  comfort: number;
  challenge: number;
}

export interface EmotionTag {
  word: string;
  intensity: number; // 0-1
  category: keyof EmotionProfile;
}

export interface EmotionVector {
  embedding: number[]; // 3072 dimensions
  emotions: EmotionProfile;
}

/**
 * Analyze user input and extract emotion vector
 */
export async function analyzeUserInput(text: string): Promise<EmotionVector> {
  // Generate embedding
  const embedding = await generateEmbedding(text);

  // Extract explicit emotions using GPT-4
  const emotions = await extractEmotions(text);

  return {
    embedding,
    emotions,
  };
}

/**
 * Extract emotions from text using GPT-4
 */
export async function extractEmotions(text: string): Promise<EmotionProfile> {
  const prompt = `Analyze the following text and extract emotional scores for 8 core emotions. Return ONLY a JSON object with numeric values (0-1) for each emotion:

Emotions to analyze:
- joy: Uplifting, fun, delightful experiences
- melancholy: Bittersweet, reflective, somber
- tension: Stress, anxiety, high-stakes
- wonder: Awe-inspiring, mysterious, magical
- nostalgia: Memory-evoking, sentimental, familiar
- catharsis: Emotional release, resolution, closure
- comfort: Cozy, safe, relaxing, wholesome
- challenge: Difficulty, mastery, achievement

Text: "${text}"

Return format (JSON only, no markdown):
{
  "joy": 0.0-1.0,
  "melancholy": 0.0-1.0,
  "tension": 0.0-1.0,
  "wonder": 0.0-1.0,
  "nostalgia": 0.0-1.0,
  "catharsis": 0.0-1.0,
  "comfort": 0.0-1.0,
  "challenge": 0.0-1.0
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content:
            "You are an expert at analyzing emotional content. Return only valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from GPT-4");
    }

    const emotions = JSON.parse(content) as EmotionProfile;

    // Validate and normalize
    return normalizeEmotionProfile(emotions);
  } catch (error) {
    console.error("Error extracting emotions:", error);
    // Return neutral profile on error
    return getNeutralEmotionProfile();
  }
}

/**
 * Extract emotional keywords/tags from text (for UI display)
 */
export async function extractEmotionalKeywords(
  text: string
): Promise<EmotionTag[]> {
  const prompt = `Extract 3-7 emotional keywords from this text. Return ONLY a JSON array of objects with "word", "intensity" (0-1), and "category" (one of: joy, melancholy, tension, wonder, nostalgia, catharsis, comfort, challenge).

Text: "${text}"

Return format (JSON only, no markdown):
[
  {"word": "melancholic", "intensity": 0.8, "category": "melancholy"},
  {"word": "hopeful", "intensity": 0.6, "category": "joy"}
]`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content:
            "You are an expert at extracting emotional keywords. Return only valid JSON array.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.5,
      response_format: { type: "json_object" },
      max_tokens: 200,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return [];
    }

    const parsed = JSON.parse(content);
    const tags = Array.isArray(parsed) ? parsed : parsed.tags || parsed.keywords || [];

    return tags.slice(0, 7).map((tag: any) => ({
      word: tag.word || tag.keyword || "",
      intensity: Math.max(0, Math.min(1, tag.intensity || 0.5)),
      category: tag.category || "joy",
    }));
  } catch (error) {
    console.error("Error extracting keywords:", error);
    return [];
  }
}

/**
 * Analyze game emotions from reviews and description
 */
export async function analyzeGameEmotions(
  description: string,
  reviews: string[] = []
): Promise<EmotionProfile> {
  // Combine description and sample reviews
  const combinedText = [
    description,
    ...reviews.slice(0, 10), // Use up to 10 reviews
  ].join("\n\n");

  return extractEmotions(combinedText);
}

/**
 * Calculate emotion similarity between two profiles
 */
export function calculateEmotionSimilarity(
  profile1: EmotionProfile,
  profile2: EmotionProfile
): number {
  const emotions: (keyof EmotionProfile)[] = [
    "joy",
    "melancholy",
    "tension",
    "wonder",
    "nostalgia",
    "catharsis",
    "comfort",
    "challenge",
  ];

  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  for (const emotion of emotions) {
    const val1 = profile1[emotion];
    const val2 = profile2[emotion];
    dotProduct += val1 * val2;
    magnitude1 += val1 * val1;
    magnitude2 += val2 * val2;
  }

  const similarity = dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
  return Math.max(0, Math.min(1, similarity));
}

/**
 * Normalize emotion profile to ensure all values are 0-1
 */
function normalizeEmotionProfile(profile: any): EmotionProfile {
  const emotions: (keyof EmotionProfile)[] = [
    "joy",
    "melancholy",
    "tension",
    "wonder",
    "nostalgia",
    "catharsis",
    "comfort",
    "challenge",
  ];

  const normalized: any = {};
  for (const emotion of emotions) {
    const value = profile[emotion];
    normalized[emotion] = Math.max(0, Math.min(1, typeof value === "number" ? value : 0));
  }

  return normalized as EmotionProfile;
}

/**
 * Get neutral emotion profile (all 0.5)
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

