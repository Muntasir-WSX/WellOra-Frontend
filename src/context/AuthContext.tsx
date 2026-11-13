"use client";

import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { apiRequest } from "@/lib/api";

export interface IAuthUser {
  id: string;
  name: string;
  email: string;
  role: "PATIENT" | "DOCTOR" | "ADMIN" | "SUPER_ADMIN";
  profilePhoto?: string;
  patient?: { profilePhoto?: string | null } | null;
  doctor?: { profilePhoto?: string | null } | null;
}

interface AuthContextType {
  user: IAuthUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IAuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const requestId = useRef(0);

  const refreshUser = useCallback(async () => {
    const currentRequestId = ++requestId.current;

    try {
      const res = await apiRequest<{ success: boolean; data: IAuthUser }>("/auth/me", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (currentRequestId === requestId.current) {
        setUser(res?.success && res?.data ? res.data : null);
      }
    } catch {
      if (currentRequestId === requestId.current) {
        setUser(null);
      }
    } finally {
      if (currentRequestId === requestId.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const logout = async () => {
    ++requestId.current;

    try {
      await apiRequest("/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
      }
      setUser(null);
      document.cookie = "accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie = "refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      window.location.replace("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};