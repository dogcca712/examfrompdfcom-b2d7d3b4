import { useState, useCallback, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { HowItWorks } from "@/components/HowItWorks";
import { Features } from "@/components/Features";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { GeneratePanel } from "@/components/GeneratePanel";
import { ExamJob } from "@/types/exam";
import { jobsApi, API_BASE } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState<ExamJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch jobs on mount and when auth state changes
  useEffect(() => {
    // Clear jobs when user logs out
    if (!isAuthenticated) {
      setJobs([]);
      setSelectedJobId(null);
      setIsLoadingJobs(false);
      return;
    }

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
  }, [isAuthenticated]);

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
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top Navigation Header */}
      <Header 
        showMenuButton={isAuthenticated}
        onMenuClick={() => setIsSidebarOpen(true)}
      />
      
      <div className="flex flex-1 flex-col pt-20">
        {/* Sidebar - controlled by Header menu button */}
        <Sidebar
          jobs={jobs}
          selectedJobId={selectedJobId}
          onSelectJob={setSelectedJobId}
          onNewExam={handleNewExam}
          onDeleteJob={handleDeleteJob}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {/* Hero / Generate Panel Section */}
          <section className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center py-12 px-4">
            <GeneratePanel
              selectedJob={selectedJob}
              onJobCreate={handleJobCreate}
              onJobUpdate={handleJobUpdate}
              onClearSelection={handleNewExam}
            />
          </section>

          {/* How It Works Section */}
          <HowItWorks />

          {/* Features Section */}
          <Features />

          {/* Pricing Section */}
          <Pricing />

          {/* FAQ Section */}
          <FAQ />

          {/* Footer */}
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Index;
