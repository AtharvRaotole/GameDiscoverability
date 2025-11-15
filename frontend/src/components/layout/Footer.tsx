"use client";

import Link from "next/link";
import { Gamepad2, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white py-12">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Gamepad2 className="h-6 w-6 text-[#6366F1]" />
                <Heart className="h-4 w-4 text-[#6366F1]" />
              </div>
              <span className="text-xl font-semibold text-[#2D2D2D]">
                GameSoul
              </span>
            </Link>
            <p className="text-sm text-[#2D2D2D]/70">
              Discover games through emotional fingerprinting
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-[#2D2D2D]">
              Product
            </h3>
            <ul className="space-y-2 text-sm text-[#2D2D2D]/70">
              <li>
                <Link href="/discover" className="hover:text-[#6366F1]">
                  Discover
                </Link>
              </li>
              <li>
                <Link href="/journeys" className="hover:text-[#6366F1]">
                  Journeys
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-[#6366F1]">
                  Explore
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-[#2D2D2D]">
              Company
            </h3>
            <ul className="space-y-2 text-sm text-[#2D2D2D]/70">
              <li>
                <Link href="/about" className="hover:text-[#6366F1]">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#6366F1]">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#6366F1]">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-[#2D2D2D]">
              Legal
            </h3>
            <ul className="space-y-2 text-sm text-[#2D2D2D]/70">
              <li>
                <Link href="/privacy" className="hover:text-[#6366F1]">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#6366F1]">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-black/10 pt-8 text-center text-sm text-[#2D2D2D]/70">
          <p>© {new Date().getFullYear()} GameSoul. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

