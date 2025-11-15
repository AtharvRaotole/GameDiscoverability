"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useKeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        router.push("/");
        // Focus search input if available
        setTimeout(() => {
          const input = document.querySelector("textarea");
          input?.focus();
        }, 100);
      }

      // Escape to close modals
      if (e.key === "Escape") {
        // This is handled by individual modals
      }

      // ? to show shortcuts help
      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        // TODO: Show shortcuts modal
        console.log("Keyboard shortcuts:");
        console.log("Cmd/Ctrl + K: Search");
        console.log("Escape: Close modals");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);
}

