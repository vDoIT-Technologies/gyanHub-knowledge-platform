// ─── API response types ───────────────────────────────────────────────────────

export interface MCQOption {
  id: string;
  text: string;
}

export interface MCQQuestion {
  id: string;
  question: string;
  options: MCQOption[];
  correct_ids: string[];
  explanation: string;
}

// GET /tests?test_id=<id>
export interface MCQTestResponse {
  success: boolean;
  id: string;
  title: string;
  difficulty: string;
  test: MCQQuestion[];  // ← "test" not "data"
}

// GET /tests/all
export interface TestMetadata {
  id: string;
  title: string;
  difficulty: string;
  created_at: string;
}

// ─── Request ──────────────────────────────────────────────────────────────────

export interface MCQGenerateRequest {
  topic: string;
  numberOfQuestions: number;
  difficulty: "Easy" | "Medium" | "Hard";
  teacherId?: string;
}

// Alias so old imports still compile
export type MCQResponse = MCQTestResponse;

// ─── Quiz interaction ─────────────────────────────────────────────────────────

export interface UserAnswer {
  questionId: string;
  selectedOptionId: string;
}

export interface QuizResult {
  questionId: string;
  isCorrect: boolean;
  selectedOptionId: string;
  correctOptionIds: string[];
  explanation: string;
}

// Used only for current-session display in sidebar
export interface QuizHistory {
  id: string;
  topic: string;
  totalQuestions: number;
  score: number;
  percentage: number;
  completedAt: string;
  timeSpent: number;
  questions: MCQQuestion[];
  userAnswers: UserAnswer[];
  results: QuizResult[];
}