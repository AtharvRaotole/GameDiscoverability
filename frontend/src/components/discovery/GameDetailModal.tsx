"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ExternalLink, Clock, Users, Calendar, Star, Sparkles } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { EmotionalProfile } from "./EmotionalProfile";
import { cn } from "@/lib/utils";
import type { Game, EmotionProfile } from "@/lib/types";

interface GameDetailModalProps {
  game: Game | null;
  userEmotions?: EmotionProfile;
  isOpen: boolean;
  onClose: () => void;
  onWishlistAdd?: (gameId: string) => void;
}

export function GameDetailModal({
  game,
  userEmotions,
  isOpen,
  onClose,
  onWishlistAdd,
}: GameDetailModalProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!game || !isOpen) return null;

  const handleWishlistClick = () => {
    setIsWishlisted(!isWishlisted);
    onWishlistAdd?.(game.id);
  };

  const gameEmotions = game.emotionProfile as EmotionProfile | undefined;

  // Clean HTML description
  const cleanDescription = game.description
    ? game.description
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .trim()
    : "";

  const getSoulTier = (score: number) => {
    if (score >= 90) return { label: "Transcendent", gradient: "from-yellow-400 to-orange-500", color: "text-yellow-400" };
    if (score >= 75) return { label: "Profound", gradient: "from-[#A855F7] to-[#EC4899]", color: "text-[#A855F7]" };
    if (score >= 60) return { label: "Moving", gradient: "from-[#3B82F6] to-[#06B6D4]", color: "text-[#3B82F6]" };
    return { label: "Engaging", gradient: "from-[#10B981] to-emerald-500", color: "text-[#10B981]" };
  };

  const tier = getSoulTier(game.soulScore);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed inset-4 z-50 mx-auto max-h-[90vh] max-w-5xl overflow-y-auto rounded-2xl bg-[#12182B] border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-full bg-[#1A2235]/80 backdrop-blur-sm border border-white/10 p-2 text-[#D1D5DB] hover:text-[#F9FAFB] hover:border-[#A855F7]/50 transition-all"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Banner Image */}
            <div className="relative h-64 w-full overflow-hidden bg-[#1A2235] md:h-80">
              {!imageLoaded && (
                <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" style={{ backgroundSize: "1000px 100%" }} />
              )}
              {game.headerImage ? (
                <Image
                  src={game.headerImage}
                  alt={game.name}
                  fill
                  className={cn(
                    "object-cover transition-opacity duration-500",
                    imageLoaded ? "opacity-100" : "opacity-0"
                  )}
                  sizes="100vw"
                  onLoad={() => setImageLoaded(true)}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[#9CA3AF]">
                  <Sparkles className="w-16 h-16 opacity-30" />
                </div>
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#12182B] via-[#12182B]/50 to-transparent" />

              {/* Soul Score Badge on Image */}
              <div className={cn(
                "absolute bottom-4 left-4 px-4 py-2 rounded-xl bg-gradient-to-r text-white font-bold shadow-lg flex items-center gap-2",
                tier.gradient
              )}>
                <Star className="w-5 h-5 fill-current" />
                <div>
                  <div className="text-xs opacity-90">{tier.label}</div>
                  <div className="text-lg">{game.soulScore}/100</div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="mb-6">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="mb-3 text-4xl font-bold text-[#F9FAFB]">
                      {game.name}
                    </h2>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#D1D5DB]">
                      {game.releaseYear && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#9CA3AF]" />
                          <span>Released {game.releaseYear}</span>
                        </div>
                      )}
                      {game.estimatedHours && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#9CA3AF]" />
                          <span>~{game.estimatedHours} hours</span>
                        </div>
                      )}
                      {game.playerMode && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#9CA3AF]" />
                          <span>{game.playerMode}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleWishlistClick}
                    className={cn(
                      "rounded-full p-3 transition-all",
                      isWishlisted
                        ? "bg-[#EC4899] text-white shadow-[0_0_20px_rgba(236,72,153,0.5)]"
                        : "bg-[#1A2235] border border-white/10 text-[#D1D5DB] hover:border-[#EC4899]/50 hover:bg-[#1A2235]/80"
                    )}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart
                      className={cn(
                        "h-5 w-5 transition-all",
                        isWishlisted && "fill-current"
                      )}
                    />
                  </button>
                </div>
              </div>

              {/* Emotional Profile */}
              {userEmotions && gameEmotions && (
                <div className="mb-8">
                  <EmotionalProfile
                    userEmotions={userEmotions}
                    gameEmotions={gameEmotions}
                  />
                </div>
              )}

              {/* Price and Quick Info */}
              <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {game.price !== undefined && game.price !== null && (
                  <div className="rounded-xl border border-white/10 bg-[#1A2235]/50 p-4">
                    <div className="text-xs text-[#9CA3AF] mb-1">Price</div>
                    <div className="text-2xl font-bold text-[#F9FAFB]">
                      ${Number(game.price).toFixed(2)}
                    </div>
                  </div>
                )}
                {game.estimatedHours && (
                  <div className="rounded-xl border border-white/10 bg-[#1A2235]/50 p-4">
                    <div className="text-xs text-[#9CA3AF] mb-1">Playtime</div>
                    <div className="text-2xl font-bold text-[#F9FAFB]">
                      ~{game.estimatedHours}h
                    </div>
                  </div>
                )}
                {game.playerMode && (
                  <div className="rounded-xl border border-white/10 bg-[#1A2235]/50 p-4">
                    <div className="text-xs text-[#9CA3AF] mb-1">Mode</div>
                    <div className="text-xl font-bold text-[#F9FAFB]">
                      {game.playerMode}
                    </div>
                  </div>
                )}
                {game.releaseYear && (
                  <div className="rounded-xl border border-white/10 bg-[#1A2235]/50 p-4">
                    <div className="text-xs text-[#9CA3AF] mb-1">Released</div>
                    <div className="text-xl font-bold text-[#F9FAFB]">
                      {game.releaseYear}
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {cleanDescription && (
                <div className="mb-6">
                  <h3 className="mb-3 text-xl font-bold text-[#F9FAFB]">
                    Description
                  </h3>
                  <div className="rounded-xl border border-white/10 bg-[#1A2235]/30 p-6">
                    <p className="text-[#D1D5DB] leading-relaxed whitespace-pre-line">
                      {cleanDescription}
                    </p>
                  </div>
                </div>
              )}

              {/* Genres and Tags */}
              {(game.genres?.length > 0 || game.tags?.length > 0) && (
                <div className="mb-6">
                  <h3 className="mb-3 text-xl font-bold text-[#F9FAFB]">
                    Tags & Genres
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {game.genres?.slice(0, 8).map((genre) => (
                      <span
                        key={genre}
                        className="px-3 py-1.5 rounded-full bg-[#A855F7]/10 border border-[#A855F7]/20 text-[#A855F7] text-sm font-medium"
                      >
                        {genre}
                      </span>
                    ))}
                    {game.tags?.slice(0, 5).map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 rounded-full bg-[#1A2235] border border-white/10 text-[#D1D5DB] text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-3 sm:flex-row">
                {game.steamUrl && (
                  <a
                    href={game.steamUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#EC4899] px-6 py-3 font-semibold text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View on Steam
                  </a>
                )}
                <button
                  onClick={handleWishlistClick}
                  className={cn(
                    "flex-1 rounded-xl border px-6 py-3 font-semibold transition-all",
                    isWishlisted
                      ? "bg-[#EC4899]/10 border-[#EC4899]/50 text-[#EC4899] hover:bg-[#EC4899]/20"
                      : "bg-[#1A2235]/50 border-white/10 text-[#D1D5DB] hover:border-[#A855F7]/30 hover:text-[#F9FAFB]"
                  )}
                >
                  {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
