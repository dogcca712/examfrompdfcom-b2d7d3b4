import { useState, useCallback, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { HowItWorks } from "@/components/HowItWorks";
import { Features } from "@/components/Features";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { GeneratePanel } from "@/components/GeneratePanel";
import { ExamJob, isJobExpired } from "@/types/exam";
import { jobsApi, API_BASE } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useCanonical } from "@/hooks/useCanonical";

const GUEST_JOBS_KEY = "guest_jobs";

// Helper to load guest jobs from localStorage (with 7-day expiration cleanup)
function loadGuestJobs(): ExamJob[] {
  try {
    const stored = localStorage.getItem(GUEST_JOBS_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    
    // Convert and filter expired jobs
    const jobs: ExamJob[] = parsed
      .map((j: any) => ({
        ...j,
        createdAt: new Date(j.createdAt),
      }))
      .filter((job: ExamJob) => !isJobExpired(job));
    
    return jobs;
  } catch (e) {
    console.error("Failed to load guest jobs:", e);
    return [];
  }
}

// Helper to save guest jobs to localStorage
function saveGuestJobs(jobs: ExamJob[]) {
  try {
    // Only keep non-expired jobs
    const validJobs = jobs.filter((job) => !isJobExpired(job));
    localStorage.setItem(GUEST_JOBS_KEY, JSON.stringify(validJobs));
  } catch (e) {
    console.error("Failed to save guest jobs:", e);
  }
}

const Index = () => {
  useCanonical();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [jobs, setJobs] = useState<ExamJob[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Persist selected job ID so it survives page refresh
  const [selectedJobId, setSelectedJobId] = useState<string | null>(() => {
    return localStorage.getItem("selected_job_id");
  });

  // Sync selectedJobId to localStorage
  useEffect(() => {
    if (selectedJobId) {
      localStorage.setItem("selected_job_id", selectedJobId);
    } else {
      localStorage.removeItem("selected_job_id");
    }
  }, [selectedJobId]);

  // Track pending job selection (for payment callback)
  const [pendingSelectJobId, setPendingSelectJobId] = useState<string | null>(() => {
    // Check if there's a pending payment job to select on mount
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success") {
      return params.get("job_id") || localStorage.getItem("pending_payment_job_id");
    }
    return null;
  });

  // Fetch jobs on mount and when auth state changes
  useEffect(() => {
    // Wait for auth to finish loading before deciding which path to take
    if (isAuthLoading) {
      return;
    }
    
    // For anonymous users: load from localStorage
    if (!isAuthenticated) {
      const guestJobs = loadGuestJobs();
      setJobs(guestJobs);
      
      // Handle pending job selection for anonymous users too
      if (pendingSelectJobId) {
        const pendingJob = guestJobs.find((j) => j.jobId === pendingSelectJobId);
        if (pendingJob) {
          setSelectedJobId(pendingJob.id);
          // Only clear pending after successfully selecting
          setPendingSelectJobId(null);
        }
        // If not found, keep pendingSelectJobId for when user logs in
      }
      
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
          // Ensure UTC parsing: append 'Z' if no timezone info
          createdAt: new Date(job.createdAt.endsWith('Z') ? job.createdAt : job.createdAt + 'Z'),
          downloadUrl: job.downloadUrl
            ? job.downloadUrl.startsWith("http")
              ? job.downloadUrl
              : `${API_BASE}${job.downloadUrl}`
            : undefined,
          error: job.error,
        }));
        setJobs(mappedJobs);
        
        // After loading jobs, check if we need to select a pending job
        if (pendingSelectJobId) {
          const pendingJob = mappedJobs.find((j) => j.jobId === pendingSelectJobId);
          if (pendingJob) {
            setSelectedJobId(pendingJob.id);
            // Only clear after successfully selecting
            setPendingSelectJobId(null);
          }
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setIsLoadingJobs(false);
      }
    };
    fetchJobs();
  }, [isAuthenticated, isAuthLoading, pendingSelectJobId]);

  const selectedJob = jobs.find((job) => job.id === selectedJobId) || null;

  const handleJobCreate = useCallback((job: ExamJob) => {
    setJobs((prev) => {
      const newJobs = [job, ...prev];
      // Save to localStorage for anonymous users
      if (!isAuthenticated) {
        saveGuestJobs(newJobs);
      }
      return newJobs;
    });
    setSelectedJobId(job.id);
  }, [isAuthenticated]);

  const handleJobUpdate = useCallback((updatedJob: ExamJob) => {
    setJobs((prev) => {
      const newJobs = prev.map((job) => (job.id === updatedJob.id ? updatedJob : job));
      // Save to localStorage for anonymous users
      if (!isAuthenticated) {
        saveGuestJobs(newJobs);
      }
      return newJobs;
    });
  }, [isAuthenticated]);

  const handleNewExam = useCallback(() => {
    setSelectedJobId(null);
  }, []);

  const handleDeleteJob = useCallback(
    async (id: string) => {
      // Find the job to get its jobId for the API call
      const jobToDelete = jobs.find((job) => job.id === id);
      
      // For authenticated users, delete from backend
      if (isAuthenticated && jobToDelete?.jobId) {
        try {
          await jobsApi.deleteJob(jobToDelete.jobId);
        } catch (error) {
          console.error("Failed to delete job from backend:", error);
          // Continue with local delete even if backend fails
        }
      }
      
      setJobs((prev) => {
        const newJobs = prev.filter((job) => job.id !== id);
        // Save to localStorage for anonymous users
        if (!isAuthenticated) {
          saveGuestJobs(newJobs);
        }
        return newJobs;
      });
      if (selectedJobId === id) {
        setSelectedJobId(null);
      }
    },
    [selectedJobId, isAuthenticated, jobs]
  );

  // Select job by jobId (backend ID, not frontend UUID)
  const handleSelectJobById = useCallback(
    (jobId: string) => {
      const job = jobs.find((j) => j.jobId === jobId);
      if (job) {
        setSelectedJobId(job.id);
      } else {
        // Jobs might not be loaded yet, store for later
        setPendingSelectJobId(jobId);
      }
    },
    [jobs]
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top Navigation Header */}
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      
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
              onSelectJobById={handleSelectJobById}
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
