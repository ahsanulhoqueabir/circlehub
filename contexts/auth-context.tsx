"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import type { UserProfile } from "@/types/auth.types";

// Auth Context Type
interface AuthContextType {
  user: UserProfile | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  university?: string;
  studentId?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACCESS_TOKEN_KEY = "campus_connect_access_token";
const REFRESH_TOKEN_KEY = "campus_connect_refresh_token";
const USER_KEY = "campus_connect_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear refresh timer on unmount
  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, []);

  // Auto-refresh access token before expiry
  const scheduleTokenRefresh = useCallback((expiresIn: number) => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    // Refresh token 1 minute before expiry
    const refreshTime = Math.max(0, (expiresIn - 60) * 1000);

    refreshTimerRef.current = setTimeout(async () => {
      await refreshAccessToken();
    }, refreshTime);
  }, []);

  // Refresh access token using refresh token
  const refreshAccessToken = useCallback(async () => {
    try {
      const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

      if (!storedRefreshToken) {
        logout();
        return;
      }

      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.accessToken) {
          setAccessToken(data.accessToken);
          localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);

          // Schedule next refresh
          if (data.expiresIn) {
            scheduleTokenRefresh(data.expiresIn);
          }
        }
      } else {
        // Refresh token is invalid or expired, logout user
        logout();
      }
    } catch (error) {
      console.error("Error refreshing access token:", error);
      logout();
    }
  }, [scheduleTokenRefresh]);

  // Load user from localStorage and verify token on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedAccessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (storedAccessToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);

          // Set user, token and loading state together
          setAccessToken(storedAccessToken);
          setUser(parsedUser);
          setIsLoading(false);

          // Verify token and fetch fresh user data in background
          fetchCurrentUser(storedAccessToken).catch((err) => {
            console.error("Failed to verify user:", err);
            // Don't clear user data if verification fails, token might still be valid
          });
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error loading user:", error);
        // Clear invalid data
        clearAuthData();
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Fetch current user from API using token
  const fetchCurrentUser = async (authToken: string) => {
    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
          localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        }
      } else {
        // Token is invalid, try to refresh
        await refreshAccessToken();
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  };

  // Refresh user data
  const refreshUser = useCallback(async () => {
    if (accessToken) {
      await fetchCurrentUser(accessToken);
    }
  }, [accessToken]);

  // Clear auth data
  const clearAuthData = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setAccessToken(null);
    setUser(null);
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.user && data.tokens) {
        setUser(data.user);
        setAccessToken(data.tokens.accessToken);
        localStorage.setItem(ACCESS_TOKEN_KEY, data.tokens.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, data.tokens.refreshToken);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));

        // Schedule token refresh
        if (data.tokens.expiresIn) {
          scheduleTokenRefresh(data.tokens.expiresIn);
        }
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Google Sign In function
  const loginWithGoogle = async () => {
    try {
      const response = await fetch("/api/auth/google", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Google sign-in failed");
      }

      if (data.url) {
        // Redirect to Google OAuth URL
        window.location.href = data.url;
      } else {
        throw new Error("No OAuth URL received");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    }
  };

  // Register function
  const register = async (data: RegisterData) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Registration failed");
      }

      // Registration successful, don't auto-login
      // User needs to login manually after registration
      return;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    clearAuthData();
  };

  const value: AuthContextType = {
    user,
    accessToken,
    isLoading,
    isAuthenticated: !!user && !!accessToken,
    login,
    loginWithGoogle,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
