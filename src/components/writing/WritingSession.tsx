'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { WritingTaskId } from '@/types/writing';
import { WRITING_TASKS } from '@/data/writingTasks';
import { useWritingSession } from '@/hooks/useWritingSession';
import { useTimer } from '@/hooks/useTimer';
import { saveSession } from '@/lib/writingStorage';
import { TaskTabBar } from './TaskTabBar';
import { WritingEditor } from './WritingEditor';
import { WordCounter } from './WordCounter';
import { TaskTimer } from './TaskTimer';
import { TaskInstructions } from './TaskInstructions';
import { CefrInfoPanel } from './CefrInfoPanel';
import { TimeWarningToast } from './TimeWarningToast';
import { SubmitConfirmDialog } from './SubmitConfirmDialog';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';

export function WritingSession() {
  const router = useRouter();
  const {
    session,
    isLoaded,
    isRecovered,
    activeTask,
    updateText,
    switchTask,
    startTimer,
    tickTimer,
    expireTimer,
    getTaskTexts,
    endSession,
    saveNow,
  } = useWritingSession();

  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeWarning, setTimeWarning] = useState<'5min' | '2min' | null>(null);
  const [recoveryToast, setRecoveryToast] = useState(true);

  const activeTaskDef = session
    ? WRITING_TASKS.find((t) => t.id === session.activeTaskId)!
    : null;

  const timerRunning = !!activeTask?.timerStarted && !activeTask?.timeExpired;

  const { remainingMs } = useTimer({
    initialMs: activeTask?.timerRemainingMs ?? 0,
    running: timerRunning,
    onTick: (ms) => {
      if (session) tickTimer(session.activeTaskId, ms);
    },
    onWarning: (type) => setTimeWarning(type),
    onTimeUp: () => {
      if (session) expireTimer(session.activeTaskId);
    },
  });

  const handleFirstKeystroke = useCallback(() => {
    startTimer();
  }, [startTimer]);

  const handleSwitchTask = useCallback(
    (taskId: WritingTaskId) => {
      saveNow();
      switchTask(taskId);
    },
    [saveNow, switchTask]
  );

  const handleSubmit = useCallback(async () => {
    setShowSubmitDialog(false);
    setIsSubmitting(true);
    saveNow();

    const taskTexts = getTaskTexts();

    // Store submission data in localStorage for the results page to pick up
    try {
      localStorage.setItem(
        'tcf-writing-pending-evaluation',
        JSON.stringify({ tasks: taskTexts, sessionId: session?.id })
      );
    } catch {
      // ignore
    }

    // Save session one final time before navigating
    if (session) saveSession(session);

    router.push('/writing/results');
  }, [saveNow, getTaskTexts, session, router]);

  // Loading state
  if (!isLoaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  // No session — redirect
  if (!session || !activeTask || !activeTaskDef) {
    router.push('/writing');
    return null;
  }

  const prompt = activeTaskDef.prompts[activeTask.promptIndex];

  return (
    <div className="space-y-4">
      {/* Task tabs */}
      <TaskTabBar
        activeTaskId={session.activeTaskId}
        tasks={session.tasks}
        onTabChange={handleSwitchTask}
      />

      {/* Timer + word count header */}
      <div className="flex items-center justify-between">
        <TaskTimer
          remainingMs={remainingMs}
          timeExpired={activeTask.timeExpired}
          timerStarted={activeTask.timerStarted}
        />
        <div className="text-right">
          <span className="text-sm font-medium text-gray-500">
            Task {activeTask.taskId} / 3
          </span>
        </div>
      </div>

      {/* Instructions */}
      <TaskInstructions task={activeTaskDef} prompt={prompt} />
      <CefrInfoPanel cefrRange={activeTaskDef.cefrRange} />

      {/* Editor */}
      <WritingEditor
        value={activeTask.text}
        onChange={updateText}
        onFirstKeystroke={handleFirstKeystroke}
        disabled={activeTask.timeExpired}
        placeholder={
          activeTask.timeExpired
            ? 'Time expired — editing disabled'
            : 'Start writing here...'
        }
      />

      {/* Word counter */}
      <WordCounter
        text={activeTask.text}
        minWords={activeTaskDef.minWords}
        maxWords={activeTaskDef.maxWords}
      />

      {/* Submit button */}
      <div className="flex justify-end pt-2">
        <Button
          onClick={() => setShowSubmitDialog(true)}
          disabled={isSubmitting}
          size="lg"
        >
          {isSubmitting ? 'Submitting...' : 'Submit for evaluation'}
        </Button>
      </div>

      {/* Dialogs / Toasts */}
      {showSubmitDialog && (
        <SubmitConfirmDialog
          tasks={session.tasks}
          onConfirm={handleSubmit}
          onCancel={() => setShowSubmitDialog(false)}
        />
      )}

      {timeWarning && (
        <TimeWarningToast
          type={timeWarning}
          onDismiss={() => setTimeWarning(null)}
        />
      )}

      {isRecovered && recoveryToast && (
        <Toast
          message="Session recovered"
          variant="success"
          duration={3000}
          onDismiss={() => setRecoveryToast(false)}
        />
      )}
    </div>
  );
}
