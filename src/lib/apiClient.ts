const isLocalHost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === "::1";

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function normalizeApiBaseUrl(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimTrailingSlash(trimmed) : null;
}

function resolveApiBaseUrl(): string {
  const configuredApiUrl = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);

  if (configuredApiUrl) {
    return configuredApiUrl;
  }

  if (import.meta.env.DEV || isLocalHost) {
    return "";
  }

  throw new Error(
    "VITE_API_URL must be configured for production landing-page builds."
  );
}

function isAbsoluteUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

export const API_BASE = resolveApiBaseUrl();

export function resolveApiUrl(path: string): string {
  if (isAbsoluteUrl(path)) {
    return path;
  }

  if (!API_BASE) {
    return path;
  }

  return `${API_BASE}/${path.replace(/^\/+/, "")}`;
}

console.log("API Base URL:", API_BASE || "(dev proxy)");

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<any> {
  const url = resolveApiUrl(path);

  console.log(`API Request: ${options.method || "GET"} ${url}`);

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data;
  try {
    data = await res.json();
  } catch (err) {
    console.error("Invalid JSON response:", err);
    console.error("Response text:", await res.text());
    throw new Error(`Invalid JSON from ${path}`);
  }

  if (!res.ok) {
    console.error(`API Error: ${res.status} ${res.statusText}`, data);
    throw new Error(data?.error || data?.message || `API ${res.status}`);
  }

  console.log(`API Success: ${options.method || "GET"} ${url}`);
  return data;
}

export const api = {
  get: (path: string, options?: RequestInit) =>
    apiFetch(path, { ...options, method: "GET" }),

  post: (path: string, data?: any, options?: RequestInit) =>
    apiFetch(path, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: (path: string, data?: any, options?: RequestInit) =>
    apiFetch(path, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: (path: string, options?: RequestInit) =>
    apiFetch(path, { ...options, method: "DELETE" }),

  patch: (path: string, data?: any, options?: RequestInit) =>
    apiFetch(path, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),
};

export async function authenticatedApiFetch(
  path: string,
  options: RequestInit = {}
): Promise<any> {
  const token = localStorage.getItem("yaotu_token");

  return apiFetch(path, {
    ...options,
    headers: {
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
}

export const authApi = {
  get: (path: string, options?: RequestInit) =>
    authenticatedApiFetch(path, { ...options, method: "GET" }),

  post: (path: string, data?: any, options?: RequestInit) =>
    authenticatedApiFetch(path, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: (path: string, data?: any, options?: RequestInit) =>
    authenticatedApiFetch(path, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: (path: string, options?: RequestInit) =>
    authenticatedApiFetch(path, { ...options, method: "DELETE" }),

  patch: (path: string, data?: any, options?: RequestInit) =>
    authenticatedApiFetch(path, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),

  upload: async (path: string, formData: FormData, options?: RequestInit) => {
    const token = localStorage.getItem("yaotu_token");
    const url = resolveApiUrl(path);

    console.log(`File Upload: POST ${url}`);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(options?.headers || {}),
      },
      body: formData,
      ...options,
    });

    let data;
    try {
      data = await res.json();
    } catch (err) {
      console.error("Invalid JSON response:", err);
      throw new Error(`Invalid JSON from ${path}`);
    }

    if (!res.ok) {
      console.error(`Upload Error: ${res.status} ${res.statusText}`, data);
      throw new Error(data?.error || data?.message || `Upload failed: ${res.status}`);
    }

    console.log(`Upload Success: POST ${url}`);
    return data;
  },
};
