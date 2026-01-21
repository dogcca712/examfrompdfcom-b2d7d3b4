import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, CreditCard, Zap } from "lucide-react";
import { PLAN_NAMES } from "@/types/auth";

export function UserMenu() {
  const { user, usage, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/login">Sign in</Link>
        </Button>
        <Button size="sm" asChild>
          <Link to="/register">Sign up</Link>
        </Button>
      </div>
    );
  }

  const usageDisplay = usage
    ? usage.daily_limit === Infinity
      ? `${usage.monthly_used}/${usage.monthly_limit} this month`
      : `${usage.daily_used}/${usage.daily_limit} today`
    : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.email}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.plan ? PLAN_NAMES[user.plan] : "Free"} Plan
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {usageDisplay && (
          <>
            <DropdownMenuItem disabled className="text-xs text-muted-foreground">
              <Zap className="mr-2 h-4 w-4" />
              {usageDisplay}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem asChild>
          <Link to="/pricing" className="cursor-pointer">
            <CreditCard className="mr-2 h-4 w-4" />
            Upgrade Plan
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => logout()}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
