"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useDiscoveryStore } from "@/stores/discovery-store";
import { PLACEHOLDER_EXAMPLES } from "@/lib/constants";
import { api } from "@/lib/api";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmotionTag {
  word: string;
  intensity: number;
  category: string;
}

export function EmotionInput() {
  const router = useRouter();
  const { setQuery, setLoading } = useDiscoveryStore();
  const [input, setInput] = useState("");
  const [emotionTags, setEmotionTags] = useState<EmotionTag[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Restore draft from localStorage
  useEffect(() => {
    const draft = localStorage.getItem("emotion-input-draft");
    if (draft) {
      setInput(draft);
      setCharCount(draft.length);
    }
  }, []);

  // Auto-save draft
  useEffect(() => {
    if (input.length > 0) {
      const timer = setTimeout(() => {
        localStorage.setItem("emotion-input-draft", input);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [input]);

  // Cycle placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_EXAMPLES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Extract emotions with debounce
  const extractEmotions = useCallback(async (text: string) => {
    if (text.length < 20) {
      setEmotionTags([]);
      return;
    }

    setIsExtracting(true);
    try {
      const tags = await api.extractEmotions(text);
      setEmotionTags(tags);
    } catch (error: any) {
      // Silently handle errors - backend might be down
      // Emotion extraction is a nice-to-have feature, not critical
      if (error?.status !== 0) {
        // Only log non-connection errors
        console.error("Failed to extract emotions:", error);
      }
      // Continue without tags on error
      setEmotionTags([]);
    } finally {
      setIsExtracting(false);
    }
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    setCharCount(value.length);

    // Debounce emotion extraction
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (value.length >= 20) {
        extractEmotions(value);
      } else {
        setEmotionTags([]);
      }
    }, 800);
  };

  // Handle submit
  const handleSubmit = async () => {
    if (input.length < 20 || input.length > 500) return;

    setQuery(input);
    setLoading(true);
    // Clear draft on submit
    localStorage.removeItem("emotion-input-draft");
    // Navigate to discover page with query parameter
    router.push(`/discover?q=${encodeURIComponent(input)}`);
  };

  // Remove emotion tag
  const removeTag = (word: string) => {
    setEmotionTags((prev) => prev.filter((tag) => tag.word !== word));
  };

  // Clear input
  const clearInput = () => {
    setInput("");
    setCharCount(0);
    setEmotionTags([]);
    localStorage.removeItem("emotion-input-draft");
    textareaRef.current?.focus();
  };

  const isValid = charCount >= 20 && charCount <= 500;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="max-w-4xl mx-auto"
    >
      {/* Input Container */}
      <div className="relative group">
        {/* Glow effect */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-r from-[#A855F7] via-[#EC4899] to-[#F59E0B] rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500",
            isFocused && "opacity-30"
          )}
        />

        {/* Input box */}
        <div
          className={cn(
            "relative bg-[#12182B]/80 backdrop-blur-xl border rounded-3xl transition-all duration-300",
            isFocused
              ? "border-[#A855F7]/50 shadow-[0_0_20px_rgba(168,85,247,0.5)]"
              : "border-white/10"
          )}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => {
              // Handle Enter key (but allow Shift+Enter for new lines)
              if (e.key === "Enter" && !e.shiftKey && isValid) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder={PLACEHOLDER_EXAMPLES[placeholderIndex]}
            className="w-full h-40 px-8 py-6 bg-transparent text-[#F9FAFB] placeholder:text-[#9CA3AF] text-lg resize-none focus:outline-none"
            maxLength={500}
          />

          {/* Character counter */}
          <div className="px-8 pb-4 flex items-center justify-between">
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                charCount < 20
                  ? "text-[#9CA3AF]"
                  : charCount > 450
                  ? "text-[#EC4899]"
                  : "text-[#06B6D4]"
              )}
            >
              {charCount}/500 {charCount < 20 && "(minimum 20 characters)"}
            </span>

            {/* AI indicator */}
            {input.length > 10 && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-[#A855F7] text-sm"
              >
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>Analyzing emotions...</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Emotion Tags */}
      <AnimatePresence>
        {emotionTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-wrap gap-3 mt-6 justify-center"
          >
            {emotionTags.map((tag, index) => (
              <motion.div
                key={tag.word}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#A855F7] to-[#EC4899] rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                <div className="relative flex items-center gap-2 px-5 py-2.5 bg-[#12182B]/80 backdrop-blur-sm border border-[#A855F7]/30 rounded-full text-[#F9FAFB] font-medium">
                  <Sparkles className="w-4 h-4 text-[#A855F7]" />
                  {tag.word}
                  <button
                    onClick={() => removeTag(tag.word)}
                    className="ml-1 hover:text-[#EC4899] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Discover Button */}
      <motion.button
        onClick={handleSubmit}
        disabled={!isValid}
        className={cn(
          "mt-8 w-full py-5 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-300 group",
          isValid
            ? "bg-gradient-to-r from-[#A855F7] via-[#EC4899] to-[#F59E0B] text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] hover:scale-[1.02] animate-pulse-glow"
            : "bg-[#1A2235] text-[#9CA3AF] cursor-not-allowed"
        )}
      >
        <span>Discover Your Games</span>
        {isValid && (
          <ArrowRight
            className={cn(
              "w-5 h-5 transition-transform",
              isValid && "group-hover:translate-x-1"
            )}
          />
        )}
      </motion.button>

      {/* Helper text */}
      <p className="text-center text-[#9CA3AF] text-sm mt-4">
        Press <kbd className="px-2 py-1 bg-[#1A2235] rounded text-[#D1D5DB]">Enter</kbd> or click the button to search
      </p>
    </motion.div>
  );
}
