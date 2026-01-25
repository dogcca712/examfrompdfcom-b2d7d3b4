import { FileText, Lock, RefreshCw, Calendar, File, Sparkles, Download, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExamJob } from "@/types/exam";
import { API_BASE, getAccessToken } from "@/lib/api";
import { useState, useEffect } from "react";
import { UnlockPaymentDialog } from "./UnlockPaymentDialog";

interface ExamResultProps {
  job: ExamJob;
  onDownload: () => void;
  onDownloadAnswerKey: () => void;
  onRegenerate: () => void;
  onUnlockPurchase: () => void;
  isUnlocked?: boolean;
  isPurchasing?: boolean;
  isGeneratingAnswerKey?: boolean;
  answerKeyReady?: boolean;
}

export function ExamResult({ 
  job, 
  onDownload, 
  onDownloadAnswerKey, 
  onRegenerate,
  onUnlockPurchase,
  isUnlocked = false,
  isPurchasing = false,
  isGeneratingAnswerKey = false,
  answerKeyReady = false,
}: ExamResultProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Fetch PDF for preview with auth
  useEffect(() => {
    const fetchPdfForPreview = async () => {
      if (!job.jobId) return;
      
      setIsLoadingPdf(true);
      try {
        const token = getAccessToken();
        const headers: HeadersInit = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        
        const response = await fetch(`${API_BASE}/download/${job.jobId}?t=${Date.now()}`, {
          headers,
        });
        
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setPdfUrl(url);
        }
      } catch (error) {
        console.error("Failed to load PDF preview:", error);
      } finally {
        setIsLoadingPdf(false);
      }
    };

    fetchPdfForPreview();

    // Cleanup blob URL on unmount
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [job.jobId]);

  const handleLockedButtonClick = () => {
    setShowPaymentDialog(true);
  };

  const handlePurchase = () => {
    onUnlockPurchase();
    // Dialog will close when isPurchasing changes or payment completes
  };

  // Close dialog when purchase completes (isUnlocked becomes true)
  useEffect(() => {
    if (isUnlocked) {
      setShowPaymentDialog(false);
    }
  }, [isUnlocked]);

  return (
    <div className="space-y-6">
      {/* PDF Preview */}
      <div className="animate-slide-up rounded-xl border border-border bg-card shadow-lg overflow-hidden">
        <div className="border-b border-border bg-muted/30 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success/10">
              <FileText className="h-5 w-5 text-success" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground truncate">
                {job.examTitle || "Practice Exam"}
              </h3>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {job.courseCode && <span>{job.courseCode}</span>}
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(job.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* PDF Preview Area */}
        <div className="h-[500px] w-full bg-muted/20">
          {isLoadingPdf ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
                <p className="mt-2 text-sm text-muted-foreground">Loading preview...</p>
              </div>
            </div>
          ) : pdfUrl ? (
            <object
              data={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
              type="application/pdf"
              className="w-full h-full"
            >
              <div className="flex h-full items-center justify-center p-8">
                <div className="text-center text-muted-foreground">
                  <File className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Browser does not support PDF preview</p>
                  <p className="text-sm">Click download to get your exam</p>
                </div>
              </div>
            </object>
          ) : (
            <div className="flex h-full items-center justify-center p-8">
              <div className="text-center text-muted-foreground">
                <File className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Preview not available</p>
                <p className="text-sm">Click download to get your exam</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Download Actions - Locked or Unlocked */}
      <div className="flex flex-col gap-3">
        {isUnlocked ? (
          // Unlocked state - show download buttons
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={onDownload}
              size="lg"
              variant="gradient"
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button
              onClick={onDownloadAnswerKey}
              size="lg"
              variant="outline"
              className="flex-1"
              disabled={isGeneratingAnswerKey || !answerKeyReady}
            >
              {isGeneratingAnswerKey ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Generating Answers...
                </>
              ) : !answerKeyReady ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Preparing...
                </>
              ) : (
                <>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Download Answer Key
                </>
              )}
            </Button>
          </div>
        ) : (
          // Locked state - vibrant payment prompt with discount
          <div className="space-y-3">
            <Button
              onClick={handleLockedButtonClick}
              size="lg"
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 hover:from-orange-600 hover:via-red-600 hover:to-orange-600 text-white shadow-lg shadow-orange-500/40 hover:shadow-orange-500/60 transition-all duration-300 hover:scale-[1.02]"
            >
              <Lock className="mr-2 h-5 w-5" />
              🔥 <span className="line-through opacity-70 mx-1">$2.00</span> $0.99 — Unlock Exam + Answers!
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              🏷️ <span className="text-red-500 font-semibold">50% OFF</span> • Limited time • Includes answer key
            </p>
          </div>
        )}
        
        {/* Only show regenerate button if not yet paid */}
        {!isUnlocked && (
          <Button
            onClick={onRegenerate}
            size="lg"
            variant="ghost"
            className="w-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate another version
          </Button>
        )}
      </div>

      {/* Payment Dialog */}
      <UnlockPaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        onPurchase={handlePurchase}
        isLoading={isPurchasing}
      />
    </div>
  );
}
