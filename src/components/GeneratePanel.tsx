import { useState, useCallback } from "react";
import { Sparkles } from "lucide-react";
import { FileUpload } from "./FileUpload";
import { ExamSettings } from "./ExamSettings";
import { ProgressTimeline } from "./ProgressTimeline";
import { ExamResult } from "./ExamResult";
import { ErrorDisplay } from "./ErrorDisplay";
import { Button } from "@/components/ui/button";
import { ExamConfig, ExamJob, defaultExamConfig } from "@/types/exam";

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

  const simulateGeneration = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    setCurrentStep(0);

    const newJob: ExamJob = {
      id: crypto.randomUUID(),
      jobId: crypto.randomUUID(),
      fileName: file?.name || "sample-lecture.pdf",
      status: "running",
      createdAt: new Date(),
    };
    onJobCreate(newJob);

    // Simulate progress through steps
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 + Math.random() * 1000)
      );
    }

    // Simulate success
    const completedJob: ExamJob = {
      ...newJob,
      status: "done",
      examTitle: "Practice Exam: Introduction to Computer Science",
      courseCode: "CS101",
      totalPages: 4,
      downloadUrl: "#demo-download",
    };
    onJobUpdate(completedJob);
    setIsGenerating(false);
    setFile(null);
  }, [file, onJobCreate, onJobUpdate, steps.length]);

  const handleGenerate = async () => {
    if (!file) return;
    await simulateGeneration();
  };

  const handleRetry = () => {
    setError(null);
    handleGenerate();
  };

  const handleDownload = () => {
    // In real implementation, this would download the actual PDF
    console.log("Downloading exam:", selectedJob?.downloadUrl);
  };

  const handleRegenerate = () => {
    if (selectedJob) {
      const mockFile = new File(
        ["Regenerated content"],
        selectedJob.fileName,
        { type: "application/pdf" }
      );
      setFile(mockFile);
      simulateGeneration();
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
