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
  emailVerified?: boolean;
  emailverified?: boolean;
  joinedDate: string | null;
  token: string;
}

/**
 * Store authentication data consistently
 */
export function storeAuthData(token: string, userData: AuthUser): void {
  localStorage.setItem("yaotu_token", token);

  const { token: _, ...userDataWithoutToken } = userData;

  localStorage.setItem("yaotu_user", JSON.stringify(userDataWithoutToken));
  localStorage.setItem("yaotu_user_id", userData.id.toString());
}

/**
 * Clear all authentication data
 */
export function clearAuthData(): void {
  localStorage.removeItem("yaotu_token");
  localStorage.removeItem("yaotu_user");
  localStorage.removeItem("yaotu_user_id");
}

/**
 * Get the stored authentication token
 */
export function getAuthToken(): string | null {
  return localStorage.getItem("yaotu_token");
}

/**
 * Restore a persisted session from the server-authoritative current user.
 */
export async function restoreAuthSession(
  validateToken: (token: string) => Promise<AuthUser>
): Promise<AuthUser | null> {
  const token = getAuthToken();
  if (!token) {
    clearAuthData();
    return null;
  }

  try {
    const serverUser = await validateToken(token);
    if (getAuthToken() !== token) return null;

    const authenticatedUser = { ...serverUser, token };
    storeAuthData(token, authenticatedUser);
    return authenticatedUser;
  } catch {
    if (getAuthToken() === token) clearAuthData();
    return null;
  }
}

/**
 * Log out the current user
 */
export function logout(): void {
  clearAuthData();
}
