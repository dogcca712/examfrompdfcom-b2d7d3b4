import { Link } from "react-router-dom";
import {
  FileText,
  ArrowRight,
  Plus,
  X,
  Clock,
  Download,
  Trash2,
  AlertCircle,
  LogIn,
  UserPlus,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ExamJob, isJobExpired } from "@/types/exam";
import { cn } from "@/lib/utils";
import { downloadPdfWithAuth } from "@/lib/download";
import { useAuth } from "@/contexts/AuthContext";

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
  const { isAuthenticated, user, logout } = useAuth();

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
          "fixed left-0 top-0 z-40 h-full w-80 border-r border-sidebar-border bg-sidebar transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-sidebar-border p-5">
            <a href="/" className="flex items-center gap-3" onClick={onClose}>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-sm">
                <div className="relative flex items-center">
                  <FileText className="h-5 w-5 text-primary-foreground" />
                  <ArrowRight className="h-4 w-4 text-primary-foreground -ml-1" />
                </div>
              </div>
              <span className="text-xl font-bold text-sidebar-foreground">
                ExamFromPDF
              </span>
            </a>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Auth Section */}
          <div className="border-b border-sidebar-border p-4">
            {isAuthenticated ? (
              <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                    <span className="text-lg font-bold text-primary">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user?.email}
                    </p>
                    <p className="text-xs text-muted-foreground">Logged in</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4 h-10 gap-2 text-sm"
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Button asChild className="w-full justify-start gap-3 h-11 text-base">
                  <Link to="/register" onClick={onClose}>
                    <UserPlus className="h-5 w-5" />
                    Sign Up
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start gap-3 h-11 text-base">
                  <Link to="/login" onClick={onClose}>
                    <LogIn className="h-5 w-5" />
                    Sign In
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* New Exam Button */}
          <div className="p-4">
            <Button
              onClick={() => {
                onNewExam();
                onClose();
              }}
              className="w-full justify-start gap-3 h-11 text-base"
              variant="outline"
            >
              <Plus className="h-5 w-5" />
              New Exam
            </Button>
          </div>

          {/* History */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <h3 className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Recent Exams
            </h3>
            <div className="space-y-1">
              {jobs.length === 0 ? (
                <p className="px-2 py-6 text-center text-sm text-muted-foreground">
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
