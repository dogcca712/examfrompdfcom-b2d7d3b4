import { useState, useCallback } from "react";
import { Sparkles } from "lucide-react";
import { FileUpload } from "./FileUpload";
import { ExamSettings } from "./ExamSettings";
import { ProgressTimeline } from "./ProgressTimeline";
import { ExamResult } from "./ExamResult";
import { ErrorDisplay } from "./ErrorDisplay";
import { Button } from "@/components/ui/button";
import { ExamConfig, ExamJob, defaultExamConfig } from "@/types/exam";

const API_BASE = "https://api.examfrompdf.com";
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const POLL_INTERVAL = 2000; // 2 seconds

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


  const pollJobStatus = useCallback(async (jobId: string, job: ExamJob): Promise<void> => {
    const pollOnce = async (): Promise<{ status: string; error?: string }> => {
      const response = await fetch(`${API_BASE}/status/${jobId}`);
      if (!response.ok) {
        throw new Error(`Failed to check status (${response.status})`);
      }
      return response.json();
    };

    return new Promise((resolve, reject) => {
      let stepIndex = 0;
      
      const poll = async () => {
        try {
          const result = await pollOnce();
          
          if (result.status === "queued" || result.status === "running") {
            // Update progress step
            if (stepIndex < steps.length - 1) {
              stepIndex++;
              setCurrentStep(stepIndex);
            }
            setTimeout(poll, POLL_INTERVAL);
          } else if (result.status === "done") {
            setCurrentStep(steps.length - 1);
            resolve();
          } else if (result.status === "failed") {
            reject(new Error(result.error || "Job failed"));
          } else {
            // Unknown status, keep polling
            setTimeout(poll, POLL_INTERVAL);
          }
        } catch (err) {
          reject(err);
        }
      };

      poll();
    });
  }, [steps.length]);

  const triggerDownload = (jobId: string, fileName: string) => {
    const downloadUrl = `${API_BASE}/download/${jobId}`;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      jobId: "",
      fileName: file.name,
      status: "running",
      createdAt: new Date(),
    };
    onJobCreate(newJob);

    try {
      // Step 1: Submit the job
      const formData = new FormData();
      formData.append("lecture_pdf", file);

      const response = await fetch(`${API_BASE}/generate`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        throw new Error(`Server error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      const jobId = data.job_id;

      if (!jobId) {
        throw new Error("No job_id returned from server");
      }

      // Update job with real jobId
      const updatedJob: ExamJob = { ...newJob, jobId };
      onJobUpdate(updatedJob);

      // Step 2: Poll for status
      setCurrentStep(1);
      await pollJobStatus(jobId, updatedJob);

      // Step 3: Trigger download
      const baseFileName = file.name.replace(/\.pdf$/i, "");
      const examFileName = `${baseFileName}_exam.pdf`;
      triggerDownload(jobId, examFileName);

      // Update job as completed
      const completedJob: ExamJob = {
        ...updatedJob,
        status: "done",
        examTitle: `Practice Exam: ${baseFileName}`,
        courseCode: "Generated",
        downloadUrl: `${API_BASE}/download/${jobId}`,
      };
      onJobUpdate(completedJob);
      setFile(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      
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
    } finally {
      setIsGenerating(false);
    }
  }, [file, onJobCreate, onJobUpdate, pollJobStatus]);

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
      // Download URL is now a direct API endpoint
      const link = document.createElement("a");
      link.href = selectedJob.downloadUrl;
      link.download = `${selectedJob.fileName.replace(/\.pdf$/i, "")}_exam.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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

  const handleBackToHome = () => {
    setError(null);
    setFile(null);
  };

  // Show error state
  if (error && !isGenerating) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <ErrorDisplay
          message={error.message}
          details={error.details}
          onRetry={handleRetry}
          onBack={handleBackToHome}
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
