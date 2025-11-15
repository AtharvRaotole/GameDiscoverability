"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameCard } from "@/components/discovery/GameCard";
import { EmotionalProfile } from "@/components/discovery/EmotionalProfile";
import { GameDetailModal } from "@/components/discovery/GameDetailModal";
import { GameCardSkeleton } from "@/components/ui/skeleton";
import { useDiscoveryStore } from "@/stores/discovery-store";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Edit2, Sparkles, ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { FilterPanel } from "@/components/discovery/FilterPanel";
import { useAuthStore } from "@/stores/auth-store";
import type { EmotionProfile, GameMatch } from "@/lib/types";

export default function DiscoverPage() {
  const {
    query,
    emotionVector,
    results,
    isLoading,
    error,
    hasMore,
    total,
    filters,
    setQuery,
    setEmotionVector,
    setResults,
    addResults,
    setLoading,
    setError,
    updateFilters,
    reset,
  } = useDiscoveryStore();

  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [selectedGame, setSelectedGame] = useState<GameMatch | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false); // Collapsed by default

  // Define performSearch before using it in useEffect
  const performSearch = useCallback(async () => {
    if (!query || query.length < 20) return;

    setLoading(true);
    setError(null);
    setOffset(0);

    try {
      const response = await api.discover(query, {
        limit: 20,
        offset: 0,
        filters: {
          minSoulScore: filters.soulScoreRange[0],
          priceRange: {
            min: filters.priceRange[0],
            max: filters.priceRange[1],
          },
          genres: filters.genres,
        },
      });

      const emotions = response.emotionVector.emotions as Record<string, number>;
      setEmotionVector({
        embedding: response.emotionVector.embedding,
        emotions: {
          joy: emotions.joy || 0,
          melancholy: emotions.melancholy || 0,
          tension: emotions.tension || 0,
          wonder: emotions.wonder || 0,
          nostalgia: emotions.nostalgia || 0,
          catharsis: emotions.catharsis || 0,
          comfort: emotions.comfort || 0,
          challenge: emotions.challenge || 0,
        },
      });

      const gameMatches: GameMatch[] = response.results.map((r: any) => ({
        game: r.game,
        matchScore: r.matchScore,
        soulScore: r.soulScore,
        emotionAlignment: r.emotionAlignment,
      }));

      setResults(gameMatches, response.total, response.hasMore);
    } catch (err: any) {
      setError(err.message || "Failed to discover games");
    } finally {
      setLoading(false);
    }
  }, [query, filters, setLoading, setError, setEmotionVector, setResults]);

  // Perform search when component mounts or query changes
  useEffect(() => {
    const urlQuery = searchParams.get('q');
    if (urlQuery) {
      // Reset store if query changed
      if (urlQuery !== query) {
        reset();
        setQuery(urlQuery);
      }
    } else {
      // If no query in URL, reset store and redirect
      if (query) {
        reset();
      }
      router.push("/");
      return;
    }
  }, [searchParams, query, reset, setQuery, router]);

  // Perform search when query is set
  useEffect(() => {
    if (!query || query.length < 20) return;
    performSearch();
  }, [query, filters, performSearch]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore || !query) return;

    setIsLoadingMore(true);
    const newOffset = offset + 20;

    try {
      const response = await api.discover(query, {
        limit: 20,
        offset: newOffset,
        filters: {
          minSoulScore: filters.soulScoreRange[0],
          priceRange: {
            min: filters.priceRange[0],
            max: filters.priceRange[1],
          },
          genres: filters.genres,
        },
      });

      const gameMatches: GameMatch[] = response.results.map((r: any) => ({
        game: r.game,
        matchScore: r.matchScore,
        soulScore: r.soulScore,
        emotionAlignment: r.emotionAlignment,
      }));

      addResults(gameMatches, response.hasMore);
      setOffset(newOffset);
    } catch (err: any) {
      console.error("Failed to load more:", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, query, offset, filters, addResults]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 1000
      ) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMore]);

  const handleEditSearch = () => {
    router.push("/");
  };

  const handleViewDetails = (gameId: string) => {
    const match = results.find((r) => r.game.id === gameId);
    if (match) {
      setSelectedGame(match);
      setIsModalOpen(true);
    }
  };

  const handleWishlistAdd = async (gameId: string) => {
    const { user, isGuest } = useAuthStore.getState();
    if (isGuest || !user) {
      // Show message that login is required
      alert("Please sign up or login to add games to your wishlist");
      return;
    }

    try {
      await api.addToLibrary(user.id, gameId, "wishlist");
      // Refresh library data if on library page
      // You could also show a toast notification here
    } catch (error: any) {
      console.error("Failed to add to wishlist:", error);
      
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
          alert(`Failed to add game to wishlist: ${error.message}`);
        }
      } else {
        alert("Failed to add game to wishlist. Please try again.");
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0E1A]">
      <Header />

      <main id="main-content" className="flex-1 pt-20">
        {/* Sticky Search Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-20 z-30 mb-8 bg-[#12182B]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-5 h-5 text-[#A855F7]" />
                <h1 className="text-2xl font-bold text-[#F9FAFB]">
                  Your Emotional Matches
                </h1>
              </div>
              <p className="text-[#D1D5DB] text-sm">
                Based on: <span className="text-[#A855F7] font-medium">"{query}"</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleEditSearch}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#12182B]/50 backdrop-blur-sm px-4 py-2 text-sm font-medium text-[#D1D5DB] transition-all hover:border-[#A855F7]/30 hover:text-[#F9FAFB]"
              >
                <Edit2 className="h-4 w-4" />
                Edit Search
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#12182B]/50 backdrop-blur-sm px-4 py-2 text-sm font-medium text-[#D1D5DB] transition-all hover:border-[#A855F7]/30 hover:text-[#F9FAFB]"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>
              <select
                onChange={(e) => {
                  const sortValue = e.target.value;
                  // Sort results client-side
                  const sorted = [...results];
                  switch (sortValue) {
                    case "best-match":
                      sorted.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
                      break;
                    case "soul-score":
                      sorted.sort((a, b) => b.soulScore - a.soulScore);
                      break;
                    case "price-low":
                      sorted.sort((a, b) => {
                        const priceA = Number(a.game.price) || 0;
                        const priceB = Number(b.game.price) || 0;
                        return priceA - priceB;
                      });
                      break;
                    case "price-high":
                      sorted.sort((a, b) => {
                        const priceA = Number(a.game.price) || 0;
                        const priceB = Number(b.game.price) || 0;
                        return priceB - priceA;
                      });
                      break;
                    case "recent":
                      sorted.sort((a, b) => {
                        const yearA = a.game.releaseYear || 0;
                        const yearB = b.game.releaseYear || 0;
                        return yearB - yearA;
                      });
                      break;
                  }
                  // Update store with sorted results
                  setResults(sorted, total, hasMore);
                }}
                defaultValue="best-match"
                className="px-4 py-2.5 rounded-xl bg-[#1A2235]/50 border border-white/10 text-[#D1D5DB] focus:border-[#A855F7]/30 focus:outline-none hover:border-white/20 transition-all cursor-pointer"
              >
                <option value="best-match">Best Match</option>
                <option value="soul-score">Highest Soul Score</option>
                <option value="recent">Most Recent</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </motion.div>

        <div className="container mx-auto px-6 pb-8">
          {/* Results Count + Show Profile Toggle */}
          {!isLoading && results.length > 0 && (
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <p className="text-[#D1D5DB]">
                <span className="text-[#A855F7] font-semibold text-lg">{total}</span>
                <span className="ml-2">games found matching your emotions</span>
              </p>

              {/* Optional: View Emotional Breakdown */}
              {emotionVector && (
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#12182B]/50 border border-white/10 hover:border-[#A855F7]/30 text-[#D1D5DB] hover:text-[#F9FAFB] transition-all group whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4 text-[#A855F7]" />
                  <span className="text-sm">View Emotional Breakdown</span>
                  {showProfile ? (
                    <ChevronUp className="w-4 h-4 group-hover:translate-y-[-2px] transition-transform" />
                  ) : (
                    <ChevronDown className="w-4 h-4 group-hover:translate-y-[2px] transition-transform" />
                  )}
                </button>
              )}
            </div>
          )}

          {/* Collapsible Emotional Profile */}
          {emotionVector && (
            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 48 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mb-8"
                >
                  <EmotionalProfile userEmotions={emotionVector.emotions} />
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Loading State - Only show if no results yet */}
          {isLoading && results.length === 0 && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-[#A855F7] border-t-transparent mb-4"></div>
                <p className="text-[#D1D5DB]">Finding games that match your emotions...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mb-6 rounded-lg border border-[#EF4444]/50 bg-[#EF4444]/10 p-6 text-[#EF4444]">
              <h3 className="font-semibold mb-2">Error: {error}</h3>
              {error.includes("Failed to connect") || error.includes("Failed to fetch") ? (
                <div className="text-sm space-y-2">
                  <p className="text-[#D1D5DB]">The backend server is not running or not reachable.</p>
                  <div className="bg-[#1A2235] p-3 rounded-lg mt-3">
                    <p className="text-xs text-[#9CA3AF] mb-2">To fix this:</p>
                    <ol className="text-xs text-[#D1D5DB] list-decimal list-inside space-y-1">
                      <li>Open a new terminal window</li>
                      <li>Run: <code className="bg-[#0A0E1A] px-2 py-1 rounded">cd backend && npm run dev</code></li>
                      <li>Wait for the server to start</li>
                      <li>Refresh this page</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[#D1D5DB]">{error}</p>
              )}
              <button
                onClick={performSearch}
                className="mt-4 text-sm text-[#EC4899] hover:text-[#A855F7] transition-colors underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty State */}
          {results.length === 0 && !isLoading && !error && (
            <div className="py-12 text-center">
              <p className="mb-4 text-lg text-[#D1D5DB]">
                We couldn't find games matching that emotion
              </p>
              <p className="mb-6 text-sm text-[#9CA3AF]">
                Try describing the feeling differently
              </p>
              <button
                onClick={handleEditSearch}
                className="rounded-lg bg-gradient-to-r from-[#A855F7] to-[#EC4899] px-6 py-2 text-sm font-medium text-white transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]"
              >
                Edit Search
              </button>
            </div>
          )}

          {/* Games Grid - SHOWN FIRST */}
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
              <AnimatePresence>
                {results.map((match, index) => (
                  <motion.div
                    key={match.game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <GameCard
                      game={match.game}
                      matchScore={match.matchScore}
                      onViewDetails={handleViewDetails}
                      onWishlistAdd={handleWishlistAdd}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Load More */}
          {hasMore && !isLoading && (
            <div className="mt-8 text-center">
              {isLoadingMore ? (
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#A855F7] border-t-transparent"></div>
              ) : (
                <motion.button
                  onClick={loadMore}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#A855F7] via-[#EC4899] to-[#F59E0B] text-white font-semibold hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all duration-300 hover:scale-105"
                >
                  Load More Games
                </motion.button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Filter Panel */}
      <FilterPanel
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFiltersChange={updateFilters}
        onApply={performSearch}
      />

      {/* Game Detail Modal */}
      {selectedGame && emotionVector && (
        <GameDetailModal
          game={selectedGame.game}
          userEmotions={emotionVector.emotions}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onWishlistAdd={handleWishlistAdd}
        />
      )}

      <Footer />
    </div>
  );
}
