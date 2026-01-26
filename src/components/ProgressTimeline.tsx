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
    <div className="rounded-2xl border border-border bg-card p-8 sm:p-10 shadow-lg">
      <div className="space-y-6">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isFailed = failed && isCurrent;

          return (
            <div key={step.id} className="flex items-center gap-5">
              <div
                className={cn(
                  "flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
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
                  <Check className="h-5 w-5 sm:h-6 sm:w-6 text-success-foreground" />
                ) : isCurrent ? (
                  <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-primary-foreground" />
                ) : (
                  <span className="text-sm sm:text-base font-medium text-muted-foreground">
                    {index + 1}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <p
                  className={cn(
                    "text-base sm:text-lg font-medium transition-colors",
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
