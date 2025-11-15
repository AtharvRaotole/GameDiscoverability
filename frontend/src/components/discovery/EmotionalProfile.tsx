'use client';

import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Heart } from 'lucide-react';
import type { EmotionProfile } from '@/lib/types';
import { cn } from '@/lib/utils';

interface EmotionalProfileProps {
  userEmotions: EmotionProfile;
  gameEmotions?: EmotionProfile;
  className?: string;
}

const EMOTION_LABELS: Record<keyof EmotionProfile, { name: string; icon: string; color: string }> = {
  wonder: { name: 'Wonder', icon: '✨', color: 'from-[#A855F7] to-[#EC4899]' },
  melancholy: { name: 'Melancholy', icon: '🌙', color: 'from-[#3B82F6] to-[#06B6D4]' },
  joy: { name: 'Joy', icon: '☀️', color: 'from-[#F59E0B] to-[#EF4444]' },
  nostalgia: { name: 'Nostalgia', icon: '📼', color: 'from-[#EC4899] to-[#F472B6]' },
  tension: { name: 'Tension', icon: '⚡', color: 'from-[#EF4444] to-[#F59E0B]' },
  comfort: { name: 'Comfort', icon: '🏡', color: 'from-[#10B981] to-[#14B8A6]' },
  catharsis: { name: 'Catharsis', icon: '💫', color: 'from-[#8B5CF6] to-[#A855F7]' },
  challenge: { name: 'Challenge', icon: '⚔️', color: 'from-[#6366F1] to-[#8B5CF6]' },
};

export function EmotionalProfile({
  userEmotions,
  gameEmotions,
  className,
}: EmotionalProfileProps) {
  // Convert emotion profile to display format
  const emotions = Object.entries(EMOTION_LABELS).map(([key, label]) => {
    const emotionKey = key as keyof EmotionProfile;
    const userScore = Math.round((userEmotions[emotionKey] || 0) * 100);
    const gameScore = gameEmotions
      ? Math.round((gameEmotions[emotionKey] || 0) * 100)
      : undefined;
    
    return {
      ...label,
      key: emotionKey,
      yourScore: userScore,
      gameScore,
    };
  });

  // Calculate overall match percentage (only if game emotions provided)
  const calculateOverallMatch = () => {
    if (!gameEmotions) return null;
    
    let totalDiff = 0;
    let count = 0;
    
    emotions.forEach((emotion) => {
      if (emotion.gameScore !== undefined) {
        totalDiff += Math.abs(emotion.yourScore - emotion.gameScore);
        count++;
      }
    });
    
    if (count === 0) return null;
    
    const avgDiff = totalDiff / count;
    const matchPercentage = Math.round(100 - avgDiff);
    
    return {
      percentage: matchPercentage,
      quality: matchPercentage >= 85 ? 'Excellent' : matchPercentage >= 70 ? 'Good' : matchPercentage >= 55 ? 'Fair' : 'Moderate',
      color: matchPercentage >= 85 ? 'neon-cyan' : matchPercentage >= 70 ? 'neon-green' : matchPercentage >= 55 ? 'neon-blue' : 'neon-purple',
    };
  };

  const overallMatch = calculateOverallMatch();

  // Get top matching emotions (only if game emotions provided)
  const topMatches = gameEmotions
    ? emotions
        .filter((e) => e.gameScore !== undefined)
        .sort((a, b) => {
          const diffA = Math.abs(a.yourScore - (a.gameScore || 0));
          const diffB = Math.abs(b.yourScore - (b.gameScore || 0));
          return diffA - diffB;
        })
        .slice(0, 4)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-[#12182B]/50 backdrop-blur-sm border border-white/5 rounded-2xl p-8 hover:border-[#A855F7]/20 transition-all duration-300",
        className
      )}
    >
      {/* Header with match score */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#A855F7] to-[#EC4899]">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#F9FAFB]">
              {gameEmotions ? 'Emotional Breakdown' : 'Your Emotional Profile'}
            </h2>
            <p className="text-[#D1D5DB] text-sm mt-1">
              {gameEmotions 
                ? "How well this game matches what you're feeling"
                : "How well these games match what you're feeling"
              }
            </p>
          </div>
        </div>

        {/* Overall Match Badge (only if game emotions provided) */}
        {overallMatch && (
          <div className="flex flex-col items-end">
            <div className="text-3xl font-bold bg-gradient-to-r from-[#A855F7] via-[#EC4899] to-[#F59E0B] bg-clip-text text-transparent">
              {overallMatch.percentage}%
            </div>
            <div className={cn(
              "flex items-center gap-1.5 text-sm",
              overallMatch.color === 'neon-cyan' && "text-[#06B6D4]",
              overallMatch.color === 'neon-green' && "text-[#10B981]",
              overallMatch.color === 'neon-blue' && "text-[#3B82F6]",
              overallMatch.color === 'neon-purple' && "text-[#A855F7]"
            )}>
              <TrendingUp className="w-4 h-4" />
              <span>{overallMatch.quality} Match</span>
            </div>
          </div>
        )}
      </div>

      {/* Simple horizontal bars - EASY TO UNDERSTAND */}
      <div className="space-y-5">
        {emotions.map((emotion, index) => (
          <motion.div
            key={emotion.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-2"
          >
            {/* Emotion name and scores */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{emotion.icon}</span>
                <span className="text-[#F9FAFB] font-medium">{emotion.name}</span>
              </div>
              <div className="flex items-center gap-4 text-[#9CA3AF]">
                <span>
                  You: <span className="text-[#A855F7] font-semibold">{emotion.yourScore}%</span>
                </span>
                {emotion.gameScore !== undefined && (
                  <span>
                    {gameEmotions ? 'Game' : 'Games'}: <span className="text-[#EC4899] font-semibold">{emotion.gameScore}%</span>
                  </span>
                )}
              </div>
            </div>

            {/* Double bar visualization */}
            <div className="space-y-1.5">
              {/* Your emotion bar */}
              <div className="relative h-2 bg-[#1A2235]/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${emotion.yourScore}%` }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.8, ease: "easeOut" }}
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-full bg-gradient-to-r",
                    emotion.color
                  )}
                />
              </div>

              {/* Game emotion bar (only if game emotions provided) */}
              {emotion.gameScore !== undefined && (
                <div className="relative h-2 bg-[#1A2235]/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${emotion.gameScore}%` }}
                    transition={{ delay: index * 0.1 + 0.4, duration: 0.8, ease: "easeOut" }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#EC4899] to-[#EC4899]/80 rounded-full"
                    style={{ opacity: 0.8 }}
                  />
                </div>
              )}
            </div>

            {/* Match indicator (only if game emotions provided and close match) */}
            {emotion.gameScore !== undefined && Math.abs(emotion.yourScore - emotion.gameScore) <= 10 && (
              <div className="flex items-center gap-1.5 text-[#06B6D4] text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-pulse" />
                <span>Perfect match!</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Bottom explanation */}
      <div className="mt-8 pt-6 border-t border-white/5">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-[#A855F7]/5 to-[#EC4899]/5">
          <Sparkles className="w-5 h-5 text-[#A855F7] flex-shrink-0 mt-0.5" />
          <div className="text-sm text-[#D1D5DB] leading-relaxed">
            <span className="text-[#F9FAFB] font-medium">How to read this:</span> The closer the bars are, 
            the better the match. When both bars are at similar levels, {gameEmotions ? 'this game' : 'these games'} will give you the exact 
            emotions you're looking for.
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#A855F7]" />
          <span className="text-[#9CA3AF]">What you want to feel</span>
        </div>
        {gameEmotions && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#EC4899]" />
            <span className="text-[#9CA3AF]">What {gameEmotions ? 'this game' : 'these games'} deliver</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
