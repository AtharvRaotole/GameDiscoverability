#!/usr/bin/env tsx
/**
 * Test Match Score Calculation
 * Debug why match scores are low
 */

require("dotenv").config({ path: require("path").join(process.cwd(), ".env") });

// Simulate the match score calculation
function calculateMatchScore(
  embeddingScore: number, // 0-1 from Pinecone
  emotionAlignment: number, // 0-1 from cosine similarity
  soulScore: number // 0-100
) {
  const embeddingPercent = embeddingScore * 100;
  const emotionPercent = emotionAlignment * 100;
  
  // Current formula
  const baseMatchScore =
    embeddingPercent * 0.5 +
    emotionPercent * 0.4 +
    (soulScore * 0.1);
  
  const normalizedScore = Math.max(30, Math.min(100, baseMatchScore));
  const soulBoost = soulScore >= 80 ? 5 : soulScore >= 70 ? 3 : 0;
  const matchScore = Math.min(100, normalizedScore + soulBoost);
  
  return {
    embeddingPercent: Math.round(embeddingPercent),
    emotionPercent: Math.round(emotionPercent),
    soulScore,
    baseMatchScore: Math.round(baseMatchScore * 100) / 100,
    normalizedScore: Math.round(normalizedScore),
    soulBoost,
    finalMatchScore: Math.round(matchScore),
  };
}

console.log("Testing Match Score Calculation:\n");

// Test case 1: Low similarity (what we're seeing)
console.log("Case 1: Low similarity (current issue)");
const result1 = calculateMatchScore(0.3, 0.3, 73);
console.log(result1);
console.log("");

// Test case 2: Medium similarity
console.log("Case 2: Medium similarity");
const result2 = calculateMatchScore(0.5, 0.5, 73);
console.log(result2);
console.log("");

// Test case 3: High similarity
console.log("Case 3: High similarity");
const result3 = calculateMatchScore(0.8, 0.8, 73);
console.log(result3);
console.log("");

// Test case 4: Very high soul score
console.log("Case 4: High soul score (96) with medium similarity");
const result4 = calculateMatchScore(0.4, 0.4, 96);
console.log(result4);
console.log("");

console.log("Analysis:");
console.log("- If embedding similarity is 0.3 (30%), emotion alignment is 0.3 (30%)");
console.log("- Base score = 30*0.5 + 30*0.4 + 73*0.1 = 15 + 12 + 7.3 = 34.3");
console.log("- Normalized = max(30, 34.3) = 34.3");
console.log("- Final = 34.3 + 3 (soul boost) = 37.3%");
console.log("");
console.log("The scores ARE accurate - they reflect low semantic/emotion similarity.");
console.log("We should improve the formula to better scale low scores.");

