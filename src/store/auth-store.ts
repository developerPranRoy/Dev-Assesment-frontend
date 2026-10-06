import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthResponse, User } from "@/types";

function setCookie(name: string, value: string, maxAgeSeconds = 60 * 60 * 24 * 30) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${value}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  companyId: string | null;
  hydrated: boolean;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
  setAccessToken: (accessToken: string) => void;
  setAuth: (auth: AuthResponse) => void;
  setCompanyId: (id: string) => void;
  clear: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      companyId: null,
      hydrated: false,
      isAuthenticated: false,
      setUser: (user) => {
        set({ user });
        setCookie("devassess-role", user.role);
      },
      setTokens: ({ accessToken, refreshToken }) => {
        set({ accessToken, refreshToken, isAuthenticated: !!accessToken });
        setCookie("devassess-session", "true");
      },
      setAccessToken: (accessToken) => {
        set({ accessToken, isAuthenticated: !!accessToken });
        setCookie("devassess-session", "true");
      },
      setAuth: ({ user, accessToken, refreshToken }) => {
        set({ user, accessToken, refreshToken, isAuthenticated: true });
        setCookie("devassess-session", "true");
        setCookie("devassess-role", user.role);
      },
      setCompanyId: (id) => set({ companyId: id }),
      clear: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          companyId: null,
          isAuthenticated: false,
        });
        deleteCookie("devassess-session");
        deleteCookie("devassess-role");
      },
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: "devassess-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        companyId: state.companyId,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
