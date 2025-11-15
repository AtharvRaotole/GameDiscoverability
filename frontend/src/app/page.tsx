"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, GamepadIcon, Heart, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EmotionInput } from "@/components/discovery/EmotionInput";
import { GameCard } from "@/components/discovery/GameCard";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useAuthStore } from "@/stores/auth-store";
import { api } from "@/lib/api";
import type { Game } from "@/lib/types";

export default function HomePage() {
  const router = useRouter();
  const { isGuest, isAuthenticated } = useAuthStore();
  useKeyboardShortcuts();

  // Redirect to welcome if not authenticated and not guest
  useEffect(() => {
    if (!isAuthenticated && !isGuest) {
      router.push("/welcome");
    }
  }, [isAuthenticated, isGuest, router]);
  const [featuredGames, setFeaturedGames] = useState<Game[]>([]);
  const [isLoadingGames, setIsLoadingGames] = useState(true);

  useEffect(() => {
    // Load ALL games (or a large number)
    const loadFeaturedGames = async () => {
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
        setFeaturedGames(response.games as Game[]);
        console.log(`Loaded ${response.games.length} games out of ${total} total`);
      } catch (error: any) {
        // Silently handle errors - backend might be down
        // The app should still work without featured games
        if (error?.status !== 0) {
          // Only log non-connection errors
          console.error("Failed to load featured games:", error);
        }
        setFeaturedGames([]);
      } finally {
        setIsLoadingGames(false);
      }
    };

    loadFeaturedGames();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0E1A] relative overflow-hidden">
      {/* Animated background particles */}
      <ParticleBackground />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-[#A855F7]/10 via-transparent to-transparent pointer-events-none" />

      <Header />

      <main id="main-content" className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-6 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto text-center"
          >
            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#A855F7]/20 to-[#EC4899]/20 border border-[#A855F7]/30 backdrop-blur-sm mb-8"
            >
              <Sparkles className="w-4 h-4 text-[#A855F7]" />
              <span className="text-sm font-medium text-[#D1D5DB]">
                AI-Powered Emotional Discovery
              </span>
            </motion.div>

            {/* Main headline */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="text-[#F9FAFB]">Discover games through</span>
              <br />
              <span className="text-gradient animate-gradient-shift">
                emotion
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-[#D1D5DB] max-w-3xl mx-auto mb-12 leading-relaxed">
              Find games that make you feel the way your favorite games made you feel.
              <br />
              <span className="text-[#9CA3AF]">
                Not by genre or tags, but by the emotions they evoke.
              </span>
            </p>

            {/* Emotion Input */}
            <EmotionInput />
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-6 py-20">
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <FeatureCard
              icon={<Heart className="w-8 h-8" />}
              title="Soul Score"
              description="Discover games with emotional depth, not just commercial appeal"
              gradient="from-[#EC4899] to-[#A855F7]"
              delay={0.3}
            />
            <FeatureCard
              icon={<Sparkles className="w-8 h-8" />}
              title="Emotion Matching"
              description="AI analyzes feelings, not keywords, to find your perfect match"
              gradient="from-[#A855F7] to-[#3B82F6]"
              delay={0.4}
            />
            <FeatureCard
              icon={<GamepadIcon className="w-8 h-8" />}
              title="Curated Journeys"
              description="Experience emotional arcs through carefully sequenced games"
              gradient="from-[#3B82F6] to-[#06B6D4]"
              delay={0.5}
            />
          </div>
        </section>

        {/* Featured Games Preview */}
        {!isLoadingGames && featuredGames.length > 0 && (
          <section className="container mx-auto px-6 py-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-[#F9FAFB] mb-4">
                High Soul Score Games
              </h2>
              <p className="text-[#D1D5DB] text-lg">
                Games that transcend entertainment
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GameCard game={game} />
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

// Pre-calculated particle positions for perfect SSR/client matching
// Using a simple hash function that's guaranteed to be the same on server and client
function hash(seed: number): number {
  let h = seed;
  h = ((h << 5) - h) + seed;
  h = h & h; // Convert to 32bit integer
  return Math.abs(h) / 2147483647; // Normalize to 0-1
}

// Particle Background Component
function ParticleBackground() {
  // Generate deterministic particle data - pre-calculated for consistency
  const particles = Array.from({ length: 30 }, (_, i) => {
    const base = i * 7919; // Prime number for better distribution
    const r1 = hash(base);
    const r2 = hash(base + 1);
    const r3 = hash(base + 2);
    const r4 = hash(base + 3);
    const r5 = hash(base + 4);
    const r6 = hash(base + 5);
    const r7 = hash(base + 6);
    
    // Round to integers for width/height to avoid precision issues
    return {
      width: Math.round(r1 * 300 + 50),
      height: Math.round(r2 * 300 + 50),
      left: Math.round(r3 * 10000) / 100, // 2 decimal places for percentage
      top: Math.round(r4 * 10000) / 100,
      xOffset: Math.round((r5 * 20 - 10) * 10) / 10,
      duration: Math.round((r6 * 10 + 10) * 10) / 10,
      delay: Math.round(r7 * 50) / 10,
    };
  });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-[#A855F7]/20 to-[#EC4899]/20 blur-xl"
          style={{
            width: `${particle.width}px`,
            height: `${particle.height}px`,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, particle.xOffset, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
}

// Feature Card Component
function FeatureCard({
  icon,
  title,
  description,
  gradient,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#A855F7]/5 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />

      <div className="relative bg-[#12182B]/50 backdrop-blur-sm border border-white/5 rounded-2xl p-8 hover:border-[#A855F7]/30 transition-all duration-300 group-hover:translate-y-[-4px]">
        <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient} mb-4 text-white`}>
          {icon}
        </div>

        <h3 className="text-xl font-semibold text-[#F9FAFB] mb-2">{title}</h3>

        <p className="text-[#D1D5DB] leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
