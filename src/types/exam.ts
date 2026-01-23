export type Difficulty = "easy" | "normal" | "hard";

export interface ExamConfig {
  mcqEnabled: boolean;
  mcqCount: number;
  shortAnswerEnabled: boolean;
  shortAnswerCount: number;
  longQuestionEnabled: boolean;
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
  mcqEnabled: true,
  mcqCount: 10,
  shortAnswerEnabled: true,
  shortAnswerCount: 3,
  longQuestionEnabled: true,
  longQuestionCount: 1,
  difficulty: "normal",
};
