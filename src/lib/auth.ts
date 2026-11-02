// Authentication persistence utilities for the landing-page project.
const AUTH_TOKEN_KEY = "yaotu_token";
const AUTH_USER_KEY = "yaotu_user";
const AUTH_USER_ID_KEY = "yaotu_user_id";

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
  localStorage.setItem(AUTH_TOKEN_KEY, token);

  const { token: _, ...userDataWithoutToken } = userData;

  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userDataWithoutToken));
  localStorage.setItem(AUTH_USER_ID_KEY, userData.id.toString());
}

/**
 * Clear all authentication data
 */
export function clearAuthData(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(AUTH_USER_ID_KEY);
}

/**
 * Get the stored authentication token
 */
export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

/**
 * Get the stored user id, or null when no user is stored.
 */
export function getStoredUserId(): number | null {
  const storedUserId = localStorage.getItem(AUTH_USER_ID_KEY);
  return storedUserId ? Number(storedUserId) : null;
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
