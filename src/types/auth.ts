export type SubscriptionPlan = "free" | "starter" | "pro";

export interface User {
  id: string;
  email: string;
  plan: SubscriptionPlan;
  createdAt: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface UsageStatus {
  plan: SubscriptionPlan;
  daily_used: number;
  daily_limit: number;
  monthly_used: number;
  monthly_limit: number;
  can_generate: boolean;
}

export interface SubscriptionInfo {
  plan: SubscriptionPlan;
  status: "active" | "canceled" | "past_due" | "none";
  current_period_end?: string;
  cancel_at_period_end?: boolean;
}

export const PLAN_LIMITS = {
  free: { daily: 1, monthly: 30 },
  starter: { daily: Infinity, monthly: 10 },
  pro: { daily: Infinity, monthly: 50 },
} as const;

export const PLAN_NAMES: Record<SubscriptionPlan, string> = {
  free: "Free",
  starter: "Starter",
  pro: "Pro",
};
