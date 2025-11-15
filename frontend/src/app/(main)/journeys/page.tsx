"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JourneyCard } from "@/components/journeys/JourneyCard";
import { JourneyCardSkeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";
import { Sparkles, Users, BookOpen } from "lucide-react";

type JourneyTab = "curated" | "community" | "my-journeys";

export default function JourneysPage() {
  const { user, isGuest } = useAuthStore();
  const [activeTab, setActiveTab] = useState<JourneyTab>("curated");

  // Fetch curated journeys
  const { data: curatedData, isLoading: isLoadingCurated } = useQuery({
    queryKey: ["journeys", "curated"],
    queryFn: async () => {
      try {
        return await api.getCuratedJourneys();
      } catch (error) {
        console.error("Failed to fetch curated journeys:", error);
        return { journeys: [] };
      }
    },
    enabled: activeTab === "curated",
  });

  // Fetch user journeys (only if authenticated)
  const { data: userJourneysData, isLoading: isLoadingUser } = useQuery({
    queryKey: ["journeys", "user", user?.id],
    queryFn: async () => {
      if (!user || isGuest) {
        return { journeys: [] };
      }
      try {
        return await api.getUserJourneys(user.id);
      } catch (error) {
        console.error("Failed to fetch user journeys:", error);
        return { journeys: [] };
      }
    },
    enabled: (activeTab === "my-journeys" || activeTab === "community") && !!user && !isGuest,
  });

  const isLoading = activeTab === "curated" ? isLoadingCurated : isLoadingUser;
  const journeys = activeTab === "curated" 
    ? (curatedData?.journeys || [])
    : (userJourneysData?.journeys || []);

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
              Emotional <span className="text-gradient">Journeys</span>
            </h1>
            <p className="text-xl text-[#D1D5DB] max-w-2xl mx-auto">
              Curated sequences that take you on emotional arcs through carefully selected games
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 justify-center">
            {[
              { id: "curated" as JourneyTab, label: "Curated", icon: Sparkles },
              { id: "community" as JourneyTab, label: "Community", icon: Users },
              { id: "my-journeys" as JourneyTab, label: "My Journeys", icon: BookOpen },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white"
                    : "bg-[#12182B]/50 border border-white/10 text-[#D1D5DB] hover:border-[#A855F7]/30"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Journeys Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <JourneyCardSkeleton key={i} />
              ))}
            </div>
          ) : journeys.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {journeys.map((journey: any, index: number) => (
                <motion.div
                  key={journey.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <JourneyCard journey={journey} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#D1D5DB] text-lg">
                {activeTab === "curated" 
                  ? "No curated journeys available yet" 
                  : activeTab === "my-journeys"
                  ? (isGuest || !user ? "Please sign in to see your journeys" : "You haven't created any journeys yet")
                  : "No community journeys available"}
              </p>
              <p className="text-[#9CA3AF] text-sm mt-2">
                {activeTab === "curated" 
                  ? "Check back later for curated emotional journeys"
                  : activeTab === "my-journeys"
                  ? "Create your first journey to start tracking your emotional gaming arc"
                  : "Community journeys will appear here"}
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
