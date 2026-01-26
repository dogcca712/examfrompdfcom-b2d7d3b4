import { FileText, Lock, RefreshCw, Calendar, Sparkles, Download, BookOpen, CheckCircle, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExamJob } from "@/types/exam";
import { API_BASE, getAccessToken } from "@/lib/api";
import { useState, useEffect } from "react";
import { UnlockPaymentDialog } from "./UnlockPaymentDialog";
import { toast } from "@/hooks/use-toast";

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState(false);
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

  // Fetch preview image with auth
  useEffect(() => {
    const fetchPreview = async () => {
      if (!job.jobId) return;
      
      setIsLoadingPreview(true);
      setPreviewError(false);
      try {
        const token = getAccessToken();
        const headers: HeadersInit = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        
        // Try to fetch preview image
        const response = await fetch(`${API_BASE}/preview/${job.jobId}?t=${Date.now()}`, {
          headers,
        });
        
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setPreviewUrl(url);
        } else {
          // Preview not available, show fallback
          setPreviewError(true);
        }
      } catch (error) {
        console.error("Failed to load preview:", error);
        setPreviewError(true);
      } finally {
        setIsLoadingPreview(false);
      }
    };

    fetchPreview();

    // Cleanup blob URL on unmount
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
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
    <div className="space-y-6 pb-8">
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
        
        {/* Preview Image Area */}
        <div className="w-full bg-muted/20 flex items-center justify-center overflow-hidden">
          {isLoadingPreview ? (
            <div className="flex h-[200px] sm:h-[400px] items-center justify-center">
              <div className="text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
                <p className="mt-2 text-sm text-muted-foreground">Loading preview...</p>
              </div>
            </div>
          ) : previewUrl ? (
            <img
              src={previewUrl}
              alt="Exam preview - first page"
              className="w-full h-auto max-h-[300px] sm:max-h-[500px] object-contain"
            />
          ) : (
            <div className="flex h-[200px] sm:h-[300px] items-center justify-center p-6">
              <div className="text-center space-y-4">
                <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-success/10">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-lg">Exam Generated!</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your practice exam is ready
                  </p>
                </div>
                {previewError && (
                  <p className="text-xs text-muted-foreground">
                    Preview image not available
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Download Actions - Locked or Unlocked */}
      <div className="flex flex-col gap-3">
        {isUnlocked ? (
          // Unlocked state - show download buttons
          <div className="space-y-3">
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
            {/* Backup link for users who can't download */}
            <BackupLinkButton jobId={job.jobId} />
          </div>
        ) : (
          // Locked state - vibrant payment prompt with discount
          <div className="space-y-3">
            <Button
              onClick={handleLockedButtonClick}
              size="lg"
              className="w-full h-14 text-base sm:text-lg font-bold bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 hover:from-orange-600 hover:via-red-600 hover:to-orange-600 text-white shadow-lg shadow-orange-500/40 hover:shadow-orange-500/60 transition-all duration-300 hover:scale-[1.02] px-3 sm:px-6"
            >
              <Lock className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
              <span className="truncate">
                🔥 <span className="line-through opacity-70 mx-0.5 sm:mx-1">$2</span> $0.99 — Unlock!
              </span>
              <Sparkles className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
            </Button>
            <p className="text-center text-xs sm:text-sm text-muted-foreground">
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

// Backup link component for when download fails
function BackupLinkButton({ jobId }: { jobId: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopyLink = async () => {
    // Create a shareable URL with job_id that will auto-select this job
    const url = `${window.location.origin}/?job_id=${jobId}&payment=success`;
    
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "链接已复制",
        description: "可在其他浏览器中打开此链接",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      toast({
        title: "链接已复制",
        description: "可在其他浏览器中打开此链接",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  return (
    <button
      onClick={handleCopyLink}
      className="w-full flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors py-2"
    >
      {copied ? (
        <>
          <Check className="h-3 w-3 text-success" />
          <span>已复制!</span>
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          <span>下载有问题? 复制备用链接</span>
        </>
      )}
    </button>
  );
}
