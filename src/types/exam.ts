export type Difficulty = "easy" | "normal" | "hard";

export interface ExamConfig {
  mcqEnabled: boolean;
  mcqCount: number;
  shortAnswerEnabled: boolean;
  shortAnswerCount: number;
  longQuestionEnabled: boolean;
  longQuestionCount: number;
  difficulty: Difficulty;
  specialRequests: string;
}

export type JobStatus = "queued" | "running" | "done" | "failed" | "expired";

export interface ExamJob {
  id: string;
  jobId: string;
  fileName: string;
  status: JobStatus;
  createdAt: Date;
  downloadUrl?: string;
  examTitle?: string;
  courseCode?: string;
  totalPages?: number;
  error?: string;
}

// Check if a job is expired (7 days since creation)
export const isJobExpired = (job: ExamJob): boolean => {
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  return Date.now() - job.createdAt.getTime() > SEVEN_DAYS_MS;
};

export const defaultExamConfig: ExamConfig = {
  mcqEnabled: true,
  mcqCount: 10,
  shortAnswerEnabled: true,
  shortAnswerCount: 3,
  longQuestionEnabled: true,
  longQuestionCount: 1,
  difficulty: "normal",
  specialRequests: "",
};
