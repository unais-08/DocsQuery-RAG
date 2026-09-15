"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  type AuthUser,
  type LoginInput,
  type RegisterInput,
} from "@/lib/api/auth";

const AUTH_STORAGE_KEY = "querydocs-auth-token";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getStoredToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(AUTH_STORAGE_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const persistToken = useCallback((nextToken: string | null) => {
    if (typeof window === "undefined") {
      return;
    }

    if (nextToken) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, nextToken);
      return;
    }

    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const clearSession = useCallback(() => {
    setUser(null);
    setToken(null);
    persistToken(null);
  }, [persistToken]);

  const refreshSession = useCallback(async () => {
    const storedToken = getStoredToken();

    if (!storedToken) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    try {
      const currentUser = await getCurrentUser(storedToken);
      setUser(currentUser);
      setToken(storedToken);
    } catch {
      clearSession();
    } finally {
      setLoading(false);
    }
  }, [clearSession]);

  useEffect(() => {
    void Promise.resolve().then(refreshSession);
  }, [refreshSession]);

  const login = useCallback(
    async (input: LoginInput) => {
      const response = await loginUser(input);
      persistToken(response.token);
      setToken(response.token);
      setUser(response.user);
    },
    [persistToken],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      const response = await registerUser(input);
      persistToken(response.token);
      setToken(response.token);
      setUser(response.user);
    },
    [persistToken],
  );

  const logout = useCallback(async () => {
    await logoutUser();
    clearSession();
  }, [clearSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout,
      refreshSession,
    }),
    [login, logout, refreshSession, register, token, user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
