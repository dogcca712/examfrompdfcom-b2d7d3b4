import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Zap, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function UsageBanner() {
  const { usage, isAuthenticated } = useAuth();

  if (!isAuthenticated || !usage) {
    return null;
  }

  const isDaily = usage.daily_limit !== Infinity && usage.daily_limit < 1000;
  const used = isDaily ? usage.daily_used : usage.monthly_used;
  const limit = isDaily ? usage.daily_limit : usage.monthly_limit;
  const remaining = Math.max(0, limit - used);
  const percentage = limit > 0 ? (used / limit) * 100 : 0;
  
  const isLow = percentage >= 80;
  const isExhausted = !usage.can_generate;

  if (isExhausted) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">
              Usage limit reached
            </span>
          </div>
          <Link
            to="/pricing"
            className="text-sm font-medium text-primary hover:underline"
          >
            Upgrade plan →
          </Link>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          You've used all your {isDaily ? "daily" : "monthly"} exams. 
          {isDaily ? " Try again tomorrow or upgrade." : " Upgrade for more."}
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        isLow ? "border-warning/50 bg-warning/10" : "border-border bg-card"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className={cn("h-4 w-4", isLow ? "text-warning" : "text-muted-foreground")} />
          <span className="text-sm font-medium text-foreground">
            {remaining} {isDaily ? "daily" : "monthly"} exam{remaining !== 1 ? "s" : ""} remaining
          </span>
        </div>
        {isLow && (
          <Link
            to="/pricing"
            className="text-xs font-medium text-primary hover:underline"
          >
            Get more →
          </Link>
        )}
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            isLow ? "bg-warning" : "bg-primary"
          )}
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {used}/{limit} used {isDaily ? "today" : "this month"}
      </p>
    </div>
  );
}
