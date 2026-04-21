import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AUTH_TOKEN_EVENT, getAuthToken } from "@/lib/api/client";
import { useCurrentUser, useLogout } from "@/hooks/api/useAuth";
import type { Role } from "@/lib/api/types";

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  role?: Role;
  userId?: string;
  tenantId?: string;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getAuthToken());
  const meQuery = useCurrentUser(!!token);
  const logout = useLogout();

  useEffect(() => {
    const syncToken = () => setToken(getAuthToken());
    const onStorage = (event: StorageEvent) => {
      if (event.key === "goai_token") syncToken();
    };
    window.addEventListener(AUTH_TOKEN_EVENT, syncToken);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(AUTH_TOKEN_EVENT, syncToken);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(token) && Boolean(meQuery.data?.user),
      isLoading: !!token && meQuery.isLoading,
      role: meQuery.data?.user?.role,
      userId: meQuery.data?.user?.id,
      tenantId: meQuery.data?.tenant?.id,
      logout,
    }),
    [logout, meQuery.data?.tenant?.id, meQuery.data?.user, meQuery.isLoading, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return value;
}
