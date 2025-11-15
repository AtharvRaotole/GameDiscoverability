"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameCard } from "@/components/discovery/GameCard";
import { EmotionalTimeline } from "@/components/library/EmotionalTimeline";
import { GameCardSkeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { BookOpen, Play, CheckCircle, Heart, BarChart3 } from "lucide-react";
import { useEffect } from "react";
import type { TimelineEntry } from "@/lib/types";

type LibraryStatus = "all" | "playing" | "completed" | "wishlist";

export default function LibraryPage() {
  const router = useRouter();
  const { user, isGuest } = useAuthStore();
  const [activeTab, setActiveTab] = useState<LibraryStatus>("all");

  // Redirect if not authenticated
  useEffect(() => {
    if (isGuest || !user) {
      router.push("/welcome");
    }
  }, [user, isGuest, router]);

  // Don't render if not authenticated
  if (isGuest || !user) {
    return null;
  }

  // Fetch library
  const { data: libraryData, isLoading, error: libraryError, refetch: refetchLibrary } = useQuery({
    queryKey: ["library", user.id, activeTab],
    queryFn: async () => {
      const status = activeTab === "all" ? undefined : activeTab;
      try {
        return await api.getLibrary(user.id, status);
      } catch (error) {
        console.error("Failed to fetch library:", error);
        return { library: [] };
      }
    },
    enabled: !!user,
  });

  // Fetch stats
  const { data: statsData, refetch: refetchStats } = useQuery({
    queryKey: ["library-stats", user.id],
    queryFn: async () => {
      try {
        return await api.getLibraryStats(user.id);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        return { stats: { total: 0, playing: 0, completed: 0, wishlist: 0 } };
      }
    },
    enabled: !!user,
  });

  // Fetch timeline
  const { data: timelineData } = useQuery({
    queryKey: ["library-timeline", user.id],
    queryFn: async () => {
      try {
        return await api.getEmotionalTimeline(user.id);
      } catch (error) {
        console.error("Failed to fetch timeline:", error);
        return { timeline: [] };
      }
    },
    enabled: !!user && activeTab === "completed",
  });

  const library = libraryData?.library || [];
  const stats = statsData?.stats || { total: 0, playing: 0, completed: 0, wishlist: 0 };
  const timeline: TimelineEntry[] = (timelineData?.timeline || []).map((entry: any) => ({
    gameId: entry.gameId,
    gameName: entry.gameName,
    completedAt: entry.completedAt,
    emotionProfile: {
      joy: entry.emotionProfile?.joy || 0,
      melancholy: entry.emotionProfile?.melancholy || 0,
      tension: entry.emotionProfile?.tension || 0,
      wonder: entry.emotionProfile?.wonder || 0,
      nostalgia: entry.emotionProfile?.nostalgia || 0,
      catharsis: entry.emotionProfile?.catharsis || 0,
      comfort: entry.emotionProfile?.comfort || 0,
      challenge: entry.emotionProfile?.challenge || 0,
    },
  }));

  const tabs: Array<{ id: LibraryStatus; label: string; icon: any; count?: number }> = [
    { id: "all", label: "All", icon: BookOpen, count: stats.total },
    { id: "playing", label: "Playing", icon: Play, count: stats.playing },
    { id: "completed", label: "Completed", icon: CheckCircle, count: stats.completed },
    { id: "wishlist", label: "Wishlist", icon: Heart, count: stats.wishlist },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0E1A]">
      <Header />

      <main id="main-content" className="flex-1 pt-20">
        <div className="container mx-auto px-6 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-5xl font-bold text-[#F9FAFB] mb-4">
              My <span className="text-gradient">Library</span>
            </h1>
            <p className="text-xl text-[#D1D5DB]">
              Track your gaming journey and emotional experiences
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {tabs.map((tab) => (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#12182B]/50 backdrop-blur-sm border border-white/5 rounded-xl p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <tab.icon className="w-5 h-5 text-[#A855F7]" />
                  <span className="text-sm text-[#D1D5DB]">{tab.label}</span>
                </div>
                <div className="text-2xl font-bold text-[#F9FAFB]">{tab.count || 0}</div>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white"
                    : "bg-[#12182B]/50 border border-white/10 text-[#D1D5DB] hover:border-[#A855F7]/30"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-1 text-xs opacity-75">({tab.count})</span>
                )}
              </button>
            ))}
          </div>

          {/* Emotional Timeline */}
          {activeTab === "completed" && timeline.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#F9FAFB] mb-4 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-[#A855F7]" />
                Your Emotional Journey
              </h2>
              <EmotionalTimeline timeline={timeline} />
            </div>
          )}

          {/* Error State */}
          {libraryError && (
            <div className="text-center py-12">
              <p className="text-[#EC4899] text-lg mb-2">Failed to load library</p>
              <p className="text-[#9CA3AF] text-sm mb-4">Please try refreshing the page</p>
              <button
                onClick={() => refetchLibrary()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white font-semibold hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all"
              >
                Retry
              </button>
            </div>
          )}

          {/* Games Grid */}
          {!libraryError && isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <GameCardSkeleton key={i} />
              ))}
            </div>
          ) : !libraryError && library.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
              {library.map((entry: any, index: number) => {
                // Handle both entry.game and direct game object
                const game = entry.game || entry;
                if (!game || !game.id) {
                  console.warn("Invalid library entry:", entry);
                  return null;
                }
                return (
                  <motion.div
                    key={entry.gameId || entry.id || game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <GameCard game={game} />
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#D1D5DB] text-lg mb-2">
                {activeTab === "all" 
                  ? "Your library is empty" 
                  : `No games in your ${activeTab} library`}
              </p>
              <p className="text-[#9CA3AF] text-sm mb-4">
                Start adding games to track your emotional journey
              </p>
              <button
                onClick={() => router.push("/discover")}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white font-semibold hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all"
              >
                Discover Games
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
