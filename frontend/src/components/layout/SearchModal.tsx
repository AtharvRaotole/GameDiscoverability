"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Search as SearchIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 20) {
      router.push(`/discover?q=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[#12182B] border border-white/10 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#F9FAFB]">Search Games</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-[#1A2235] transition-colors"
              >
                <X className="w-5 h-5 text-[#D1D5DB]" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Describe the emotions you want to feel..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#1A2235]/50 border border-white/10 text-[#F9FAFB] placeholder:text-[#9CA3AF] focus:border-[#A855F7]/50 focus:outline-none transition-all"
                  autoFocus
                />
              </div>
              <p className="mt-2 text-xs text-[#9CA3AF]">
                Minimum 20 characters required
              </p>
              <button
                type="submit"
                disabled={searchQuery.trim().length < 20}
                className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white font-semibold hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Search
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

