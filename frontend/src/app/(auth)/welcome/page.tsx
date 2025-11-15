"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, GamepadIcon, User, Eye, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import Link from "next/link";

export default function WelcomePage() {
  const router = useRouter();
  const { setGuestMode, isAuthenticated } = useAuthStore();

  const handleGuestMode = () => {
    setGuestMode();
    router.push("/");
  };

  // If already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-[#0A0E1A] relative overflow-hidden flex items-center justify-center">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Purple orb */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-[#A855F7]/20 to-[#EC4899]/20 blur-3xl"
          style={{
            left: "10%",
            top: "20%",
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Pink orb */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[#EC4899]/20 to-[#F59E0B]/20 blur-3xl"
          style={{
            right: "10%",
            bottom: "20%",
          }}
          animate={{
            y: [0, 30, 0],
            x: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#A855F7] to-[#EC4899] rounded-2xl blur-xl opacity-50" />
              <div className="relative p-4 bg-gradient-to-r from-[#A855F7] to-[#EC4899] rounded-2xl">
                <GamepadIcon className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-[56px] font-bold text-[#F9FAFB] mb-6 leading-tight">
            Welcome to GameSoul
          </h1>

          {/* Subtitle with animated gradient underline */}
          <p className="text-xl text-[#D1D5DB] mb-2">
            Discover games through{" "}
            <span className="relative inline-block">
              <span className="relative z-10">emotion</span>
              <motion.span
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#A855F7] to-[#EC4899] rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              />
            </span>
            , not just genre
          </p>
        </motion.div>

        {/* Auth Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Sign Up Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="group"
          >
            <div className="h-full bg-[#12182B]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-10 hover:border-[#A855F7]/30 hover:-translate-y-1 transition-all duration-300">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#A855F7] to-[#EC4899] flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-[#F9FAFB] text-center mb-3">
                Sign Up
              </h3>

              {/* Description */}
              <p className="text-base text-[#D1D5DB] text-center mb-8 leading-relaxed">
                Create an account to save your library, track your emotional journey, and create custom game sequences
              </p>

              {/* Button */}
              <Link href="/signup" className="block">
                <button className="w-full h-12 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white font-semibold text-base hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all duration-300 flex items-center justify-center gap-2">
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="group"
          >
            <div className="h-full bg-[#12182B]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-10 hover:border-[#A855F7]/30 hover:-translate-y-1 transition-all duration-300">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-[#F9FAFB] text-center mb-3">
                Login
              </h3>

              {/* Description */}
              <p className="text-base text-[#D1D5DB] text-center mb-8 leading-relaxed">
                Sign in to your existing account and continue your emotional gaming journey
              </p>

              {/* Button */}
              <Link href="/login" className="block">
                <button className="w-full h-12 rounded-xl bg-[#A855F7] text-white font-semibold text-base hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all duration-300 flex items-center justify-center gap-2">
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Guest Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="group"
          >
            <div className="h-full bg-[#12182B]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-10 hover:border-[#A855F7]/30 hover:-translate-y-1 transition-all duration-300">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#10B981] to-[#14B8A6] flex items-center justify-center">
                  <Eye className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-[#F9FAFB] text-center mb-3">
                Continue as Guest
              </h3>

              {/* Description */}
              <p className="text-base text-[#D1D5DB] text-center mb-8 leading-relaxed">
                Explore and discover games without signing up. Limited features available
              </p>

              {/* Button */}
              <button
                onClick={handleGuestMode}
                className="w-full h-12 rounded-xl border-2 border-white/20 bg-transparent text-white font-semibold text-base hover:scale-[1.02] hover:border-[#A855F7]/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all duration-300 flex items-center justify-center gap-2"
              >
                Explore
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
