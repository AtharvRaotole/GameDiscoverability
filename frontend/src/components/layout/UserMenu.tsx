"use client";

import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Settings, BookOpen, Heart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useState, useRef, useEffect } from "react";

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserMenu({ isOpen, onClose }: UserMenuProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleLogout = () => {
    logout();
    onClose();
    router.push("/welcome");
  };

  const menuItems = [
    { icon: BookOpen, label: "My Library", href: "/library" },
    { icon: Heart, label: "Wishlist", href: "/library?tab=wishlist" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-[#12182B] border border-white/10 shadow-2xl z-50 overflow-hidden"
        >
          <div className="p-2">
            {/* User info */}
            {user && (
              <div className="px-4 py-3 border-b border-white/10 mb-2">
                <p className="text-sm font-semibold text-[#F9FAFB]">{user.username}</p>
                <p className="text-xs text-[#9CA3AF]">{user.email}</p>
              </div>
            )}

            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#D1D5DB] hover:bg-[#1A2235] hover:text-[#F9FAFB] transition-all"
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#EC4899] hover:bg-[#1A2235] transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

