"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GamepadIcon, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    setIsLoading(true);
    // TODO: Implement actual signup API call
    // For now, create a mock user with proper UUID
    setTimeout(() => {
      login({
        id: crypto.randomUUID(),
        email: formData.email,
        username: formData.username,
      });
      setIsLoading(false);
      router.push("/");
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0E1A]">
      <Header />
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-[#A855F7] to-[#EC4899] rounded-xl">
                  <GamepadIcon className="w-8 h-8 text-white" />
                </div>
                <span className="text-3xl font-bold text-gradient">GameSoul</span>
              </div>
              <h1 className="text-3xl font-bold text-[#F9FAFB] mb-2">Create Account</h1>
              <p className="text-[#D1D5DB]">Start your emotional gaming journey</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#12182B]/50 border border-white/10 text-[#F9FAFB] placeholder:text-[#9CA3AF] focus:border-[#A855F7]/50 focus:outline-none transition-all"
                    placeholder="username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#12182B]/50 border border-white/10 text-[#F9FAFB] placeholder:text-[#9CA3AF] focus:border-[#A855F7]/50 focus:outline-none transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#12182B]/50 border border-white/10 text-[#F9FAFB] placeholder:text-[#9CA3AF] focus:border-[#A855F7]/50 focus:outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#12182B]/50 border border-white/10 text-[#F9FAFB] placeholder:text-[#9CA3AF] focus:border-[#A855F7]/50 focus:outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white font-semibold hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Login link */}
            <p className="mt-6 text-center text-sm text-[#D1D5DB]">
              Already have an account?{" "}
              <Link href="/login" className="text-[#A855F7] hover:text-[#EC4899] transition-colors font-medium">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
