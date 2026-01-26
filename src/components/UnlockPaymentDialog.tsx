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
      <DialogContent className="w-[92vw] max-w-md border-orange-500/50 overflow-hidden p-4 sm:p-6 left-[50%] translate-x-[-50%]">
        {/* Gradient background accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/5 to-transparent pointer-events-none" />
        
        <DialogHeader className="relative">
          <div className="mx-auto flex h-14 w-14 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 mb-3 sm:mb-4 shadow-lg shadow-orange-500/30">
            <Lock className="h-7 w-7 sm:h-10 sm:w-10 text-white" />
          </div>
          <DialogTitle className="text-center text-xl sm:text-2xl font-bold">
            🔓 Unlock Your Exam!
          </DialogTitle>
          <DialogDescription className="text-center text-sm sm:text-base">
            Your exam is ready! Pay once to download both files.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4 py-3 sm:py-4 relative">
          {/* Price Display - Big and Bold with Discount */}
          <div className="text-center py-3 sm:py-4 rounded-xl bg-gradient-to-r from-orange-500/20 via-red-500/20 to-orange-500/20 border border-orange-500/30">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-base sm:text-xl text-muted-foreground line-through">$2.00</span>
              <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                50% OFF
              </span>
            </div>
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500 shrink-0" />
              <span className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                $0.99
              </span>
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 shrink-0" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2 font-medium">
              ⚡ Limited time • Instant access
            </p>
          </div>

          {/* What's Included */}
          <div className="rounded-xl border-2 border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-red-500/5 p-3 sm:p-4 space-y-2 sm:space-y-3">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <span className="text-base sm:text-lg">🎁</span> What You Get:
            </h4>
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-orange-500/20 shrink-0">
                <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-500" />
              </div>
              <span className="font-medium">Practice Exam PDF</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-red-500/20 shrink-0">
                <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500" />
              </div>
              <span className="font-medium">Answer Key with Explanations</span>
            </div>
          </div>

          {/* Purchase Button - Eye-catching */}
          <Button
            onClick={onPurchase}
            size="lg"
            className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 hover:from-orange-600 hover:via-red-600 hover:to-orange-600 text-white shadow-lg shadow-orange-500/40 hover:shadow-orange-500/60 transition-all duration-300 hover:scale-[1.02] px-3"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                <span className="truncate">🔥 Pay $0.99 — Download Now!</span>
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            🔒 Secure payment via Stripe
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
