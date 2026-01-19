import { useCallback, useState } from "react";
import { Upload, FileText, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  onTrySample: () => void;
  disabled?: boolean;
}

export function FileUpload({
  file,
  onFileSelect,
  onTrySample,
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

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile && droppedFile.type === "application/pdf") {
        onFileSelect(droppedFile);
      }
    },
    [onFileSelect]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile && selectedFile.type === "application/pdf") {
        onFileSelect(selectedFile);
      }
    },
    [onFileSelect]
  );

  const estimatePages = (size: number) => {
    // Rough estimate: 100KB per page
    return Math.max(1, Math.round(size / 100000));
  };

  if (file) {
    return (
      <div className="animate-fade-in rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-medium text-foreground">{file.name}</h3>
            <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
              <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              <span>•</span>
              <span>~{estimatePages(file.size)} pages</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onFileSelect(null)}
            disabled={disabled}
            className="shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

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
              {isDragging ? "Drop your PDF here" : "Upload a lecture PDF"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Drag and drop or click to browse
            </p>
          </div>
          <Button variant="outline" className="pointer-events-none">
            Choose PDF
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <Button
          variant="ghost"
          onClick={onTrySample}
          disabled={disabled}
          className="text-muted-foreground hover:text-foreground"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Try a sample PDF
        </Button>
      </div>
    </div>
  );
}
