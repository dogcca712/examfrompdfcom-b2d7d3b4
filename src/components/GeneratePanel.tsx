import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
const SINGLE_UPLOAD_TIMEOUT = 60000; // 1 minute per file

interface GeneratePanelProps {
  selectedJob: ExamJob | null;
  onJobCreate: (job: ExamJob) => void;
  onJobUpdate: (job: ExamJob) => void;
  onClearSelection: () => void;
  onSelectJobById?: (jobId: string) => void;
}

export function GeneratePanel({ selectedJob, onJobCreate, onJobUpdate, onClearSelection, onSelectJobById }: GeneratePanelProps) {
  const { refreshUsage, isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [files, setFiles] = useState<File[]>([]);
  const [config, setConfig] = useState<ExamConfig>(defaultExamConfig);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progressInfo, setProgressInfo] = useState<{
    message?: string;
    current?: number;
    total?: number;
  } | null>(null);
  const [error, setError] = useState<{ message: string; details?: string } | null>(null);
  const [uploadPhase, setUploadPhase] = useState<'idle' | 'uploading' | 'processing'>('idle');
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);

  // Payment state for per-download purchases
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [unlockedJobs, setUnlockedJobs] = useState<Set<string>>(new Set());

  // Answer key generation state (deferred until after payment)
  const [isGeneratingAnswerKey, setIsGeneratingAnswerKey] = useState(false);
  const [answerKeyReady, setAnswerKeyReady] = useState(false);

  // Handle payment success callback from Stripe
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    const returnedJobId = searchParams.get("job_id");
    const pendingJobId = localStorage.getItem("pending_payment_job_id");
    
    // Check if this is a payment success callback
    if (paymentStatus === "success" && (returnedJobId || pendingJobId)) {
      const jobIdToUnlock = returnedJobId || pendingJobId;
      
      // Clear the URL parameters and localStorage
      searchParams.delete("payment");
      searchParams.delete("job_id");
      setSearchParams(searchParams, { replace: true });
      localStorage.removeItem("pending_payment_job_id");
      
      // Mark job as unlocked
      setUnlockedJobs((prev) => new Set(prev).add(jobIdToUnlock!));
      toast.success("支付成功！正在生成答案...");
      
      // Select the job if callback provided
      if (onSelectJobById && jobIdToUnlock) {
        onSelectJobById(jobIdToUnlock);
      }
      
      // Start generating answer key
      generateAnswerKey(jobIdToUnlock!);
    } else if (paymentStatus === "cancel") {
      // Payment was cancelled
      searchParams.delete("payment");
      searchParams.delete("job_id");
      setSearchParams(searchParams, { replace: true });
      localStorage.removeItem("pending_payment_job_id");
      toast.error("支付已取消");
    }
  }, [searchParams, setSearchParams, onSelectJobById]);

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

      // Map backend stage to step index
      const stageToStep: Record<string, number> = {
        counting: 0,    // 统计PDF页数
        extracting: 0,  // 提取文本
        writing: 1,     // 生成题目 (generating in API)
        generating: 1,  // 生成题目 (alias)
        formatting: 2,  // 格式化
      };

      const pollOnce = async (): Promise<{
        status: string;
        error?: string;
        progress?: {
          stage: string;
          current: number;
          total: number;
          message: string;
        };
      }> => {
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
              // Update progress from backend if available
              if (result.progress) {
                const newStep = stageToStep[result.progress.stage] ?? stepIndex;
                setCurrentStep(newStep);
                setProgressInfo({
                  message: result.progress.message,
                  current: result.progress.current,
                  total: result.progress.total,
                });
              } else {
                // Fallback: increment step locally
                if (stepIndex < steps.length - 1) {
                  stepIndex++;
                  setCurrentStep(stepIndex);
                }
              }
              setTimeout(poll, POLL_INTERVAL);
            } else if (result.status === "done") {
              setCurrentStep(steps.length - 1);
              setProgressInfo(null);
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

  // Upload a single file to backend
  const uploadSingleFile = useCallback(async (file: File, sessionId: string, token: string | null): Promise<void> => {
    const formData = new FormData();
    formData.append("file", file);  // 字段名必须是 'file'
    formData.append("session_id", sessionId);

    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), SINGLE_UPLOAD_TIMEOUT);

    try {
      const response = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        headers,
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Upload failed");
        throw new Error(`Failed to upload ${file.name}: ${errorText}`);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === "AbortError") {
        throw new Error(`Upload timeout for ${file.name}. Please check your network connection.`);
      }
      throw err;
    }
  }, []);

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
    setProgressInfo(null);
    setUploadPhase('uploading');
    setUploadProgress({ current: 0, total: files.length });

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

    // Get token if available (optional for guest users)
    const token = getAccessToken();

    try {
      // Generate a unique session ID for this batch upload
      const sessionId = crypto.randomUUID();

      // Step 1: Upload files one by one
      for (let i = 0; i < files.length; i++) {
        setUploadProgress({ current: i + 1, total: files.length });
        await uploadSingleFile(files[i], sessionId, token);
      }

      // Step 2: Trigger generation with session ID and config
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const generateResponse = await fetch(`${API_BASE}/generate`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          session_id: sessionId,
          mcq_count: config.mcqEnabled ? config.mcqCount : 0,
          short_answer_count: config.shortAnswerEnabled ? config.shortAnswerCount : 0,
          long_question_count: config.longQuestionEnabled ? config.longQuestionCount : 0,
          difficulty: config.difficulty,
          special_requests: config.specialRequests.trim() || undefined,
        }),
      });

      if (!generateResponse.ok) {
        const errorText = await generateResponse.text().catch(() => "Unknown error");

        if (generateResponse.status === 401 && isAuthenticated) {
          throw new Error("Authentication failed. Please log in again.");
        } else if (generateResponse.status === 403) {
          throw new Error("Permission denied. You may have reached your usage limit.");
        } else if (generateResponse.status === 404) {
          throw new Error(`Endpoint not found: ${API_BASE}/generate`);
        } else if (generateResponse.status >= 500) {
          throw new Error(`Server error (${generateResponse.status}): ${errorText || "Internal server error"}`);
        } else {
          throw new Error(`Request failed (${generateResponse.status}): ${errorText || "Unknown error"}`);
        }
      }

      const data = await generateResponse.json();
      const jobId = data.job_id;

      if (!jobId) {
        throw new Error("No job_id returned from server");
      }

      // Update job with real jobId
      const updatedJob: ExamJob = { ...newJob, jobId };
      onJobUpdate(updatedJob);

      // Step 2: Poll for status - now in processing phase
      setUploadPhase('processing');
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
      setUploadPhase('idle');
      setUploadProgress(null);
    }
  }, [files, config, isAuthenticated, onJobCreate, onJobUpdate, pollJobStatus, refreshUsage, uploadSingleFile]);

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
        // Store job ID for return handling
        localStorage.setItem("pending_payment_job_id", selectedJob.jobId);
        
        // Try multiple redirect methods for better browser compatibility
        // Some in-app browsers (Line, WeChat) may block window.location.href
        try {
          // First try: direct assignment (most reliable for normal browsers)
          window.location.href = data.checkout_url;
          
          // Set a timeout to check if redirect failed
          setTimeout(() => {
            // If we're still here after 2 seconds, try alternative methods
            const newWindow = window.open(data.checkout_url, "_blank");
            if (!newWindow || newWindow.closed) {
              // Popup was blocked, show manual link
              setIsPurchasing(false);
              toast.error(
                "无法自动跳转到支付页面。请在浏览器中打开此链接完成支付。",
                {
                  duration: 10000,
                  action: {
                    label: "复制链接",
                    onClick: () => {
                      navigator.clipboard.writeText(data.checkout_url);
                      toast.success("支付链接已复制！");
                    },
                  },
                }
              );
            }
          }, 2000);
        } catch (redirectError) {
          console.error("Redirect failed:", redirectError);
          // Fallback: try window.open
          const newWindow = window.open(data.checkout_url, "_blank");
          if (!newWindow || newWindow.closed) {
            toast.error("请在浏览器中打开完成支付", { duration: 5000 });
          }
        }
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
    // Calculate progress percentage from backend data
    const progressPercent = progressInfo?.current && progressInfo?.total
      ? Math.round((progressInfo.current / progressInfo.total) * 100)
      : null;

    // Calculate total file size for upload display
    const totalSizeMB = savedFiles.reduce((sum, f) => sum + f.size, 0) / (1024 * 1024);

    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-16">
        <div className="mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            {uploadPhase === 'uploading' ? 'Uploading files...' : 'Generating your exam...'}
          </h2>
          <p className="mt-2 text-base text-muted-foreground">
            {uploadPhase === 'uploading' 
              ? uploadProgress 
                ? `Uploading file ${uploadProgress.current} of ${uploadProgress.total}...`
                : `Preparing to upload ${savedFiles.length} PDF${savedFiles.length > 1 ? 's' : ''}...`
              : progressInfo?.message 
                ? progressInfo.message
                : isLargeUpload 
                  ? `Processing ${savedFiles.length} PDFs (~${totalPages} pages). This may take 3-5 minutes.`
                  : "This usually takes 30-60 seconds"
            }
          </p>
          {uploadPhase === 'uploading' && (
            <p className="text-sm text-muted-foreground mt-1">
              ⏳ Please keep this page open. Do not refresh or navigate away.
            </p>
          )}
          {progressPercent !== null && uploadPhase === 'processing' && (
            <p className="mt-2 text-lg font-semibold text-primary">
              {progressPercent}% complete
            </p>
          )}
          {savedFiles.length > 1 && uploadPhase === 'processing' && !progressInfo?.message && (
            <p className="mt-1 text-sm text-muted-foreground/80">
              📄 {savedFiles.length} files combined
            </p>
          )}
        </div>
        
        {uploadPhase === 'uploading' ? (
          <div className="rounded-2xl border border-border bg-card p-8 sm:p-10 shadow-lg">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-primary/30 animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-12 w-12 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                </div>
              </div>
              <p className="text-lg font-medium text-foreground">
                {uploadProgress 
                  ? `Uploading ${uploadProgress.current}/${uploadProgress.total}...`
                  : 'Preparing upload...'
                }
              </p>
              <p className="text-sm text-muted-foreground">
                {savedFiles.length} file{savedFiles.length > 1 ? 's' : ''} • {totalSizeMB.toFixed(1)} MB total
              </p>
              {uploadProgress && (
                <div className="w-full max-w-xs bg-secondary rounded-full h-2 mt-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <ProgressTimeline 
            steps={steps} 
            currentStep={currentStep}
            progressMessage={progressInfo?.message}
            progressCurrent={progressInfo?.current}
            progressTotal={progressInfo?.total}
          />
        )}
        
        {isLargeUpload && uploadPhase === 'processing' && (
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
