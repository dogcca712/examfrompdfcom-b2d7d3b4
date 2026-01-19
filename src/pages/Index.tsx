import { useState, useCallback } from "react";
import { Sidebar } from "@/components/Sidebar";
import { GeneratePanel } from "@/components/GeneratePanel";
import { ExamJob } from "@/types/exam";

const Index = () => {
  const [jobs, setJobs] = useState<ExamJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

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
