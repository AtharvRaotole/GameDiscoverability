"use client";

import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import type { TimelineEntry } from "@/lib/types";

interface EmotionalTimelineProps {
  timeline: TimelineEntry[];
}

export function EmotionalTimeline({ timeline }: EmotionalTimelineProps) {
  // Prepare chart data
  const chartData = timeline.map((entry, index) => ({
    game: entry.gameName,
    index: index + 1,
    joy: (entry.emotionProfile.joy || 0) * 100,
    melancholy: (entry.emotionProfile.melancholy || 0) * 100,
    tension: (entry.emotionProfile.tension || 0) * 100,
    wonder: (entry.emotionProfile.wonder || 0) * 100,
    nostalgia: (entry.emotionProfile.nostalgia || 0) * 100,
    catharsis: (entry.emotionProfile.catharsis || 0) * 100,
    comfort: (entry.emotionProfile.comfort || 0) * 100,
    challenge: (entry.emotionProfile.challenge || 0) * 100,
  }));

  if (timeline.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#12182B]/50 backdrop-blur-sm p-8 text-center">
        <p className="text-[#D1D5DB]">
          Complete some games to see your emotional journey!
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-[#12182B]/50 backdrop-blur-sm p-6">
      <p className="mb-4 text-sm text-[#D1D5DB]">
        Your emotional progression through completed games
      </p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="game"
              stroke="#D1D5DB"
              tick={{ fontSize: 12, fill: "#D1D5DB" }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              stroke="#D1D5DB"
              domain={[0, 100]}
              tick={{ fontSize: 12, fill: "#D1D5DB" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#12182B",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#F9FAFB",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="joy"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Joy"
            />
            <Line
              type="monotone"
              dataKey="melancholy"
              stroke="#6366F1"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Melancholy"
            />
            <Line
              type="monotone"
              dataKey="wonder"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Wonder"
            />
            <Line
              type="monotone"
              dataKey="catharsis"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Catharsis"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Timeline List */}
      <div className="mt-6 space-y-3">
        {timeline.map((entry, index) => (
          <motion.div
            key={entry.gameId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#1A2235]/50 p-4"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-sm font-semibold text-white">
              {index + 1}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-[#F9FAFB]">{entry.gameName}</h4>
              <p className="text-xs text-[#9CA3AF]">
                {new Date(entry.completedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-1">
              {Object.entries(entry.emotionProfile)
                .filter(([_, value]) => value && value > 0.5)
                .slice(0, 3)
                .map(([emotion]) => (
                  <span
                    key={emotion}
                    className="rounded-md bg-[#A855F7]/10 border border-[#A855F7]/20 px-2 py-0.5 text-xs text-[#A855F7]"
                  >
                    {emotion}
                  </span>
                ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

