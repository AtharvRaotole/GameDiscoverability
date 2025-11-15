"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Search, User, Menu, X, GamepadIcon, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { SearchModal } from "./SearchModal";
import { UserMenu } from "./UserMenu";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isGuest, logout } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  const handleLogout = () => {
    logout();
    router.push("/welcome");
  };

  const headerOpacity = useTransform(scrollY, [0, 100], [0.8, 0.95]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Discover", href: "/discover" },
    { name: "Explore", href: "/explore" },
    { name: "Journeys", href: "/journeys" },
    { name: "Library", href: "/library" },
  ];

  return (
    <motion.header
      style={{
        opacity: headerOpacity,
      }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "py-3" : "py-4"
      )}
    >
      <div className="absolute inset-0 bg-[#0A0E1A]/80 backdrop-blur-xl border-b border-white/5" />

      <div className="container mx-auto px-6 relative">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#A855F7] to-[#EC4899] rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity" />
              <div className="relative p-2 bg-gradient-to-r from-[#A855F7] to-[#EC4899] rounded-xl">
                <GamepadIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <span className="text-2xl font-bold text-gradient">GameSoul</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors relative group",
                  pathname === link.href
                    ? "text-[#A855F7]"
                    : "text-[#D1D5DB] hover:text-[#F9FAFB]"
                )}
              >
                {link.name}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[#A855F7] to-[#EC4899] transition-all duration-300",
                    pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  )}
                />
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Search Icon */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 rounded-xl bg-[#12182B]/50 border border-white/5 hover:border-[#A855F7]/30 text-[#D1D5DB] hover:text-[#F9FAFB] transition-all duration-300"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            </div>

            {/* User Icon */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="p-2.5 rounded-xl bg-[#12182B]/50 border border-white/5 hover:border-[#A855F7]/30 text-[#D1D5DB] hover:text-[#F9FAFB] transition-all duration-300"
                aria-label="User menu"
              >
                <User className="w-5 h-5" />
              </button>
              <UserMenu isOpen={isUserMenuOpen} onClose={() => setIsUserMenuOpen(false)} />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl bg-[#12182B]/50 border border-white/5 hover:border-[#A855F7]/30 text-[#D1D5DB] hover:text-[#F9FAFB] transition-all duration-300 md:hidden"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4"
          >
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-xl bg-[#12182B]/50 border border-white/5 hover:border-[#A855F7]/30 text-[#D1D5DB] hover:text-[#F9FAFB] transition-all duration-300",
                    pathname === link.href && "border-[#A855F7]/30 text-[#A855F7]"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
