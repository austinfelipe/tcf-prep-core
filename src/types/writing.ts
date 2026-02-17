// --- Task Definitions ---

export type WritingTaskId = 1 | 2 | 3;

export interface WritingTaskDefinition {
  id: WritingTaskId;
  title: string;
  cefrRange: string;
  register: 'informal' | 'semi-formal' | 'formal';
  minWords: number;
  maxWords: number;
  timeLimitSeconds: number;
  criteria: string[];
  prompts: string[];
}

// --- Session State ---

export interface WritingTaskState {
  taskId: WritingTaskId;
  promptIndex: number;
  text: string;
  timerStarted: boolean;
  timerRemainingMs: number;
  timerLastTick: number | null; // Date.now() of last tick for delta tracking
  timeExpired: boolean;
}

export interface WritingSessionState {
  id: string;
  createdAt: number;
  activeTaskId: WritingTaskId;
  tasks: Record<WritingTaskId, WritingTaskState>;
}

// --- Evaluation ---

export interface CriterionResult {
  name: string;
  score: number; // 0-4
  comment: string;
}

export interface GrammarNote {
  excerpt: string;
  issue: string;
  correction: string;
  rule: string;
}

export interface TaskEvaluation {
  taskId: WritingTaskId;
  cefrLevel: string;
  score: number; // 0-20
  criteria: CriterionResult[];
  strengths: string[];
  weaknesses: string[];
  grammarNotes: GrammarNote[];
  coherenceAnalysis: string;
  lexicalAnalysis: string;
}

export interface WritingEvaluationResult {
  sessionId: string;
  evaluatedAt: number;
  overallCefrLevel: string;
  overallScore: number;
  tasks: TaskEvaluation[];
}

// --- API ---

export interface EvaluateWritingRequest {
  tasks: {
    taskId: WritingTaskId;
    prompt: string;
    text: string;
  }[];
}

export interface EvaluateWritingResponse {
  success: true;
  result: WritingEvaluationResult;
}

export interface EvaluateWritingError {
  success: false;
  error: string;
}
