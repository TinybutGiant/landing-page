import React, { createContext, useContext, useEffect, useState } from "react";
import type { AuthenticatedUser, SignInSuccess } from "@yaotu/auth";

import { resolveApiUrl } from "@/lib/apiClient";
import { logout, restoreAuthSession, storeAuthData } from "@/lib/auth";
import type { AuthUser } from "@/lib/auth";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  completeAuthSession: (result: SignInSuccess) => Promise<AuthUser>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function normalizeAuthUser(result: AuthenticatedUser, token: string): AuthUser {
  return {
    ...result,
    fullName: result.fullName ?? "",
    isGuide: result.isGuide ?? result.role === "guide",
    role: result.role,
    profilePicture: result.profilePicture ?? undefined,
    readReceiptsEnabled: result.readReceiptsEnabled ?? true,
    joinedDate: result.joinedDate ?? "",
    token,
  };
}

async function fetchCurrentAuthUser(token: string): Promise<AuthUser> {
  const response = await fetch(resolveApiUrl("/api/me"), {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`Current user validation failed: ${response.status}`);

  return normalizeAuthUser((await response.json()) as AuthenticatedUser, token);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void restoreAuthSession(fetchCurrentAuthUser).then((authenticatedUser) => {
      if (cancelled) return;
      if (authenticatedUser) setUser(authenticatedUser);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  const completeAuthSession = async (result: SignInSuccess): Promise<AuthUser> => {
    try {
      setLoading(true);
      const authUser = normalizeAuthUser(result, result.token);
      storeAuthData(result.token, authUser);
      setUser(authUser);
      return authUser;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        logout: handleLogout,
        completeAuthSession,
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
