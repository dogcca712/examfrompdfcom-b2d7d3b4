const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://api.examfrompdf.com";

// Token management
let accessToken: string | null = null;

// Initialize from localStorage
if (typeof window !== "undefined") {
  accessToken = localStorage.getItem("access_token");
}

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (token) {
    localStorage.setItem("access_token", token);
  } else {
    localStorage.removeItem("access_token");
  }
}

export function getAccessToken(): string | null {
  // Always read from localStorage to ensure we have the latest token
  // This handles cases where token might be updated in another tab
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token !== accessToken) {
      accessToken = token; // Sync the module variable
    }
    return token;
  }
  return accessToken;
}

// API request helper with auth
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    ...options.headers,
  };

  // Add auth header if token exists and not explicitly set
  const token = getAccessToken(); // Get fresh token
  if (token && !options.headers?.hasOwnProperty("Authorization")) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  // Add Content-Type for JSON body
  if (options.body && typeof options.body === "string") {
    (headers as Record<string, string>)["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    
    // Handle 401 Unauthorized
    if (response.status === 401) {
      setAccessToken(null);
      throw new Error("Session expired. Please log in again.");
    }
    
    throw new Error(errorText || `Request failed (${response.status})`);
  }

  // Handle empty responses
  const text = await response.text();
  if (!text) {
    return {} as T;
  }

  return JSON.parse(text);
}

// Auth API
export const authApi = {
  register: (email: string, password: string) =>
    apiRequest<{ access_token: string; user: { id: string; email: string; plan: string } }>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    ),

  login: (email: string, password: string) =>
    apiRequest<{ access_token: string; user: { id: string; email: string; plan: string } }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    ),

  me: () =>
    apiRequest<{ id: string; email: string; plan: string }>("/auth/me"),

  logout: () =>
    apiRequest<void>("/auth/logout", { method: "POST" }),
};

// Usage API
export const usageApi = {
  getStatus: () =>
    apiRequest<{
      plan: string;
      daily_used: number;
      daily_limit: number;
      monthly_used: number;
      monthly_limit: number;
      can_generate: boolean;
    }>("/usage/status"),
};

// Payments API
export const paymentsApi = {
  createCheckout: (priceId: string) =>
    apiRequest<{ checkout_url: string }>("/payments/create-checkout", {
      method: "POST",
      body: JSON.stringify({ price_id: priceId }),
    }),

  getSubscription: () =>
    apiRequest<{
      plan: string;
      status: string;
      current_period_end?: string;
      cancel_at_period_end?: boolean;
    }>("/payments/subscription"),
};

// Jobs API
export interface JobResponse {
  id: string;
  jobId: string;
  fileName: string;
  status: "queued" | "running" | "done" | "failed";
  createdAt: string;
  downloadUrl?: string;
  error?: string;
}

export const jobsApi = {
  getJobs: (limit = 50, offset = 0) =>
    apiRequest<{ jobs: JobResponse[]; total: number }>(
      `/jobs?limit=${limit}&offset=${offset}`
    ),
  deleteJob: (jobId: string) =>
    apiRequest<{ message: string; job_id: string }>(
      `/jobs/${jobId}`,
      { method: "DELETE" }
    ),
};

// Export API_BASE for use in other modules
export { API_BASE };
