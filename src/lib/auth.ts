// Authentication persistence utilities for the landing-page project.

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  fullName: string | null;
  isGuide: boolean;
  role: 'traveler' | 'guide' | string;
  profilePicture?: string | null;
  readReceiptsEnabled: boolean;
  joinedDate: string | null;
  token: string;
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
 * Log out the current user
 */
export function logout(): void {
  clearAuthData();
  console.log("User logged out successfully");
}
