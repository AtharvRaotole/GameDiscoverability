"use client";

import Link from "next/link";

export function SkipLink() {
  return (
    <Link
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-[#6366F1] focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2"
    >
      Skip to main content
    </Link>
  );
}

