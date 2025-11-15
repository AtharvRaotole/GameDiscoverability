"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameCard } from "@/components/discovery/GameCard";
import { GameCardSkeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Heart, Zap } from "lucide-react";
import { api } from "@/lib/api";
import type { Game } from "@/lib/types";

const EMOTION_CATEGORIES = [
  { id: "wonder", name: "Wonder", icon: "✨", color: "from-[#A855F7] to-[#EC4899]" },
  { id: "melancholy", name: "Melancholy", icon: "🌙", color: "from-[#3B82F6] to-[#06B6D4]" },
  { id: "joy", name: "Joy", icon: "☀️", color: "from-[#F59E0B] to-[#EF4444]" },
  { id: "nostalgia", name: "Nostalgia", icon: "📼", color: "from-[#EC4899] to-[#F472B6]" },
  { id: "tension", name: "Tension", icon: "⚡", color: "from-[#EF4444] to-[#F59E0B]" },
  { id: "comfort", name: "Comfort", icon: "🏡", color: "from-[#10B981] to-[#14B8A6]" },
];

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadGames();
  }, [selectedCategory]);

  const loadGames = async () => {
    setIsLoading(true);
    try {
      // First get total count
      const firstPage = await api.getAllGames({
        limit: 1,
        sortBy: "soul_score",
        order: "DESC",
      });
      
      const total = firstPage.total;
      
      // Load all games (or up to 1000 for performance)
      const limit = Math.min(total, 1000);
      const response = await api.getAllGames({
        limit,
        sortBy: "soul_score",
        order: "DESC",
      });
      setGames(response.games as Game[]);
      console.log(`Loaded ${response.games.length} games out of ${total} total`);
    } catch (error) {
      console.error("Failed to load games:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0E1A]">
      <Header />

      <main id="main-content" className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold text-[#F9FAFB] mb-4">
              Explore by <span className="text-gradient">Vibe</span>
            </h1>
            <p className="text-xl text-[#D1D5DB] max-w-2xl mx-auto">
              Discover games organized by the emotions they evoke. Find your perfect emotional match.
            </p>
          </motion.div>

          {/* Emotion Categories */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {EMOTION_CATEGORIES.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-6 rounded-2xl border transition-all ${
                  selectedCategory === category.id
                    ? `bg-gradient-to-br ${category.color} border-transparent text-white`
                    : "bg-[#12182B]/50 border-white/10 text-[#D1D5DB] hover:border-[#A855F7]/30"
                }`}
              >
                <div className="text-4xl mb-2">{category.icon}</div>
                <div className="text-sm font-medium">{category.name}</div>
              </motion.button>
            ))}
          </div>

          {/* Games Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <GameCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
              {games.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GameCard game={game} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
