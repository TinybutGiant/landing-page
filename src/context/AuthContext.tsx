import React, { createContext, useContext, useState, useEffect } from "react";
import type { SignInSuccess } from "@yaotu/auth";
import { AuthUser, logout, getUserData, isAuthenticated, storeAuthData } from "@/lib/auth";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  completeAuthSession: (result: SignInSuccess) => Promise<AuthUser>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function normalizePackageAuthUser(result: SignInSuccess): AuthUser {
  return {
    ...result,
    fullName: result.fullName ?? "",
    isGuide: result.isGuide ?? result.role === "guide",
    role: result.role,
    profilePicture: result.profilePicture ?? undefined,
    readReceiptsEnabled: result.readReceiptsEnabled ?? true,
    joinedDate: result.joinedDate ?? "",
    token: result.token,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const userData = getUserData();
        if (userData) {
          console.log('AuthContext: Found existing user data:', userData);
          setUser(userData);
        } else {
          console.log('AuthContext: No existing user data found');
        }
      } catch (error) {
        console.error('AuthContext: Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  const completeAuthSession = async (result: SignInSuccess): Promise<AuthUser> => {
    try {
      setLoading(true);
      const authUser = normalizePackageAuthUser(result);
      storeAuthData(result.token, authUser);
      setUser(authUser);
      return authUser;
    } finally {
      setLoading(false);
    }
  };

  // 计算认证状态，优先使用user状态，如果没有则检查localStorage
  const authStatus = user ? true : (() => {
    try {
      return isAuthenticated();
    } catch {
      return false;
    }
  })();

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAuthenticated: authStatus,
      logout: handleLogout,
      completeAuthSession
    }}>
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

