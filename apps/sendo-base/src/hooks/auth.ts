"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  id: string;
  name: string;
  cpf: string;
  email?: string;
  role: "MEMBROS" | "ADMIN";
  isPastor?: boolean;
  image?: string;
  approvalStatus?: "PENDING" | "APPROVED" | "REJECTED";
};

type UserStore = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (updates: Partial<User>) => void;
};

export const useAuth = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user: User) =>
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        }),
      clearUser: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...updates },
          });
        }
      },
    }),
    {
      name: "@sendo-base:user",
    },
  ),
);
