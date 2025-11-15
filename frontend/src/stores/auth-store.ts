/**
 * Auth Store - Manages user authentication and guest mode
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthStore {
  user: User | null;
  isGuest: boolean;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  setGuestMode: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isGuest: false,
      isAuthenticated: false,

      login: (user: User) => {
        set({ user, isGuest: false, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, isGuest: false, isAuthenticated: false });
      },

      setGuestMode: () => {
        set({ 
          user: { id: "guest", email: "guest@gamesoul.com", username: "Guest" },
          isGuest: true, 
          isAuthenticated: false 
        });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

