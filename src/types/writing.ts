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

// --- Stored evaluation with original texts ---

export interface StoredEvaluationData {
  result: WritingEvaluationResult;
  originalTexts: { taskId: WritingTaskId; prompt: string; text: string }[];
}

// --- Improve Writing API ---

export interface ImproveWritingRequest {
  taskId: WritingTaskId;
  prompt: string;
  text: string;
  cefrLevel: string;
  grammarNotes: GrammarNote[];
}

export interface ImproveWritingResponse {
  success: true;
  improvedText: string;
}

export interface ImproveWritingError {
  success: false;
  error: string;
}

// --- Writing Improvements (persisted) ---

export interface WritingImprovementRecord {
  sessionId: string;
  taskId: WritingTaskId;
  originalText: string;
  improvedText: string;
  createdAt: string;
}

export interface FetchImprovementsResponse {
  success: true;
  improvements: WritingImprovementRecord[];
}

export interface GenerateImprovementResponse {
  success: true;
  improvement: WritingImprovementRecord;
}

export interface ImprovementErrorResponse {
  success: false;
  error: string;
}
