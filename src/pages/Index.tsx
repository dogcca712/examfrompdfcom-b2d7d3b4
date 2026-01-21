import { useState, useCallback, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { GeneratePanel } from "@/components/GeneratePanel";
import { ExamJob } from "@/types/exam";
import { jobsApi, API_BASE } from "@/lib/api";

const Index = () => {
  const [jobs, setJobs] = useState<ExamJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);

  // Fetch jobs on mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await jobsApi.getJobs();
        const mappedJobs: ExamJob[] = response.jobs.map((job) => ({
          id: job.id,
          jobId: job.jobId || job.id,
          fileName: job.fileName,
          status: job.status,
          createdAt: new Date(job.createdAt),
          downloadUrl: job.downloadUrl
            ? job.downloadUrl.startsWith("http")
              ? job.downloadUrl
              : `${API_BASE}${job.downloadUrl}`
            : undefined,
          error: job.error,
        }));
        setJobs(mappedJobs);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setIsLoadingJobs(false);
      }
    };
    fetchJobs();
  }, []);

  const selectedJob = jobs.find((job) => job.id === selectedJobId) || null;

  const handleJobCreate = useCallback((job: ExamJob) => {
    setJobs((prev) => [job, ...prev]);
    setSelectedJobId(job.id);
  }, []);

  const handleJobUpdate = useCallback((updatedJob: ExamJob) => {
    setJobs((prev) =>
      prev.map((job) => (job.id === updatedJob.id ? updatedJob : job))
    );
  }, []);

  const handleNewExam = useCallback(() => {
    setSelectedJobId(null);
  }, []);

  const handleDeleteJob = useCallback(
    (id: string) => {
      setJobs((prev) => prev.filter((job) => job.id !== id));
      if (selectedJobId === id) {
        setSelectedJobId(null);
      }
    },
    [selectedJobId]
  );

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        jobs={jobs}
        selectedJobId={selectedJobId}
        onSelectJob={setSelectedJobId}
        onNewExam={handleNewExam}
        onDeleteJob={handleDeleteJob}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="flex min-h-full flex-col items-center justify-center py-12">
          <GeneratePanel
            selectedJob={selectedJob}
            onJobCreate={handleJobCreate}
            onJobUpdate={handleJobUpdate}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
