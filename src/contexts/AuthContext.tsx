import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, UsageStatus, SubscriptionPlan } from "@/types/auth";
import { authApi, usageApi, setAccessToken, getAccessToken } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  usage: UsageStatus | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUsage: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [usage, setUsage] = useState<UsageStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUsage = useCallback(async () => {
    if (!getAccessToken()) return;
    try {
      const data = await usageApi.getStatus();
      setUsage({
        plan: data.plan as SubscriptionPlan,
        daily_used: data.daily_used,
        daily_limit: data.daily_limit,
        monthly_used: data.monthly_used,
        monthly_limit: data.monthly_limit,
        can_generate: data.can_generate,
      });
    } catch (error) {
      console.error("Failed to fetch usage:", error);
    }
  }, []);

  const fetchUser = useCallback(async () => {
    if (!getAccessToken()) {
      setIsLoading(false);
      return;
    }

    try {
      const data = await authApi.me();
      setUser({
        id: data.id,
        email: data.email,
        plan: data.plan as SubscriptionPlan,
        createdAt: new Date().toISOString(),
      });
      await refreshUsage();
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setAccessToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [refreshUsage]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    setAccessToken(response.access_token);
    setUser({
      id: response.user.id,
      email: response.user.email,
      plan: response.user.plan as SubscriptionPlan,
      createdAt: new Date().toISOString(),
    });
    await refreshUsage();
  };

  const register = async (email: string, password: string) => {
    const response = await authApi.register(email, password);
    setAccessToken(response.access_token);
    setUser({
      id: response.user.id,
      email: response.user.email,
      plan: response.user.plan as SubscriptionPlan,
      createdAt: new Date().toISOString(),
    });
    await refreshUsage();
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Ignore logout errors
    } finally {
      setAccessToken(null);
      setUser(null);
      setUsage(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        usage,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUsage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
