// Authentication utilities for landing-page project
// Based on the main project's authentication system

import { api } from './apiClient';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  fullName: string;
  isGuide: boolean;
  role: 'traveler' | 'guide';
  profilePicture?: string;
  readReceiptsEnabled: boolean;
  joinedDate: string;
  token: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  emailUpdates?: boolean;
}

export interface LoginData {
  username: string;
  password: string;
}

/**
 * Store authentication data consistently
 */
export function storeAuthData(token: string, userData: AuthUser): void {
  // Store token
  localStorage.setItem("yaotu_token", token);
  console.log("Token stored successfully");
  
  // Store user data (without token)
  const { token: _, ...userDataWithoutToken } = userData;
  
  localStorage.setItem("yaotu_user", JSON.stringify(userDataWithoutToken));
  localStorage.setItem("yaotu_user_id", userData.id.toString());
  console.log("User data stored successfully");
}

/**
 * Clear all authentication data
 */
export function clearAuthData(): void {
  localStorage.removeItem("yaotu_token");
  localStorage.removeItem("yaotu_user");
  localStorage.removeItem("yaotu_user_id");
  console.log("Auth data cleared successfully");
}

/**
 * Get the stored authentication token
 */
export function getAuthToken(): string | null {
  return localStorage.getItem("yaotu_token");
}

/**
 * Check if the user is authenticated
 */
export function isAuthenticated(): boolean {
  const token = getAuthToken();
  const userData = localStorage.getItem("yaotu_user");
  return !!token && !!userData;
}

/**
 * Get stored user data
 */
export function getUserData(): AuthUser | null {
  const userData = localStorage.getItem("yaotu_user");
  if (!userData) return null;
  
  try {
    const parsed = JSON.parse(userData);
    // Add token from separate storage
    const token = getAuthToken();
    return token ? { ...parsed, token } : parsed;
  } catch (error) {
    console.error("Failed to parse user data from localStorage:", error);
    return null;
  }
}

/**
 * API base URL - use relative paths with vite proxy
 */
const API_BASE_URL = '';

/**
 * Sign up a new user
 */
export async function signUp(userData: SignupData): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    const data = await api.post('/api/auth/signup', userData);
    
    if (data.token) {
      // Store authentication data
      storeAuthData(data.token, data);
      return { success: true, user: data };
    } else {
      return { success: false, error: "No authentication token received" };
    }
  } catch (error: any) {
    console.error("Signup error:", error);
    return { success: false, error: error.message || "Network error occurred" };
  }
}

/**
 * Log in a user
 */
export async function login(username: string, password: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    const data = await api.post('/api/auth/login', { username, password });
    
    if (data.token) {
      // Store authentication data
      storeAuthData(data.token, data);
      return { success: true, user: data };
    } else {
      return { success: false, error: "No authentication token received" };
    }
  } catch (error: any) {
    console.error("Login error:", error);
    return { success: false, error: error.message || "Network error occurred" };
  }
}

/**
 * Log out the current user
 */
export function logout(): void {
  clearAuthData();
  console.log("User logged out successfully");
}

/**
 * Check username availability
 */
export async function checkUsernameAvailability(username: string): Promise<{ available: boolean; error?: string }> {
  try {
    const data = await api.get(`/api/auth/check-username?username=${encodeURIComponent(username)}`);
    return { available: data.available };
  } catch (error: any) {
    console.error("Error checking username:", error);
    return { available: false, error: error.message || "Network error occurred" };
  }
}

/**
 * Validate username format
 */
export function validateUsername(username: string): boolean {
  const usernameRegex = /^[a-z0-9]+$/;
  return usernameRegex.test(username) && username.length >= 3;
}

/**
 * Calculate password strength
 */
export function calculatePasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  let label = "";
  let color = "";

  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  if (score <= 2) {
    label = "Weak";
    color = "text-red-500";
  } else if (score <= 3) {
    label = "Medium";
    color = "text-yellow-500";
  } else {
    label = "Strong";
    color = "text-green-500";
  }

  return { score, label, color };
}
