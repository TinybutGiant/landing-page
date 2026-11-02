import { resolveApiUrl } from "./apiClient";
import { getAuthToken } from "./auth";

export async function apiRequest(method: string, url: string, data?: any) {
  const yaotuToken = getAuthToken();
  const fullUrl = resolveApiUrl(url);

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(yaotuToken && { Authorization: `Bearer ${yaotuToken}` }),
    },
  };

  if (data && method !== "GET") {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(fullUrl, config);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
