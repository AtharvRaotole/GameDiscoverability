"use client";

import { motion } from "framer-motion";
import { Clock, Users, ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface JourneyCardProps {
  journey: {
    id: string;
    title: string;
    description: string;
    games: Array<{
      gameId: string;
      order: number;
      name?: string;
      headerImage?: string;
    }>;
    totalHours: number;
    completionCount?: number;
    isCurated?: boolean;
  };
}

export function JourneyCard({ journey }: JourneyCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative w-full overflow-hidden rounded-2xl border border-white/5 bg-[#12182B]/50 backdrop-blur-sm transition-all hover:border-[#A855F7]/30 hover:shadow-[0_20px_60px_rgba(168,85,247,0.3)]"
    >
      <Link href={`/journeys/${journey.id}`}>
        <div className="p-6">
          {/* Header */}
          <div className="mb-4">
            {journey.isCurated && (
              <span className="mb-2 inline-block rounded-full bg-gradient-to-r from-[#A855F7] to-[#EC4899] px-3 py-1 text-xs font-semibold text-white flex items-center gap-1.5 w-fit">
                <Sparkles className="w-3 h-3" />
                Curated
              </span>
            )}
            <h3 className="mb-2 text-xl font-bold text-[#F9FAFB] group-hover:text-[#A855F7] transition-colors">
              {journey.title}
            </h3>
            <p className="line-clamp-2 text-sm text-[#D1D5DB]">
              {journey.description}
            </p>
          </div>

          {/* Game Preview Strip */}
          <div className="mb-4 flex gap-2 overflow-hidden">
            {journey.games.slice(0, 5).map((game, index) => (
              <div
                key={game.gameId}
                className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-[#1A2235]"
              >
                {game.headerImage ? (
                  <Image
                    src={game.headerImage}
                    alt={game.name || `Game ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-[#9CA3AF]">
                    {index + 1}
                  </div>
                )}
              </div>
            ))}
            {journey.games.length > 5 && (
              <div className="flex h-16 w-16 items-center justify-center rounded-md bg-[#1A2235] text-xs font-medium text-[#D1D5DB] border border-white/5">
                +{journey.games.length - 5}
              </div>
            )}
          </div>

          {/* Emotional Arc Preview */}
          <div className="mb-4 h-1 w-full overflow-hidden rounded-full bg-[#1A2235]">
            <div className="h-full w-full bg-gradient-to-r from-[#A855F7] via-[#EC4899] to-[#F59E0B]" />
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between text-sm text-[#9CA3AF]">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{journey.totalHours}h</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>{journey.completionCount || 0} completed</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[#A855F7] group-hover:text-[#EC4899] transition-colors">
              <span className="text-sm font-medium">View Journey</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
