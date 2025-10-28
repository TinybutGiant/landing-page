import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthUser, signUp, login, logout, getUserData, isAuthenticated } from "@/lib/auth";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  signUp: (userData: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const result = await login(username, password);
      
      if (result.success && result.user) {
        setUser(result.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (userData: any): Promise<boolean> => {
    try {
      setLoading(true);
      const result = await signUp(userData);
      
      if (result.success && result.user) {
        setUser(result.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
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
      login: handleLogin,
      logout: handleLogout,
      signUp: handleSignUp
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

