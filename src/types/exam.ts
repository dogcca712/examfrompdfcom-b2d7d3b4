export type Difficulty = "easy" | "normal" | "hard";

export interface ExamConfig {
  mcqCount: number;
  shortAnswerCount: number;
  longQuestionCount: number;
  difficulty: Difficulty;
}

export type JobStatus = "queued" | "running" | "done" | "failed";

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

export const defaultExamConfig: ExamConfig = {
  mcqCount: 10,
  shortAnswerCount: 3,
  longQuestionCount: 1,
  difficulty: "normal",
};
