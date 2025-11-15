"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Clock, Users, CheckCircle2, ExternalLink, GitFork } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { EmotionalProfile } from "@/components/discovery/EmotionalProfile";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function JourneyDetailPage() {
  const params = useParams();
  const journeyId = params.id as string;

  const { data, isLoading } = useQuery({
    queryKey: ["journey", journeyId],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/journeys/${journeyId}`
      );
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
  });

  const journey = data?.journey;

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#F5F5F5]">
        <Header />
        <main className="flex-1 container mx-auto px-6 py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#6366F1] border-t-transparent"></div>
            <p className="mt-4 text-[#2D2D2D]/70">Loading journey...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!journey) {
    return (
      <div className="flex min-h-screen flex-col bg-[#F5F5F5]">
        <Header />
        <main className="flex-1 container mx-auto px-6 py-12">
          <p className="text-center text-[#2D2D2D]/70">Journey not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  // Prepare chart data for emotional arc
  const chartData = journey.emotionalArc?.emotions?.map((emotion: any, index: number) => ({
    game: `Game ${index + 1}`,
    joy: (emotion.joy || 0) * 100,
    melancholy: (emotion.melancholy || 0) * 100,
    tension: (emotion.tension || 0) * 100,
    wonder: (emotion.wonder || 0) * 100,
  })) || [];

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F5]">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-[#E5E5E5] bg-white py-12">
          <div className="container mx-auto px-6">
            <Link
              href="/journeys"
              className="mb-4 inline-block text-sm text-[#6366F1] hover:underline"
            >
              ← Back to Journeys
            </Link>
            <h1 className="mb-2 text-4xl font-semibold text-[#2D2D2D]">
              {journey.title}
            </h1>
            <p className="mb-6 text-lg text-[#2D2D2D]/70">
              {journey.description}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-[#2D2D2D]/70">
                <Clock className="h-4 w-4" />
                <span>~{journey.totalHours} hours</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#2D2D2D]/70">
                <Users className="h-4 w-4" />
                <span>{journey.games?.length || 0} games</span>
              </div>
              {journey.isCurated && (
                <span className="rounded-md bg-[#6366F1] px-3 py-1 text-xs font-semibold text-white">
                  Curated
                </span>
              )}
            </div>
          </div>
        </section>

        <div className="container mx-auto px-6 py-12">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Emotional Arc Chart */}
              {chartData.length > 0 && (
                <div className="mb-8 rounded-lg border border-[#E5E5E5] bg-white p-6">
                  <h2 className="mb-4 text-xl font-semibold text-[#2D2D2D]">
                    Emotional Arc
                  </h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                        <XAxis dataKey="game" stroke="#2D2D2D" />
                        <YAxis stroke="#2D2D2D" />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="joy"
                          stroke="#10B981"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="melancholy"
                          stroke="#6366F1"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="tension"
                          stroke="#EF4444"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="wonder"
                          stroke="#F59E0B"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Game Timeline */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-[#2D2D2D]">
                  Journey Timeline
                </h2>
                {journey.games?.map((gameItem: any, index: number) => (
                  <motion.div
                    key={gameItem.gameId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 rounded-lg border border-[#E5E5E5] bg-white p-6"
                  >
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6366F1] text-lg font-semibold text-white">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-2 text-lg font-semibold text-[#2D2D2D]">
                        {gameItem.name || `Game ${index + 1}`}
                      </h3>
                      {gameItem.description && (
                        <p className="mb-3 text-sm text-[#2D2D2D]/70">
                          {gameItem.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4">
                        <button className="rounded-lg border border-[#E5E5E5] bg-white px-4 py-2 text-sm font-medium text-[#2D2D2D] transition-colors hover:bg-[#F5F5F5]">
                          View Details
                        </button>
                        <button className="flex items-center gap-2 rounded-lg border border-[#E5E5E5] bg-white px-4 py-2 text-sm font-medium text-[#2D2D2D] transition-colors hover:bg-[#F5F5F5]">
                          <CheckCircle2 className="h-4 w-4" />
                          Mark as Played
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="rounded-lg border border-[#E5E5E5] bg-white p-6">
                <h3 className="mb-4 text-lg font-semibold text-[#2D2D2D]">
                  Journey Stats
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#2D2D2D]/70">Total Games</span>
                    <span className="font-medium text-[#2D2D2D]">
                      {journey.games?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#2D2D2D]/70">Estimated Time</span>
                    <span className="font-medium text-[#2D2D2D]">
                      ~{journey.totalHours}h
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full rounded-lg bg-[#6366F1] px-6 py-3 font-medium text-white transition-colors hover:bg-[#4F46E5]">
                  Start Journey
                </button>
                <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#E5E5E5] bg-white px-6 py-3 font-medium text-[#2D2D2D] transition-colors hover:bg-[#F5F5F5]">
                  <GitFork className="h-4 w-4" />
                  Fork & Customize
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

