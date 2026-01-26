import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  "Unlimited PDF uploads",
  "AI-generated practice questions",
  "LaTeX-quality PDF output",
  "Complete answer key",
  "Multiple question types",
  "Instant download",
];

export function Pricing() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section id="pricing" className="py-24 bg-muted/30">
      <div className="mx-auto max-w-4xl px-4">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Simple Pricing
          </span>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Pay Only for What You Download
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            No subscriptions, no hidden fees. Generate as many exams as you want — 
            only pay when you're ready to download.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="mx-auto max-w-md">
          <div className="relative overflow-hidden rounded-3xl border-2 border-primary bg-card shadow-xl">
            {/* Popular badge */}
            <div className="absolute -right-12 top-6 rotate-45 bg-primary px-12 py-1 text-xs font-semibold text-primary-foreground">
              Popular
            </div>

            <div className="p-8">
              {/* Price */}
              <div className="mb-6 text-center">
                <div className="mb-2 flex items-center justify-center gap-2">
                  <span className="text-lg text-muted-foreground line-through">$2.00</span>
                  <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive">
                    50% OFF
                  </span>
                </div>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold">$0.99</span>
                  <span className="text-muted-foreground">/ exam</span>
                </div>
              </div>

              {/* Benefits */}
              <ul className="mb-8 space-y-3">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button 
                onClick={scrollToTop}
                className="w-full gap-2" 
                size="lg"
              >
                <Sparkles className="h-4 w-4" />
                Start Generating
              </Button>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Free to generate • Pay only to download
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
