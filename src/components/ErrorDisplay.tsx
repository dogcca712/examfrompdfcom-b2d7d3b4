import { useState } from "react";
import { AlertCircle, ChevronDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorDisplayProps {
  message: string;
  details?: string;
  onRetry: () => void;
}

export function ErrorDisplay({ message, details, onRetry }: ErrorDisplayProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="animate-fade-in rounded-xl border border-destructive/30 bg-destructive/5 p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
          <AlertCircle className="h-5 w-5 text-destructive" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-foreground">Generation Failed</h3>
          <p className="mt-1 text-sm text-muted-foreground">{message}</p>
        </div>
      </div>

      {details && (
        <div className="mt-4">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                showDetails && "rotate-180"
              )}
            />
            Technical details
          </button>
          {showDetails && (
            <pre className="mt-2 overflow-x-auto rounded-lg bg-muted p-3 text-xs text-muted-foreground">
              {details}
            </pre>
          )}
        </div>
      )}

      <div className="mt-4">
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try again
        </Button>
      </div>
    </div>
  );
}
