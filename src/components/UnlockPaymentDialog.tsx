import { Lock, Download, BookOpen, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UnlockPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPurchase: () => void;
  isLoading?: boolean;
}

export function UnlockPaymentDialog({
  open,
  onOpenChange,
  onPurchase,
  isLoading = false,
}: UnlockPaymentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">
            Unlock Your Exam
          </DialogTitle>
          <DialogDescription className="text-center">
            Your exam is ready! Pay once to download both files.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Price Display */}
          <div className="text-center">
            <div className="text-4xl font-bold text-foreground">$0.99</div>
            <p className="text-sm text-muted-foreground mt-1">One-time payment</p>
          </div>

          {/* What's Included */}
          <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
            <h4 className="font-medium text-sm text-foreground">Includes:</h4>
            <div className="flex items-center gap-3 text-sm">
              <Download className="h-4 w-4 text-primary shrink-0" />
              <span className="text-muted-foreground">Practice Exam PDF</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <BookOpen className="h-4 w-4 text-primary shrink-0" />
              <span className="text-muted-foreground">Answer Key with Explanations</span>
            </div>
          </div>

          {/* Purchase Button */}
          <Button
            onClick={onPurchase}
            size="lg"
            variant="gradient"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pay $0.99 to Download
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Secure payment powered by Stripe
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
