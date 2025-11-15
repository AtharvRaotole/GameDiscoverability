"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Clock, Users, Star, ExternalLink, Sparkles, GamepadIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Game } from "@/lib/types";

interface GameCardProps {
  game: Game;
  matchScore?: number;
  onWishlistAdd?: (gameId: string) => void;
  onViewDetails?: (gameId: string) => void;
}

export function GameCard({
  game,
  matchScore,
  onWishlistAdd,
  onViewDetails,
}: GameCardProps) {
  const { user, isGuest } = useAuthStore();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Check if game is in wishlist on mount
  useEffect(() => {
    if (user && !isGuest) {
      // Check if game is in user's wishlist
      api.getLibrary(user.id, "wishlist")
        .then((data) => {
          const inWishlist = data.library?.some((entry: any) => 
            (entry.gameId || entry.game?.id) === game.id
          );
          setIsWishlisted(!!inWishlist);
        })
        .catch(() => {
          // Silently fail
        });
    }
  }, [user, isGuest, game.id]);

  const getSoulTier = (score: number) => {
    if (score >= 90) return { label: "Transcendent", gradient: "from-yellow-400 to-orange-500" };
    if (score >= 75) return { label: "Profound", gradient: "from-[#A855F7] to-[#EC4899]" };
    if (score >= 60) return { label: "Moving", gradient: "from-[#3B82F6] to-[#06B6D4]" };
    return { label: "Engaging", gradient: "from-[#10B981] to-emerald-500" };
  };

  const tier = getSoulTier(game.soulScore);

  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isGuest || !user) {
      alert("Please sign up or login to add games to your wishlist");
      return;
    }

    try {
      if (isWishlisted) {
        // Remove from wishlist
        await api.removeFromLibrary(user.id, game.id);
        setIsWishlisted(false);
      } else {
        // Add to wishlist
        await api.addToLibrary(user.id, game.id, "wishlist");
        setIsWishlisted(true);
      }
      onWishlistAdd?.(game.id);
    } catch (error: any) {
      console.error("Failed to update wishlist:", error);
      
      // Provide better error messages
      if (error instanceof Error && error.name === "ApiError") {
        const apiError = error as any;
        if (apiError.status === 0) {
          // Connection error
          alert(
            `Cannot connect to backend server.\n\n` +
            `Please make sure the backend is running:\n` +
            `1. Open a terminal\n` +
            `2. Navigate to the backend directory\n` +
            `3. Run: npm run dev\n\n` +
            `The server should be running at http://localhost:3001`
          );
        } else {
          // Other API errors
          alert(`Failed to update wishlist: ${error.message}`);
        }
      } else {
        alert("Failed to update wishlist. Please try again.");
      }
    }
  };

  const handleCardClick = () => {
    onViewDetails?.(game.id);
  };

  const emotions = game.emotionProfile
    ? Object.entries(game.emotionProfile)
        .filter(([_, value]) => value > 0.5)
        .map(([key]) => key)
        .slice(0, 3)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onClick={handleCardClick}
      className="group cursor-pointer relative"
    >
      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#A855F7]/0 to-[#EC4899]/0 group-hover:from-[#A855F7]/20 group-hover:to-[#EC4899]/10 rounded-2xl blur-xl transition-all duration-500" />

      {/* Card */}
      <div className="relative bg-[#12182B]/50 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden group-hover:border-[#A855F7]/30 group-hover:shadow-[0_20px_60px_rgba(168,85,247,0.3)] transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-[#1A2235]">
          {!imageLoaded && (
            <div
              className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent"
              style={{ backgroundSize: "1000px 100%" }}
            />
          )}

          {!imageError && game.headerImage ? (
            <Image
              src={game.headerImage}
              alt={game.name}
              fill
              className={cn(
                "object-cover transition-all duration-500",
                imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105",
                "group-hover:scale-110"
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(true);
              }}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[#9CA3AF]">
              <GamepadIcon className="w-12 h-12 opacity-30" />
            </div>
          )}

          {/* Match Score Badge */}
          {matchScore !== undefined && (
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-[#A855F7]/90 backdrop-blur-sm text-white text-sm font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              {matchScore}% Match
            </div>
          )}

          {/* Wishlist Heart */}
          <motion.button
            onClick={handleWishlist}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-[#0A0E1A]/80 backdrop-blur-sm border border-white/10 hover:border-[#EC4899]/50 transition-all duration-300 z-10"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={cn(
                "w-5 h-5 transition-colors",
                isWishlisted ? "fill-[#EC4899] text-[#EC4899]" : "text-[#D1D5DB]"
              )}
            />
          </motion.button>

          {/* Soul Score Badge */}
          <div
            className={cn(
              "absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-gradient-to-r text-white text-sm font-bold shadow-lg",
              tier.gradient
            )}
            title={`Soul Score: ${tier.label} - Measures emotional depth, review quality, and player engagement`}
          >
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-current" />
              <span>Soul {game.soulScore}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <h3 className="text-xl font-bold text-[#F9FAFB] mb-3 group-hover:text-[#A855F7] transition-colors line-clamp-1">
            {game.name}
          </h3>

          {/* Emotion Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {emotions.slice(0, 3).map((emotion) => (
              <span
                key={emotion}
                className="px-3 py-1 rounded-full text-xs font-medium bg-[#A855F7]/10 text-[#A855F7] border border-[#A855F7]/20"
              >
                {emotion}
              </span>
            ))}
            {emotions.length > 3 && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-[#9CA3AF]">
                +{emotions.length - 3} more
              </span>
            )}
          </div>

          {/* Description */}
          {game.shortDescription && (
            <p className="text-[#D1D5DB] text-sm mb-4 line-clamp-2 leading-relaxed">
              {game.shortDescription}
            </p>
          )}

          {/* Metadata */}
          <div className="flex items-center justify-between text-sm text-[#9CA3AF] pt-4 border-t border-white/5">
            <div className="flex items-center gap-4">
              {game.estimatedHours && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{game.estimatedHours}h</span>
                </div>
              )}
              {game.playerMode && (
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>{game.playerMode}</span>
                </div>
              )}
            </div>
            {game.price !== undefined && game.price !== null && (
              <div className="text-[#F9FAFB] font-semibold">
                ${Number(game.price).toFixed(2)}
              </div>
            )}
          </div>
        </div>

        {/* Hover overlay with actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E1A]/95 via-[#0A0E1A]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6 pointer-events-none">
          <div className="flex gap-3 w-full pointer-events-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#A855F7] via-[#EC4899] to-[#F59E0B] text-white font-semibold hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>View Details</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
