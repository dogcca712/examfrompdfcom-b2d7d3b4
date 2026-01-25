import { useCallback, useState } from "react";
import { Upload, FileText, X, Plus, Files } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const MAX_FILES = 20;

interface FileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  disabled?: boolean;
}

export function FileUpload({
  files,
  onFilesChange,
  disabled,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const pdfFiles = Array.from(newFiles).filter(
        (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
      );
      
      if (pdfFiles.length === 0) return;
      
      const remainingSlots = MAX_FILES - files.length;
      const filesToAdd = pdfFiles.slice(0, remainingSlots);
      
      if (filesToAdd.length > 0) {
        onFilesChange([...files, ...filesToAdd]);
      }
    },
    [files, onFilesChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        addFiles(e.target.files);
      }
      // Reset input value so the same file can be selected again
      e.target.value = "";
    },
    [addFiles]
  );

  const removeFile = useCallback(
    (index: number) => {
      onFilesChange(files.filter((_, i) => i !== index));
    },
    [files, onFilesChange]
  );

  const estimatePages = (size: number) => {
    // Rough estimate: 100KB per page
    return Math.max(1, Math.round(size / 100000));
  };

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  const totalPages = files.reduce((sum, f) => sum + estimatePages(f.size), 0);
  const canAddMore = files.length < MAX_FILES;

  // Has files uploaded - show file list with add more option
  if (files.length > 0) {
    return (
      <div className="space-y-4">
        {/* Header with count and stats */}
        <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Files className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">
                  {files.length} PDF{files.length > 1 ? "s" : ""} selected
                </span>
                <Badge variant="secondary" className="text-xs">
                  {files.length}/{MAX_FILES}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {(totalSize / 1024 / 1024).toFixed(2)} MB total • ~{totalPages} pages
              </p>
            </div>
          </div>
          {canAddMore && (
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".pdf,application/pdf"
                multiple
                onChange={handleFileChange}
                className="hidden"
                disabled={disabled}
              />
              <Button
                variant="outline"
                size="sm"
                className="pointer-events-none"
                disabled={disabled}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add more
              </Button>
            </label>
          )}
        </div>

        {/* File list */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="animate-fade-in flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent/50"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • ~{estimatePages(file.size)} pages
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFile(index)}
                disabled={disabled}
                className="h-8 w-8 shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Add more hint */}
        {canAddMore && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "relative flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 transition-all",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-accent/30",
              disabled && "pointer-events-none opacity-50"
            )}
          >
            <input
              type="file"
              accept=".pdf,application/pdf"
              multiple
              onChange={handleFileChange}
              className="absolute inset-0 cursor-pointer opacity-0"
              disabled={disabled}
            />
            <Plus className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Drop more PDFs here or click to add ({MAX_FILES - files.length} remaining)
            </span>
          </div>
        )}
      </div>
    );
  }

  // No files - show empty state with guidance
  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200",
          isDragging
            ? "border-primary bg-primary/5 shadow-glow"
            : "border-border bg-card hover:border-primary/50 hover:bg-accent/50",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        <input
          type="file"
          accept=".pdf,application/pdf"
          multiple
          onChange={handleFileChange}
          className="absolute inset-0 cursor-pointer opacity-0"
          disabled={disabled}
        />
        <div className="flex flex-col items-center gap-4 p-8 text-center">
          <div
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-2xl transition-colors",
              isDragging ? "bg-primary/20" : "bg-secondary"
            )}
          >
            <Upload
              className={cn(
                "h-8 w-8 transition-colors",
                isDragging ? "text-primary" : "text-muted-foreground"
              )}
            />
          </div>
          <div>
            <p className="text-lg font-medium text-foreground">
              {isDragging ? "Drop your PDFs here" : "Upload lecture PDFs"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Drag and drop or click to browse
            </p>
          </div>
          
          {/* Multi-file guidance */}
          <div className="flex items-center gap-2 rounded-full bg-secondary/80 px-4 py-2">
            <Files className="h-4 w-4 text-primary" />
            <span className="text-sm text-foreground">
              Upload up to <span className="font-semibold text-primary">{MAX_FILES}</span> PDFs at once
            </span>
          </div>
          
          <Button variant="outline" className="pointer-events-none">
            Choose PDFs
          </Button>
        </div>
      </div>

    </div>
  );
}
