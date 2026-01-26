import {
  FileText,
  Plus,
  X,
  Clock,
  Download,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/UserMenu";
import { ExamJob, isJobExpired } from "@/types/exam";
import { cn } from "@/lib/utils";
import { downloadPdfWithAuth } from "@/lib/download";

interface SidebarProps {
  jobs: ExamJob[];
  selectedJobId: string | null;
  onSelectJob: (id: string | null) => void;
  onNewExam: () => void;
  onDeleteJob: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({
  jobs,
  selectedJobId,
  onSelectJob,
  onNewExam,
  onDeleteJob,
  isOpen,
  onClose,
}: SidebarProps) {

  const getExamFileName = (originalPdfName: string) => {
    const base = originalPdfName.replace(/\.pdf$/i, "");
    return `${base}_exam.pdf`;
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: ExamJob["status"]) => {
    switch (status) {
      case "done":
        return "text-success";
      case "expired":
        return "text-muted-foreground";
      case "failed":
        return "text-destructive";
      case "running":
      case "queued":
        return "text-warning";
      default:
        return "text-muted-foreground";
    }
  };

  const getDisplayStatus = (job: ExamJob): string => {
    if (job.status === "done" && isJobExpired(job)) {
      return "expired";
    }
    return job.status;
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar - always hidden by default, slides in from left */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-72 border-r border-sidebar-border bg-sidebar transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-sidebar-border p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70">
                <div className="relative flex items-center">
                  <FileText className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
              </div>
              <span className="text-lg font-semibold text-sidebar-foreground">
                History
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* New Exam Button */}
          <div className="p-3">
            <Button
              onClick={() => {
                onNewExam();
                onClose();
              }}
              className="w-full justify-start gap-2"
              variant="outline"
            >
              <Plus className="h-4 w-4" />
              New Exam
            </Button>
          </div>

          {/* History */}
          <div className="flex-1 overflow-y-auto p-3">
            <h3 className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              History
            </h3>
            <div className="space-y-1">
              {jobs.length === 0 ? (
                <p className="px-2 py-4 text-center text-sm text-muted-foreground">
                  No exams generated yet
                </p>
              ) : (
                jobs.map((job) => {
                  const displayStatus = getDisplayStatus(job);
                  const jobExpired = displayStatus === "expired";
                  
                  return (
                  <div
                    key={job.id}
                    className={cn(
                      "group relative flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-sidebar-accent",
                      selectedJobId === job.id && "bg-sidebar-accent",
                      jobExpired && "opacity-60"
                    )}
                    onClick={() => {
                      onSelectJob(job.id);
                      onClose();
                    }}
                  >
                    <div className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                      jobExpired ? "bg-muted" : "bg-secondary"
                    )}>
                      {jobExpired ? (
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-sidebar-foreground">
                        {job.fileName}
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {formatDate(job.createdAt)}
                        </span>
                        <span className={cn("capitalize", getStatusColor(displayStatus as ExamJob["status"]))}>
                          {displayStatus}
                        </span>
                      </div>
                    </div>
                    <div className="flex opacity-0 transition-opacity group-hover:opacity-100">
                      {job.status === "done" && job.downloadUrl && !jobExpired && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            void (async () => {
                              try {
                                await downloadPdfWithAuth(
                                  job.downloadUrl!,
                                  getExamFileName(job.fileName)
                                );
                              } catch (err) {
                                const message =
                                  err instanceof Error
                                    ? err.message
                                    : "Download failed, please try again";
                                console.error("History download failed:", err);
                                toast.error(message);
                              }
                            })();
                          }}
                        >
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteJob(job.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-sidebar-border p-4">
            <p className="text-xs text-muted-foreground">
              Files auto-delete after 7 days. We don't store your lecture content
              permanently.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
