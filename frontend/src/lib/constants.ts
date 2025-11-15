/**
 * Application constants
 */

export const EMOTION_CATEGORIES = [
  "joy",
  "melancholy",
  "tension",
  "wonder",
  "nostalgia",
  "catharsis",
  "comfort",
  "challenge",
] as const;

export const SOUL_SCORE_TIERS = {
  TRANSCENDENT: { min: 90, max: 100, label: "Transcendent", color: "gold" },
  PROFOUND: { min: 75, max: 89, label: "Profound", color: "purple" },
  MOVING: { min: 60, max: 74, label: "Moving", color: "blue" },
  ENGAGING: { min: 45, max: 59, label: "Engaging", color: "green" },
  STANDARD: { min: 0, max: 44, label: "Standard", color: "gray" },
} as const;

export const PLACEHOLDER_EXAMPLES = [
  "I want to feel the way Outer Wilds made me feel...",
  "Looking for something melancholic but hopeful...",
  "Games that capture the feeling of a rainy Sunday...",
  "Something that makes me think about life...",
  "I need a game that feels like coming home...",
  "Looking for that bittersweet nostalgia feeling...",
] as const;

export const BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
  desktop: 1280,
} as const;

export const ANIMATION_DURATIONS = {
  fast: 150,
  base: 200,
  slow: 300,
} as const;

