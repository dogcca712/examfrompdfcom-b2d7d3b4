import { AlertCircle, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExamJob } from "@/types/exam";

interface ExpiredJobDisplayProps {
  job: ExamJob;
  onNewExam: () => void;
}

export function ExpiredJobDisplay({ job, onNewExam }: ExpiredJobDisplayProps) {
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
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-xl border border-border bg-card p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <AlertCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        
        <h2 className="mb-2 text-xl font-semibold text-foreground">
          Exam Expired
        </h2>
        
        <p className="mb-4 text-muted-foreground">
          This exam was generated more than 7 days ago and is no longer available for download.
        </p>
        
        <div className="mb-6 rounded-lg bg-muted/50 p-4">
          <p className="text-sm font-medium text-foreground">{job.fileName}</p>
          <div className="mt-1 flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Created {formatDate(job.createdAt)}</span>
          </div>
        </div>
        
        <p className="mb-6 text-sm text-muted-foreground">
          Generated PDFs are automatically deleted after 7 days for privacy and storage reasons.
        </p>
        
        <Button onClick={onNewExam} size="lg" variant="gradient" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Generate New Exam
        </Button>
      </div>
    </div>
  );
}
