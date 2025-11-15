"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import type { FilterState } from "@/lib/types";

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onApply: () => void;
}

export function FilterPanel({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onApply,
}: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  const handleChange = (key: keyof FilterState, value: any) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onApply();
    onClose();
  };

  const handleReset = () => {
    const defaultFilters: FilterState = {
      soulScoreRange: [0, 100],
      priceRange: [0, 60],
      genres: [],
      releaseYearRange: [2010, new Date().getFullYear()],
      playerMode: [],
      gameLength: [],
    };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
    onApply();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#12182B] border-l border-white/10 shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <SlidersHorizontal className="w-5 h-5 text-[#A855F7]" />
                  <h2 className="text-xl font-bold text-[#F9FAFB]">Filters</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-[#1A2235] transition-colors"
                >
                  <X className="w-5 h-5 text-[#D1D5DB]" />
                </button>
              </div>

              {/* Soul Score Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#D1D5DB] mb-3">
                  Soul Score: {localFilters.soulScoreRange[0]} - {localFilters.soulScoreRange[1]}
                </label>
                <div className="flex gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={localFilters.soulScoreRange[0]}
                    onChange={(e) =>
                      handleChange("soulScoreRange", [
                        parseInt(e.target.value),
                        localFilters.soulScoreRange[1],
                      ])
                    }
                    className="flex-1 accent-[#A855F7]"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={localFilters.soulScoreRange[1]}
                    onChange={(e) =>
                      handleChange("soulScoreRange", [
                        localFilters.soulScoreRange[0],
                        parseInt(e.target.value),
                      ])
                    }
                    className="flex-1 accent-[#A855F7]"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#D1D5DB] mb-3">
                  Price: ${localFilters.priceRange[0]} - ${localFilters.priceRange[1]}
                </label>
                <div className="flex gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={localFilters.priceRange[0]}
                    onChange={(e) =>
                      handleChange("priceRange", [
                        parseInt(e.target.value),
                        localFilters.priceRange[1],
                      ])
                    }
                    className="flex-1 accent-[#EC4899]"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={localFilters.priceRange[1]}
                    onChange={(e) =>
                      handleChange("priceRange", [
                        localFilters.priceRange[0],
                        parseInt(e.target.value),
                      ])
                    }
                    className="flex-1 accent-[#EC4899]"
                  />
                </div>
              </div>

              {/* Release Year Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#D1D5DB] mb-3">
                  Release Year: {localFilters.releaseYearRange[0]} - {localFilters.releaseYearRange[1]}
                </label>
                <div className="flex gap-4">
                  <input
                    type="range"
                    min="2000"
                    max={new Date().getFullYear()}
                    value={localFilters.releaseYearRange[0]}
                    onChange={(e) =>
                      handleChange("releaseYearRange", [
                        parseInt(e.target.value),
                        localFilters.releaseYearRange[1],
                      ])
                    }
                    className="flex-1 accent-[#3B82F6]"
                  />
                  <input
                    type="range"
                    min="2000"
                    max={new Date().getFullYear()}
                    value={localFilters.releaseYearRange[1]}
                    onChange={(e) =>
                      handleChange("releaseYearRange", [
                        localFilters.releaseYearRange[0],
                        parseInt(e.target.value),
                      ])
                    }
                    className="flex-1 accent-[#3B82F6]"
                  />
                </div>
              </div>

              {/* Player Mode */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#D1D5DB] mb-3">
                  Player Mode
                </label>
                <div className="flex flex-wrap gap-2">
                  {(["Solo", "Co-op", "Multiplayer"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => {
                        const newModes = localFilters.playerMode.includes(mode)
                          ? localFilters.playerMode.filter((m) => m !== mode)
                          : [...localFilters.playerMode, mode];
                        handleChange("playerMode", newModes);
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        localFilters.playerMode.includes(mode)
                          ? "bg-[#A855F7] text-white"
                          : "bg-[#1A2235] text-[#D1D5DB] hover:bg-[#1A2235]/80"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-8">
                <button
                  onClick={handleReset}
                  className="flex-1 px-4 py-3 rounded-xl bg-[#1A2235] text-[#D1D5DB] font-medium hover:bg-[#1A2235]/80 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={handleApply}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white font-medium hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

