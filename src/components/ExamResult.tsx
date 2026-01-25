import { FileText, Download, RefreshCw, Calendar, File, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExamJob } from "@/types/exam";
import { ProUpsellCard } from "./ProUpsellCard";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { API_BASE, getAccessToken } from "@/lib/api";
import { useState, useEffect } from "react";

interface ExamResultProps {
  job: ExamJob;
  onDownload: () => void;
  onDownloadAnswerKey: () => void;
  onRegenerate: () => void;
}

export function ExamResult({ job, onDownload, onDownloadAnswerKey, onRegenerate }: ExamResultProps) {
  const { isAuthenticated, user } = useAuth();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  
  // Show upsell for guests or free plan users
  const showUpsell = !isAuthenticated || user?.plan === "free";

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

      {/* Download and Regenerate Actions */}
      <div className="flex flex-col gap-3">
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
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Download Answer Key
          </Button>
        </div>
        <Button
          onClick={onRegenerate}
          size="lg"
          variant="ghost"
          className="w-full"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Generate another version
        </Button>
      </div>

      {/* Show Pro upsell for guests and free users */}
      {showUpsell && <ProUpsellCard />}
    </div>
  );
}
