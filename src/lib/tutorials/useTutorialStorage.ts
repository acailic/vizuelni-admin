/**
 * Tutorial Storage Hook
 * Manages persistence of tutorial progress to localStorage
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  UserTutorialState,
  TutorialProgress,
  TUTORIAL_STORAGE_KEY,
  TUTORIAL_VERSION,
} from './types';

// Default user state
const defaultUserState: UserTutorialState = {
  currentPath: undefined,
  completedTutorials: [],
  tutorialProgress: {},
  preferences: {
    autoStartTutorials: true,
    showHints: true,
    skipCompleted: true,
    preferredLanguage: 'sr', // Default to Serbian Latin
  },
  achievements: [],
  totalMinutesLearned: 0,
};

/**
 * Hook for managing tutorial state persistence
 */
export function useTutorialStorage() {
  const [userState, setUserState] =
    useState<UserTutorialState>(defaultUserState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(TUTORIAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Check version compatibility
        if (parsed.version === TUTORIAL_VERSION) {
          setUserState(parsed.state);
        } else {
          // Migration could be handled here
          console.log('Tutorial storage version mismatch, using defaults');
        }
      }
    } catch (error) {
      console.error('Failed to load tutorial state:', error);
    }
    setIsLoaded(true);
  }, []);

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined' || !isLoaded) return;

    try {
      localStorage.setItem(
        TUTORIAL_STORAGE_KEY,
        JSON.stringify({
          version: TUTORIAL_VERSION,
          state: userState,
          lastUpdated: new Date().toISOString(),
        })
      );
    } catch (error) {
      console.error('Failed to save tutorial state:', error);
    }
  }, [userState, isLoaded]);

  // Start a tutorial
  const startTutorial = useCallback(
    (tutorialId: string, _estimatedMinutes: number) => {
      setUserState((prev) => {
        const existingProgress = prev.tutorialProgress[tutorialId];

        // Don't restart completed tutorials if skipCompleted is enabled
        if (
          prev.preferences.skipCompleted &&
          existingProgress?.status === 'completed'
        ) {
          return prev;
        }

        return {
          ...prev,
          tutorialProgress: {
            ...prev.tutorialProgress,
            [tutorialId]: {
              tutorialId,
              status: 'in-progress',
              currentStep: existingProgress?.currentStep ?? 0,
              completedSteps: existingProgress?.completedSteps ?? [],
              startedAt: existingProgress?.startedAt ?? new Date(),
              lastAccessedAt: new Date(),
            },
          },
        };
      });
    },
    []
  );

  // Update step progress
  const updateStepProgress = useCallback(
    (tutorialId: string, stepId: string, stepIndex: number) => {
      setUserState((prev) => {
        const progress = prev.tutorialProgress[tutorialId];
        if (!progress) return prev;

        const completedSteps = progress.completedSteps.includes(stepId)
          ? progress.completedSteps
          : [...progress.completedSteps, stepId];

        return {
          ...prev,
          tutorialProgress: {
            ...prev.tutorialProgress,
            [tutorialId]: {
              ...progress,
              currentStep: stepIndex,
              completedSteps,
              lastAccessedAt: new Date(),
            },
          },
        };
      });
    },
    []
  );

  // Complete a tutorial
  const completeTutorial = useCallback(
    (tutorialId: string, estimatedMinutes: number, badges?: string[]) => {
      setUserState((prev) => {
        const progress = prev.tutorialProgress[tutorialId];

        return {
          ...prev,
          completedTutorials: prev.completedTutorials.includes(tutorialId)
            ? prev.completedTutorials
            : [...prev.completedTutorials, tutorialId],
          tutorialProgress: {
            ...prev.tutorialProgress,
            [tutorialId]: {
              ...progress,
              tutorialId,
              status: 'completed',
              completedAt: new Date(),
              lastAccessedAt: new Date(),
            },
          },
          achievements: badges
            ? [...new Set([...prev.achievements, ...badges])]
            : prev.achievements,
          totalMinutesLearned: prev.totalMinutesLearned + estimatedMinutes,
        };
      });
    },
    []
  );

  // Skip a tutorial
  const skipTutorial = useCallback((tutorialId: string) => {
    setUserState((prev) => {
      const progress = prev.tutorialProgress[tutorialId];

      return {
        ...prev,
        tutorialProgress: {
          ...prev.tutorialProgress,
          [tutorialId]: {
            ...progress,
            tutorialId,
            status: 'skipped',
            lastAccessedAt: new Date(),
          },
        },
      };
    });
  }, []);

  // Set current learning path
  const setCurrentPath = useCallback(
    (path: UserTutorialState['currentPath']) => {
      setUserState((prev) => ({
        ...prev,
        currentPath: path,
      }));
    },
    []
  );

  // Update preferences
  const updatePreferences = useCallback(
    (prefs: Partial<UserTutorialState['preferences']>) => {
      setUserState((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          ...prefs,
        },
      }));
    },
    []
  );

  // Submit feedback
  const submitFeedback = useCallback(
    (tutorialId: string, rating: number, feedback?: string) => {
      setUserState((prev) => {
        const progress = prev.tutorialProgress[tutorialId];

        return {
          ...prev,
          tutorialProgress: {
            ...prev.tutorialProgress,
            [tutorialId]: {
              ...progress,
              tutorialId,
              rating: rating as 1 | 2 | 3 | 4 | 5,
              feedback,
            },
          },
        };
      });
    },
    []
  );

  // Reset all progress
  const resetProgress = useCallback(() => {
    setUserState(defaultUserState);
  }, []);

  // Get tutorial progress
  const getTutorialProgress = useCallback(
    (tutorialId: string): TutorialProgress | undefined => {
      return userState.tutorialProgress[tutorialId];
    },
    [userState.tutorialProgress]
  );

  // Check if tutorial is completed
  const isTutorialCompleted = useCallback(
    (tutorialId: string): boolean => {
      return userState.completedTutorials.includes(tutorialId);
    },
    [userState.completedTutorials]
  );

  return {
    userState,
    isLoaded,
    startTutorial,
    updateStepProgress,
    completeTutorial,
    skipTutorial,
    setCurrentPath,
    updatePreferences,
    submitFeedback,
    resetProgress,
    getTutorialProgress,
    isTutorialCompleted,
  };
}
