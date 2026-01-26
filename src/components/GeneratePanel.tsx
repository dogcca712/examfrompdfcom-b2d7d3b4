import { useState, useCallback } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { FileUpload } from "./FileUpload";
import { ExamSettings } from "./ExamSettings";
import { ProgressTimeline } from "./ProgressTimeline";
import { ExamResult } from "./ExamResult";
import { ErrorDisplay } from "./ErrorDisplay";
import { ExpiredJobDisplay } from "./ExpiredJobDisplay";
import { Button } from "@/components/ui/button";
import { ExamConfig, ExamJob, defaultExamConfig, isJobExpired } from "@/types/exam";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE, getAccessToken } from "@/lib/api";
import { downloadPdfWithAuth, isLineInAppBrowser } from "@/lib/download";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const POLL_INTERVAL = 2000; // 2 seconds
const GENERATE_TIMEOUT = 300000; // 5 minutes timeout for large uploads

interface GeneratePanelProps {
  selectedJob: ExamJob | null;
  onJobCreate: (job: ExamJob) => void;
  onJobUpdate: (job: ExamJob) => void;
  onClearSelection: () => void;
}

export function GeneratePanel({ selectedJob, onJobCreate, onJobUpdate, onClearSelection }: GeneratePanelProps) {
  const { refreshUsage, isAuthenticated } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [config, setConfig] = useState<ExamConfig>(defaultExamConfig);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<{ message: string; details?: string } | null>(null);

  // Payment state for per-download purchases
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [unlockedJobs, setUnlockedJobs] = useState<Set<string>>(new Set());

  // Answer key generation state (deferred until after payment)
  const [isGeneratingAnswerKey, setIsGeneratingAnswerKey] = useState(false);
  const [answerKeyReady, setAnswerKeyReady] = useState(false);

  const steps = [
    { id: "extract", label: "Extracting text" },
    { id: "write", label: "Writing questions" },
    { id: "format", label: "Formatting" },
    { id: "generate", label: "Generating PDF" },
  ];

  const pollJobStatus = useCallback(
    async (jobId: string, job: ExamJob): Promise<void> => {
      let notFoundRetries = 0;
      const MAX_NOT_FOUND_RETRIES = 5;

      const pollOnce = async (): Promise<{ status: string; error?: string }> => {
        const headers: HeadersInit = {};
        const token = getAccessToken();
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE}/status/${jobId}`, { headers });

        // Handle 404 - job might still be registering
        if (response.status === 404) {
          notFoundRetries++;
          if (notFoundRetries <= MAX_NOT_FOUND_RETRIES) {
            console.log(`Job not found yet, retry ${notFoundRetries}/${MAX_NOT_FOUND_RETRIES}`);
            return { status: "pending" };
          }
          throw new Error("Job not found after multiple retries");
        }

        if (!response.ok) {
          throw new Error(`Failed to check status (${response.status})`);
        }

        notFoundRetries = 0; // Reset on success
        return response.json();
      };

      // Initial delay to give backend time to register the job
      await new Promise((resolve) => setTimeout(resolve, 500));

      return new Promise((resolve, reject) => {
        let stepIndex = 0;

        const poll = async () => {
          try {
            const result = await pollOnce();

            if (result.status === "pending" || result.status === "queued" || result.status === "running") {
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
    },
    [steps.length],
  );

  const generateExam = useCallback(async () => {
    if (files.length === 0) return;

    // Validate total file size
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > MAX_FILE_SIZE) {
      setError({
        message: "Files too large",
        details: `Total size ${(totalSize / (1024 * 1024)).toFixed(2)}MB exceeds 100MB limit.`,
      });
      return;
    }

    // Validate all files are PDFs
    for (const file of files) {
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        setError({
          message: "Invalid file type",
          details: `"${file.name}" is not a PDF file.`,
        });
        return;
      }
    }

    setIsGenerating(true);
    setError(null);
    setCurrentStep(0);

    // Use first file name for job display, indicate multiple files
    const displayName = files.length > 1 ? `${files[0].name} (+${files.length - 1} more)` : files[0].name;

    const newJob: ExamJob = {
      id: crypto.randomUUID(),
      jobId: "",
      fileName: displayName,
      status: "running",
      createdAt: new Date(),
    };
    onJobCreate(newJob);

    try {
      // Step 1: Submit the job with auth
      const formData = new FormData();
      // Append all files with same field name for FastAPI List[UploadFile]
      files.forEach((file) => {
        formData.append("lecture_pdf", file);
      });

      // Append exam settings to the request (send 0 for disabled types)
      formData.append("mcq_count", config.mcqEnabled ? config.mcqCount.toString() : "0");
      formData.append("short_answer_count", config.shortAnswerEnabled ? config.shortAnswerCount.toString() : "0");
      formData.append("long_question_count", config.longQuestionEnabled ? config.longQuestionCount.toString() : "0");
      formData.append("difficulty", config.difficulty);
      if (config.specialRequests.trim()) {
        formData.append("special_requests", config.specialRequests.trim());
      }

      // Get token if available (optional for guest users)
      const token = getAccessToken();

      const headers: HeadersInit = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      let response: Response;
      try {
        // Create AbortController for 5-minute timeout (large uploads need more time)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), GENERATE_TIMEOUT);
        
        response = await fetch(`${API_BASE}/generate`, {
          method: "POST",
          headers,
          body: formData,
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
      } catch (fetchError) {
        // Handle timeout (AbortError)
        if (fetchError instanceof Error && fetchError.name === "AbortError") {
          throw new Error(
            `Request timed out after 5 minutes. Your upload may be too large.\n` +
              `Suggestions:\n` +
              `1. Try uploading fewer PDFs at once\n` +
              `2. Split large documents into smaller files\n` +
              `3. Ensure a stable network connection`,
          );
        }
        // Handle network errors (CORS, connection refused, etc.)
        if (fetchError instanceof TypeError && fetchError.message.includes("fetch")) {
          throw new Error(
            `Network error: Unable to connect to ${API_BASE}. ` +
              `Please check:\n` +
              `1. Backend service is running\n` +
              `2. CORS is configured correctly\n` +
              `3. Network connection is stable`,
          );
        }
        throw fetchError;
      }

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");

        // Provide more specific error messages
        if (response.status === 401 && isAuthenticated) {
          throw new Error("Authentication failed. Please log in again.");
        } else if (response.status === 403) {
          throw new Error("Permission denied. You may have reached your usage limit.");
        } else if (response.status === 404) {
          throw new Error(`Endpoint not found: ${API_BASE}/generate`);
        } else if (response.status >= 500) {
          throw new Error(`Server error (${response.status}): ${errorText || "Internal server error"}`);
        } else {
          throw new Error(`Request failed (${response.status}): ${errorText || "Unknown error"}`);
        }
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

      // Update job as completed (no auto-download - user needs to pay first)
      const completedJob: ExamJob = {
        ...updatedJob,
        status: "done",
        examTitle:
          files.length > 1
            ? `Practice Exam: ${files.length} PDFs Combined`
            : `Practice Exam: ${files[0].name.replace(/\.pdf$/i, "")}`,
        courseCode: "Generated",
        downloadUrl: `${API_BASE}/download/${jobId}?t=${Date.now()}`,
      };
      onJobUpdate(completedJob);
      setFiles([]);
      // Refresh usage after successful generation
      await refreshUsage();
    } catch (err) {
      let errorMessage = "Unknown error occurred";
      let errorDetails = "";

      if (err instanceof Error) {
        errorMessage = err.message;
        // If error message contains newlines, split into message and details
        if (err.message.includes("\n")) {
          const parts = err.message.split("\n");
          errorMessage = parts[0];
          errorDetails = parts.slice(1).join("\n");
        } else {
          errorDetails = err.message;
        }
      } else if (typeof err === "string") {
        errorMessage = err;
        errorDetails = err;
      }

      console.error("Generate exam error:", err);

      setError({
        message: "Failed to generate exam",
        details: errorDetails || errorMessage,
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
  }, [files, config, isAuthenticated, onJobCreate, onJobUpdate, pollJobStatus, refreshUsage]);

  const handleRetry = () => {
    setError(null);
    generateExam();
  };

  const handleDownload = async () => {
    if (selectedJob?.jobId) {
      // Check if running in Line's in-app browser
      if (isLineInAppBrowser()) {
        toast.error("Line 内置浏览器不支持下载文件。请点击右上角菜单，选择「在浏览器中打开」后重试。", {
          duration: 8000,
        });
        return;
      }

      const examFileName = `${selectedJob.fileName.replace(/\.pdf$/i, "")}_exam.pdf`;
      try {
        await downloadPdfWithAuth(`/download/${selectedJob.jobId}`, examFileName);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Download failed";
        toast.error(message);
      }
    }
  };

  // Handle answer key download
  const handleDownloadAnswerKey = async () => {
    if (selectedJob?.jobId) {
      if (isLineInAppBrowser()) {
        toast.error(
          "Line browser does not support downloads. Please tap ⋮ in the top right and select 'Open in Browser'",
          { duration: 8000 },
        );
        return;
      }

      const answerFileName = `${selectedJob.fileName.replace(/\.pdf$/i, "")}_answer_key.pdf`;
      try {
        await downloadPdfWithAuth(`/download_answer/${selectedJob.jobId}`, answerFileName);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Download failed";
        toast.error(message);
      }
    }
  };

  // Handle unlock purchase - triggers answer key generation after payment
  const handleUnlockPurchase = async () => {
    if (!selectedJob?.jobId) return;

    setIsPurchasing(true);
    try {
      const token = getAccessToken();
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE}/payments/purchase-download`, {
        method: "POST",
        headers,
        body: JSON.stringify({ job_id: selectedJob.jobId }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Payment failed");
        throw new Error(errorText);
      }

      const data = await response.json();

      // If backend returns a checkout URL, redirect to Stripe
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
        return;
      }

      // Payment successful - mark as unlocked and start answer key generation
      setUnlockedJobs((prev) => new Set(prev).add(selectedJob.jobId));
      toast.success("Payment successful! Generating answer key...");

      // Start generating answer key
      await generateAnswerKey(selectedJob.jobId);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Payment failed";
      toast.error(message);
    } finally {
      setIsPurchasing(false);
    }
  };

  // Generate answer key after payment
  const generateAnswerKey = async (jobId: string) => {
    setIsGeneratingAnswerKey(true);
    setAnswerKeyReady(false);

    try {
      const token = getAccessToken();
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Tell backend to start generating answer key
      const response = await fetch(`${API_BASE}/generate_answer/${jobId}`, {
        method: "POST",
        headers,
      });

      if (!response.ok) {
        throw new Error("Failed to start answer key generation");
      }

      // Poll for answer key completion
      await pollAnswerKeyStatus(jobId);

      setAnswerKeyReady(true);
      toast.success("Answer key is ready!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate answer key";
      toast.error(message);
      // Still mark as ready to allow retry via download button
      setAnswerKeyReady(true);
    } finally {
      setIsGeneratingAnswerKey(false);
    }
  };

  // Poll for answer key generation status
  const pollAnswerKeyStatus = async (jobId: string): Promise<void> => {
    const token = getAccessToken();
    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const response = await fetch(`${API_BASE}/answer_status/${jobId}`, { headers });

          if (!response.ok) {
            throw new Error("Failed to check answer key status");
          }

          const result = await response.json();

          if (result.status === "done") {
            resolve();
          } else if (result.status === "failed") {
            reject(new Error(result.error || "Answer key generation failed"));
          } else {
            // Still generating, keep polling
            setTimeout(poll, POLL_INTERVAL);
          }
        } catch (err) {
          reject(err);
        }
      };

      poll();
    });
  };

  // Store files and config for regeneration
  const [savedFiles, setSavedFiles] = useState<File[]>([]);
  const [savedConfig, setSavedConfig] = useState<ExamConfig | null>(null);

  const handleRegenerate = () => {
    // Restore saved files and config, allowing user to modify settings
    if (savedFiles.length > 0) {
      setFiles(savedFiles);
    }
    if (savedConfig) {
      setConfig(savedConfig);
    }
    setError(null);
    // Clear selection to go back to upload view
    onClearSelection();
  };

  // Save files and config before generating
  const handleGenerate = async () => {
    if (files.length === 0) return;
    setSavedFiles([...files]);
    setSavedConfig({ ...config });
    await generateExam();
  };

  // Check if current job is unlocked
  // DEV MODE: Set VITE_MOCK_PAYMENT=true to bypass payment for testing
  const isMockPaymentEnabled = import.meta.env.VITE_MOCK_PAYMENT === "true";
  const isCurrentJobUnlocked =
    isMockPaymentEnabled || (selectedJob?.jobId ? unlockedJobs.has(selectedJob.jobId) : false);

  // Show expired state for old jobs
  if (selectedJob?.status === "done" && isJobExpired(selectedJob) && !isGenerating) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-8">
        <ExpiredJobDisplay job={selectedJob} onNewExam={onClearSelection} />
      </div>
    );
  }

  // Show result for completed job
  if (selectedJob?.status === "done" && !isGenerating) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-2">
        <ExamResult
          job={selectedJob}
          onDownload={handleDownload}
          onDownloadAnswerKey={handleDownloadAnswerKey}
          onRegenerate={handleRegenerate}
          onUnlockPurchase={handleUnlockPurchase}
          isUnlocked={isCurrentJobUnlocked}
          isPurchasing={isPurchasing}
          isGeneratingAnswerKey={isGeneratingAnswerKey}
          answerKeyReady={answerKeyReady}
        />
      </div>
    );
  }

  const handleBackToHome = () => {
    setError(null);
    setFiles([]);
  };

  // Show error state
  if (error && !isGenerating) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <ErrorDisplay message={error.message} details={error.details} onRetry={handleRetry} onBack={handleBackToHome} />
      </div>
    );
  }

  // Show progress during generation
  // Calculate estimated pages for time estimate
  const estimatePages = (size: number) => Math.max(1, Math.round(size / 100000));
  const totalPages = savedFiles.reduce((sum, f) => sum + estimatePages(f.size), 0);
  const isLargeUpload = savedFiles.length > 10 || totalPages > 300;
  
  if (isGenerating) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-16">
        <div className="mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Generating your exam...</h2>
          <p className="mt-2 text-base text-muted-foreground">
            {isLargeUpload 
              ? `Processing ${savedFiles.length} PDFs (~${totalPages} pages). This may take 3-5 minutes.`
              : "This usually takes 30-60 seconds"
            }
          </p>
          {savedFiles.length > 1 && (
            <p className="mt-1 text-sm text-muted-foreground/80">
              📄 {savedFiles.length} files combined
            </p>
          )}
        </div>
        <ProgressTimeline steps={steps} currentStep={currentStep} />
        {isLargeUpload && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            ⏳ Large upload detected. Please keep this page open and don't refresh.
          </p>
        )}
      </div>
    );
  }

  // Default: Upload state
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          AI-Powered PDF Practice Exam Generator
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Upload your lecture PDF and instantly create AI-generated practice exams and quizzes. Designed for students
          and teachers.
        </p>
      </div>

      <div className="space-y-6">
        <FileUpload files={files} onFilesChange={setFiles} disabled={isGenerating} />

        {files.length > 0 && (
          <>
            {/* Show settings for all users */}
            <ExamSettings config={config} onChange={setConfig} disabled={isGenerating} />

            <Button onClick={handleGenerate} size="xl" variant="gradient" className="w-full" disabled={isGenerating}>
              <Sparkles className="mr-2 h-5 w-5" />
              Generate Exam
            </Button>

            {/* Pricing info */}
            <p className="text-center text-sm text-muted-foreground">
              💰 $0.99 per exam download (includes answer key)
            </p>
          </>
        )}
      </div>
    </div>
  );
}
