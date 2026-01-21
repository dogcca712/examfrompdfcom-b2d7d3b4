import { FileText, Download, RefreshCw, Calendar, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExamJob } from "@/types/exam";
import { ProUpsellCard } from "./ProUpsellCard";
import { useAuth } from "@/contexts/AuthContext";

interface ExamResultProps {
  job: ExamJob;
  onDownload: () => void;
  onRegenerate: () => void;
}

export function ExamResult({ job, onDownload, onRegenerate }: ExamResultProps) {
  const { isAuthenticated, user } = useAuth();
  
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

  return (
    <div className="space-y-6">
      <div className="animate-slide-up rounded-xl border border-border bg-card p-6 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-success/10">
            <FileText className="h-7 w-7 text-success" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-foreground">
              {job.examTitle || "Practice Exam"}
            </h3>
            {job.courseCode && (
              <p className="text-sm text-muted-foreground">{job.courseCode}</p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {job.totalPages && (
                <div className="flex items-center gap-1.5">
                  <File className="h-4 w-4" />
                  <span>{job.totalPages} pages</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(job.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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
            onClick={onRegenerate}
            size="lg"
            variant="outline"
            className="flex-1"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate another version
          </Button>
        </div>
      </div>

      {/* Show Pro upsell for guests and free users */}
      {showUpsell && <ProUpsellCard />}
    </div>
  );
}
