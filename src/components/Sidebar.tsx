import { useState } from "react";
import {
  FileText,
  Plus,
  Menu,
  X,
  Clock,
  Download,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ExamJob } from "@/types/exam";
import { cn } from "@/lib/utils";

interface SidebarProps {
  jobs: ExamJob[];
  selectedJobId: string | null;
  onSelectJob: (id: string | null) => void;
  onNewExam: () => void;
  onDeleteJob: (id: string) => void;
}

export function Sidebar({
  jobs,
  selectedJobId,
  onSelectJob,
  onNewExam,
  onDeleteJob,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

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
      case "failed":
        return "text-destructive";
      case "running":
      case "queued":
        return "text-warning";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-72 border-r border-sidebar-border bg-sidebar transition-transform duration-300 md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-sidebar-border p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <FileText className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-sidebar-foreground">
                ExamGen
              </span>
            </div>
            <ThemeToggle />
          </div>

          {/* New Exam Button */}
          <div className="p-3">
            <Button
              onClick={() => {
                onNewExam();
                setIsOpen(false);
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
                jobs.map((job) => (
                  <div
                    key={job.id}
                    className={cn(
                      "group relative flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-sidebar-accent",
                      selectedJobId === job.id && "bg-sidebar-accent"
                    )}
                    onClick={() => {
                      onSelectJob(job.id);
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary">
                      <FileText className="h-4 w-4 text-muted-foreground" />
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
                        <span className={cn("capitalize", getStatusColor(job.status))}>
                          {job.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex opacity-0 transition-opacity group-hover:opacity-100">
                      {job.status === "done" && job.downloadUrl && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(job.downloadUrl, "_blank");
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
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-sidebar-border p-4">
            <p className="text-xs text-muted-foreground">
              Files auto-delete after 24 hours. We don't store your lecture content
              permanently.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
