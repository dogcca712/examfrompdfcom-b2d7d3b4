import { Lock, Download, BookOpen, CreditCard, Sparkles } from "lucide-react";
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
      <DialogContent className="sm:max-w-md border-orange-500/50 overflow-hidden">
        {/* Gradient background accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/5 to-transparent pointer-events-none" />
        
        <DialogHeader className="relative">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 mb-4 shadow-lg shadow-orange-500/30">
            <Lock className="h-10 w-10 text-white" />
          </div>
          <DialogTitle className="text-center text-2xl font-bold">
            🔓 Unlock Your Exam!
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Your exam is ready! Pay once to download both files.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 relative">
          {/* Price Display - Big and Bold with Discount */}
          <div className="text-center py-4 rounded-xl bg-gradient-to-r from-orange-500/20 via-red-500/20 to-orange-500/20 border border-orange-500/30">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-xl text-muted-foreground line-through">$2.00</span>
              <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                50% OFF
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-orange-500" />
              <span className="text-5xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                $0.99
              </span>
              <Sparkles className="h-6 w-6 text-red-500" />
            </div>
            <p className="text-sm text-muted-foreground mt-2 font-medium">
              ⚡ Limited time offer • Instant access
            </p>
          </div>

          {/* What's Included */}
          <div className="rounded-xl border-2 border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-red-500/5 p-4 space-y-3">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <span className="text-lg">🎁</span> What You Get:
            </h4>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/20">
                <Download className="h-4 w-4 text-orange-500" />
              </div>
              <span className="font-medium">Practice Exam PDF</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20">
                <BookOpen className="h-4 w-4 text-red-500" />
              </div>
              <span className="font-medium">Answer Key with Full Explanations</span>
            </div>
          </div>

          {/* Purchase Button - Eye-catching */}
          <Button
            onClick={onPurchase}
            size="lg"
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 hover:from-orange-600 hover:via-red-600 hover:to-orange-600 text-white shadow-lg shadow-orange-500/40 hover:shadow-orange-500/60 transition-all duration-300 hover:scale-[1.02] animate-pulse hover:animate-none"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-5 w-5" />
                🔥 Pay $0.99 — Download Now!
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            🔒 Secure payment powered by Stripe
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
