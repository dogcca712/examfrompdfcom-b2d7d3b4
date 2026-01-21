import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { paymentsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserMenu } from "@/components/UserMenu";
import { Check, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STRIPE_PRICE_STARTER = import.meta.env.VITE_STRIPE_PRICE_STARTER || "";
const STRIPE_PRICE_PRO = import.meta.env.VITE_STRIPE_PRICE_PRO || "";

interface PlanProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  priceId?: string;
  isCurrent?: boolean;
  isPopular?: boolean;
}

function PlanCard({
  name,
  price,
  period,
  description,
  features,
  priceId,
  isCurrent,
  isPopular,
}: PlanProps) {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!priceId) return;
    
    setIsLoading(true);
    try {
      const { checkout_url } = await paymentsApi.createCheckout(priceId);
      window.location.href = checkout_url;
    } catch (error) {
      console.error("Checkout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md",
        isPopular && "border-primary shadow-md"
      )}
    >
      {isPopular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
          Most Popular
        </span>
      )}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">{name}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="mb-6">
        <span className="text-3xl font-bold text-foreground">{price}</span>
        {period && (
          <span className="text-muted-foreground">/{period}</span>
        )}
      </div>
      <ul className="mb-6 flex-1 space-y-3">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span className="text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>
      {isCurrent ? (
        <Button variant="outline" disabled className="w-full">
          Current Plan
        </Button>
      ) : priceId ? (
        isAuthenticated ? (
          <Button
            onClick={handleSubscribe}
            disabled={isLoading}
            variant={isPopular ? "default" : "outline"}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Redirecting...
              </>
            ) : (
              "Subscribe"
            )}
          </Button>
        ) : (
          <Button asChild variant={isPopular ? "default" : "outline"} className="w-full">
            <Link to="/register">Get Started</Link>
          </Button>
        )
      ) : (
        <Button asChild variant="outline" className="w-full">
          <Link to="/register">Get Started Free</Link>
        </Button>
      )}
    </div>
  );
}

export default function Pricing() {
  const { user } = useAuth();
  const currentPlan = user?.plan || "free";

  const plans: PlanProps[] = [
    {
      name: "Free",
      price: "$0",
      period: "",
      description: "Perfect for trying out",
      features: [
        "1 exam per day",
        "Up to 30 exams per month",
        "Basic PDF support",
        "Standard processing",
      ],
      isCurrent: currentPlan === "free",
    },
    {
      name: "Starter",
      price: "$9",
      period: "month",
      description: "For regular studying",
      features: [
        "10 exams per month",
        "Priority processing",
        "Advanced PDF parsing",
        "Email support",
      ],
      priceId: STRIPE_PRICE_STARTER,
      isCurrent: currentPlan === "starter",
    },
    {
      name: "Pro",
      price: "$19",
      period: "month",
      description: "For serious students",
      features: [
        "50 exams per month",
        "Fastest processing",
        "Advanced PDF parsing",
        "Priority support",
        "Custom difficulty settings",
      ],
      priceId: STRIPE_PRICE_PRO,
      isPopular: true,
      isCurrent: currentPlan === "pro",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b p-4">
        <Link to="/" className="flex items-center gap-2 text-foreground">
          <FileText className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">ExamGen</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserMenu />
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Simple, transparent pricing
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Choose the plan that's right for your study needs
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <PlanCard key={plan.name} {...plan} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              All plans include access to our core exam generation features.
              <br />
              Questions? <a href="mailto:support@examfrompdf.com" className="text-primary hover:underline">Contact us</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
