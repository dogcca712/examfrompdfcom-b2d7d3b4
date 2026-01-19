import { useState, useCallback, useRef } from "react";
import { Sparkles } from "lucide-react";
import { FileUpload } from "./FileUpload";
import { ExamSettings } from "./ExamSettings";
import { ProgressTimeline } from "./ProgressTimeline";
import { ExamResult } from "./ExamResult";
import { ErrorDisplay } from "./ErrorDisplay";
import { Button } from "@/components/ui/button";
import { ExamConfig, ExamJob, defaultExamConfig } from "@/types/exam";

const API_ENDPOINT = "http://23.21.31.3/generate";
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

interface GeneratePanelProps {
  selectedJob: ExamJob | null;
  onJobCreate: (job: ExamJob) => void;
  onJobUpdate: (job: ExamJob) => void;
}

export function GeneratePanel({
  selectedJob,
  onJobCreate,
  onJobUpdate,
}: GeneratePanelProps) {
  const [file, setFile] = useState<File | null>(null);
  const [config, setConfig] = useState<ExamConfig>(defaultExamConfig);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<{ message: string; details?: string } | null>(
    null
  );
  const abortControllerRef = useRef<AbortController | null>(null);

  const steps = [
    { id: "extract", label: "Extracting text" },
    { id: "write", label: "Writing questions" },
    { id: "format", label: "Formatting" },
    { id: "generate", label: "Generating PDF" },
  ];

  const handleTrySample = () => {
    // Create a mock sample file for demo purposes
    const sampleBlob = new Blob(["Sample PDF content"], {
      type: "application/pdf",
    });
    const sampleFile = new File([sampleBlob], "sample-lecture.pdf", {
      type: "application/pdf",
    });
    setFile(sampleFile);
  };

  const downloadPdf = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateExam = useCallback(async () => {
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError({
        message: "File too large",
        details: `Maximum file size is 20MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`,
      });
      return;
    }

    // Validate file type
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError({
        message: "Invalid file type",
        details: "Please upload a PDF file.",
      });
      return;
    }

    setIsGenerating(true);
    setError(null);
    setCurrentStep(0);

    const newJob: ExamJob = {
      id: crypto.randomUUID(),
      jobId: crypto.randomUUID(),
      fileName: file.name,
      status: "running",
      createdAt: new Date(),
    };
    onJobCreate(newJob);

    // Create abort controller for timeout
    abortControllerRef.current = new AbortController();

    // Simulate progress through steps while waiting for API
    const progressInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 12000); // Move to next step every 12 seconds

    try {
      const formData = new FormData();
      formData.append("lecture_pdf", file);

      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        body: formData,
        signal: abortControllerRef.current.signal,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        throw new Error(`Server error (${response.status}): ${errorText}`);
      }

      // Check if response is a PDF
      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/pdf")) {
        throw new Error("Server did not return a PDF file");
      }

      const pdfBlob = await response.blob();
      
      // Generate filename
      const baseFileName = file.name.replace(/\.pdf$/i, "");
      const examFileName = `${baseFileName}_exam.pdf`;

      // Trigger download
      downloadPdf(pdfBlob, examFileName);

      // Create object URL for potential re-download
      const downloadUrl = URL.createObjectURL(pdfBlob);

      // Update job as completed
      const completedJob: ExamJob = {
        ...newJob,
        status: "done",
        examTitle: `Practice Exam: ${baseFileName}`,
        courseCode: "Generated",
        totalPages: Math.ceil(pdfBlob.size / 50000), // Rough estimate
        downloadUrl,
      };
      onJobUpdate(completedJob);
      setCurrentStep(steps.length - 1);
      setFile(null);
    } catch (err) {
      clearInterval(progressInterval);
      
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      const isAborted = err instanceof Error && err.name === "AbortError";
      
      if (!isAborted) {
        setError({
          message: "Failed to generate exam",
          details: errorMessage,
        });

        // Update job as failed
        const failedJob: ExamJob = {
          ...newJob,
          status: "failed",
          error: errorMessage,
        };
        onJobUpdate(failedJob);
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  }, [file, onJobCreate, onJobUpdate, steps.length]);

  const handleGenerate = async () => {
    if (!file) return;
    await generateExam();
  };

  const handleRetry = () => {
    setError(null);
    handleGenerate();
  };

  const handleDownload = () => {
    if (selectedJob?.downloadUrl) {
      // For blob URLs, we need to fetch and re-download
      if (selectedJob.downloadUrl.startsWith("blob:")) {
        fetch(selectedJob.downloadUrl)
          .then((res) => res.blob())
          .then((blob) => {
            const baseFileName = selectedJob.fileName.replace(/\.pdf$/i, "");
            downloadPdf(blob, `${baseFileName}_exam.pdf`);
          })
          .catch(() => {
            setError({
              message: "Download expired",
              details: "Please generate the exam again.",
            });
          });
      } else {
        window.open(selectedJob.downloadUrl, "_blank");
      }
    }
  };

  const handleRegenerate = () => {
    if (selectedJob) {
      // Note: For regeneration, user needs to re-upload the file
      // since we don't store the original file
      setError(null);
      setFile(null);
    }
  };

  // Show result for completed job
  if (selectedJob?.status === "done" && !isGenerating) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <ExamResult
          job={selectedJob}
          onDownload={handleDownload}
          onRegenerate={handleRegenerate}
        />
      </div>
    );
  }

  // Show error state
  if (error && !isGenerating) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <ErrorDisplay
          message={error.message}
          details={error.details}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  // Show progress during generation
  if (isGenerating) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold text-foreground">
            Generating your exam...
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            This usually takes 30-60 seconds
          </p>
        </div>
        <ProgressTimeline steps={steps} currentStep={currentStep} />
      </div>
    );
  }

  // Default: Upload state
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Generate Practice Exams
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Upload your lecture PDF and get a professionally formatted exam in seconds.
        </p>
      </div>

      <div className="space-y-6">
        <FileUpload
          file={file}
          onFileSelect={setFile}
          onTrySample={handleTrySample}
          disabled={isGenerating}
        />

        {file && (
          <>
            <ExamSettings
              config={config}
              onChange={setConfig}
              disabled={isGenerating}
            />

            <Button
              onClick={handleGenerate}
              size="xl"
              variant="gradient"
              className="w-full"
              disabled={isGenerating}
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Generate Exam
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
