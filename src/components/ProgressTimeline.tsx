import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  label: string;
}

interface ProgressTimelineProps {
  steps: Step[];
  currentStep: number;
  failed?: boolean;
}

const defaultSteps: Step[] = [
  { id: "extract", label: "Extracting text" },
  { id: "write", label: "Writing questions" },
  { id: "format", label: "Formatting" },
  { id: "generate", label: "Generating PDF" },
];

export function ProgressTimeline({
  steps = defaultSteps,
  currentStep,
  failed,
}: ProgressTimelineProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isFailed = failed && isCurrent;

          return (
            <div key={step.id} className="flex items-center gap-4">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
                  isCompleted
                    ? "border-success bg-success"
                    : isFailed
                    ? "border-destructive bg-destructive"
                    : isCurrent
                    ? "border-primary bg-primary"
                    : "border-border bg-transparent"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 text-success-foreground" />
                ) : isCurrent ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
                ) : (
                  <span className="text-xs font-medium text-muted-foreground">
                    {index + 1}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <p
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isCompleted
                      ? "text-success"
                      : isFailed
                      ? "text-destructive"
                      : isCurrent
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {step.label}
                  {isCurrent && !failed && "..."}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
