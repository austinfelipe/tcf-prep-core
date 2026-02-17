'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  WritingSessionState,
  WritingTaskId,
  WritingTaskState,
} from '@/types/writing';
import {
  createNewSession,
  saveSession,
  loadSession,
  clearSession,
} from '@/lib/writingStorage';
import { WRITING_TASKS } from '@/data/writingTasks';
import { useAutosave } from './useAutosave';

interface UseWritingSessionReturn {
  session: WritingSessionState | null;
  isLoaded: boolean;
  isRecovered: boolean;
  activeTask: WritingTaskState | null;
  startNewSession: () => void;
  updateText: (text: string) => void;
  switchTask: (taskId: WritingTaskId) => void;
  startTimer: () => void;
  tickTimer: (taskId: WritingTaskId, remainingMs: number) => void;
  expireTimer: (taskId: WritingTaskId) => void;
  getTaskTexts: () => { taskId: WritingTaskId; prompt: string; text: string }[];
  endSession: () => void;
  saveNow: () => void;
}

export function useWritingSession(): UseWritingSessionReturn {
  const [session, setSession] = useState<WritingSessionState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRecovered, setIsRecovered] = useState(false);
  const sessionRef = useRef(session);
  sessionRef.current = session;

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadSession();
    if (saved) {
      // Reconcile timer if it was running when page closed
      const now = Date.now();
      const reconciled = { ...saved, tasks: { ...saved.tasks } };
      for (const taskId of [1, 2, 3] as WritingTaskId[]) {
        const task = reconciled.tasks[taskId];
        if (task.timerStarted && !task.timeExpired && task.timerLastTick) {
          const elapsed = now - task.timerLastTick;
          const remaining = Math.max(0, task.timerRemainingMs - elapsed);
          reconciled.tasks[taskId] = {
            ...task,
            timerRemainingMs: remaining,
            timerLastTick: remaining > 0 ? now : null,
            timeExpired: remaining <= 0,
          };
        }
      }
      setSession(reconciled);
      setIsRecovered(true);
    }
    setIsLoaded(true);
  }, []);

  // Autosave
  const { saveNow } = useAutosave({
    data: session,
    onSave: () => {
      if (sessionRef.current) {
        saveSession(sessionRef.current);
      }
    },
    enabled: !!session,
  });

  const activeTask = session
    ? session.tasks[session.activeTaskId]
    : null;

  const startNewSession = useCallback(() => {
    const newSession = createNewSession();
    setSession(newSession);
    setIsRecovered(false);
    saveSession(newSession);
  }, []);

  const updateText = useCallback((text: string) => {
    setSession((prev) => {
      if (!prev) return prev;
      const taskId = prev.activeTaskId;
      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [taskId]: {
            ...prev.tasks[taskId],
            text,
          },
        },
      };
    });
  }, []);

  const switchTask = useCallback((taskId: WritingTaskId) => {
    setSession((prev) => {
      if (!prev) return prev;
      // Pause current timer
      const currentTask = prev.tasks[prev.activeTaskId];
      const updatedCurrent = {
        ...currentTask,
        timerLastTick: currentTask.timerStarted && !currentTask.timeExpired
          ? null
          : currentTask.timerLastTick,
      };

      return {
        ...prev,
        activeTaskId: taskId,
        tasks: {
          ...prev.tasks,
          [prev.activeTaskId]: updatedCurrent,
        },
      };
    });
    // Immediate save on task switch
    setTimeout(() => {
      if (sessionRef.current) saveSession(sessionRef.current);
    }, 0);
  }, []);

  const startTimer = useCallback(() => {
    setSession((prev) => {
      if (!prev) return prev;
      const taskId = prev.activeTaskId;
      const task = prev.tasks[taskId];
      if (task.timerStarted) return prev;
      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [taskId]: {
            ...task,
            timerStarted: true,
            timerLastTick: Date.now(),
          },
        },
      };
    });
  }, []);

  const tickTimer = useCallback((taskId: WritingTaskId, remainingMs: number) => {
    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [taskId]: {
            ...prev.tasks[taskId],
            timerRemainingMs: remainingMs,
            timerLastTick: Date.now(),
          },
        },
      };
    });
  }, []);

  const expireTimer = useCallback((taskId: WritingTaskId) => {
    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [taskId]: {
            ...prev.tasks[taskId],
            timerRemainingMs: 0,
            timerLastTick: null,
            timeExpired: true,
          },
        },
      };
    });
  }, []);

  const getTaskTexts = useCallback(() => {
    if (!session) return [];
    return ([1, 2, 3] as WritingTaskId[]).map((taskId) => {
      const task = session.tasks[taskId];
      const def = WRITING_TASKS.find((t) => t.id === taskId)!;
      return {
        taskId,
        prompt: def.prompts[task.promptIndex],
        text: task.text,
      };
    });
  }, [session]);

  const endSession = useCallback(() => {
    clearSession();
    setSession(null);
    setIsRecovered(false);
  }, []);

  return {
    session,
    isLoaded,
    isRecovered,
    activeTask,
    startNewSession,
    updateText,
    switchTask,
    startTimer,
    tickTimer,
    expireTimer,
    getTaskTexts,
    endSession,
    saveNow,
  };
}
