/**
 * Tutorial Context and Provider
 * Feature 39: Interactive Tutorials System
 */

'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import {
  Tutorial,
  TutorialContextValue,
  TutorialPath,
  TutorialEvent,
  UserTutorialState,
} from './types';
import { useTutorialStorage } from './useTutorialStorage';

// Tutorial data imports (will be populated)
import { getAllTutorials, getTutorialsByPath } from './tutorial-data';

// Create context with undefined default
const TutorialContext = createContext<TutorialContextValue | undefined>(
  undefined
);

// Analytics tracking (stub - can be connected to analytics service)
function trackTutorialEvent(event: TutorialEvent) {
  console.log('[Tutorial Analytics]', event);
  // In production, send to analytics service
  // analytics.track('tutorial_event', event);
}

interface TutorialProviderProps {
  children: React.ReactNode;
  initialTutorialId?: string;
  autoStartFirstVisit?: boolean;
}

/**
 * Tutorial Provider Component
 * Wraps the application to provide tutorial state and actions
 */
export function TutorialProvider({
  children,
  initialTutorialId,
  autoStartFirstVisit = true,
}: TutorialProviderProps) {
  // Storage hook for persistence
  const storage = useTutorialStorage();

  // Active tutorial state
  const [activeTutorial, setActiveTutorial] = useState<Tutorial | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [tutorialStartTime, setTutorialStartTime] = useState<Date | null>(null);

  // Get all available tutorials
  const allTutorials = useMemo(() => getAllTutorials(), []);

  // Start a tutorial
  const startTutorial = useCallback(
    (tutorialId: string) => {
      const tutorial = allTutorials.find((t) => t.id === tutorialId);
      if (!tutorial) {
        console.warn(`Tutorial not found: ${tutorialId}`);
        return;
      }

      // Check if already completed and skip preference
      if (
        storage.userState.preferences.skipCompleted &&
        storage.isTutorialCompleted(tutorialId)
      ) {
        console.log(`Skipping completed tutorial: ${tutorialId}`);
        return;
      }

      // Start the tutorial
      storage.startTutorial(tutorialId, tutorial.duration);
      setActiveTutorial(tutorial);
      setCurrentStep(storage.getTutorialProgress(tutorialId)?.currentStep ?? 0);
      setIsActive(true);
      setTutorialStartTime(new Date());

      // Track event
      trackTutorialEvent({
        type: 'tutorial_started',
        tutorialId,
        path: tutorial.path,
      });
    },
    [allTutorials, storage]
  );

  // Go to next step
  const nextStep = useCallback(() => {
    if (!activeTutorial) return;

    const nextIndex = currentStep + 1;
    if (nextIndex >= activeTutorial.steps.length) {
      // Tutorial complete
      completeTutorial();
      return;
    }

    const currentStepData = activeTutorial.steps[currentStep];

    // Track step completion
    if (tutorialStartTime) {
      const duration = Date.now() - tutorialStartTime.getTime();
      trackTutorialEvent({
        type: 'step_completed',
        tutorialId: activeTutorial.id,
        stepId: currentStepData.id,
        duration,
      });
    }

    // Update progress
    storage.updateStepProgress(
      activeTutorial.id,
      currentStepData.id,
      nextIndex
    );
    setCurrentStep(nextIndex);
  }, [activeTutorial, currentStep, storage, tutorialStartTime]);

  // Go to previous step
  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  // Go to specific step
  const goToStep = useCallback(
    (stepIndex: number) => {
      if (!activeTutorial) return;
      if (stepIndex >= 0 && stepIndex < activeTutorial.steps.length) {
        setCurrentStep(stepIndex);
      }
    },
    [activeTutorial]
  );

  // Skip tutorial
  const skipTutorial = useCallback(() => {
    if (!activeTutorial) return;

    const currentStepData = activeTutorial.steps[currentStep];

    storage.skipTutorial(activeTutorial.id);

    trackTutorialEvent({
      type: 'tutorial_skipped',
      tutorialId: activeTutorial.id,
      stepId: currentStepData?.id ?? '',
    });

    setIsActive(false);
    setActiveTutorial(null);
    setCurrentStep(0);
  }, [activeTutorial, currentStep, storage]);

  // Complete tutorial
  const completeTutorial = useCallback(() => {
    if (!activeTutorial) return;

    storage.completeTutorial(
      activeTutorial.id,
      activeTutorial.duration,
      activeTutorial.badges
    );

    trackTutorialEvent({
      type: 'tutorial_completed',
      tutorialId: activeTutorial.id,
      totalDuration: tutorialStartTime
        ? Date.now() - tutorialStartTime.getTime()
        : 0,
    });

    setIsActive(false);
    setActiveTutorial(null);
    setCurrentStep(0);
    setTutorialStartTime(null);
  }, [activeTutorial, storage, tutorialStartTime]);

  // Exit tutorial (without marking as skipped or completed)
  const exitTutorial = useCallback(() => {
    if (!activeTutorial) return;

    const currentStepData = activeTutorial.steps[currentStep];

    trackTutorialEvent({
      type: 'tutorial_exited',
      tutorialId: activeTutorial.id,
      stepId: currentStepData?.id ?? '',
      duration: tutorialStartTime
        ? Date.now() - tutorialStartTime.getTime()
        : 0,
    });

    setIsActive(false);
    setActiveTutorial(null);
    setCurrentStep(0);
  }, [activeTutorial, currentStep, tutorialStartTime]);

  // Set current learning path
  const setCurrentPath = useCallback(
    (path: TutorialPath) => {
      storage.setCurrentPath(path);
    },
    [storage]
  );

  // Get tutorials by path
  const getTutorialsByPathCallback = useCallback(
    (path: TutorialPath): Tutorial[] => {
      return getTutorialsByPath(path);
    },
    []
  );

  // Get available tutorials (not completed or in progress)
  const getAvailableTutorials = useCallback((): Tutorial[] => {
    return allTutorials.filter((tutorial) => {
      const progress = storage.getTutorialProgress(tutorial.id);
      return !progress || progress.status !== 'completed';
    });
  }, [allTutorials, storage]);

  // Update preferences
  const updatePreferences = useCallback(
    (prefs: Partial<UserTutorialState['preferences']>) => {
      storage.updatePreferences(prefs);
    },
    [storage]
  );

  // Submit feedback
  const submitFeedback = useCallback(
    (tutorialId: string, rating: number, feedback?: string) => {
      storage.submitFeedback(tutorialId, rating, feedback);

      trackTutorialEvent({
        type: 'feedback_submitted',
        tutorialId,
        rating,
      });
    },
    [storage]
  );

  // Context value
  const value: TutorialContextValue = {
    activeTutorial,
    currentStep,
    isActive,
    isLoading: !storage.isLoaded,
    userState: storage.userState,
    startTutorial,
    nextStep,
    previousStep,
    goToStep,
    skipTutorial,
    completeTutorial,
    exitTutorial,
    setCurrentPath,
    getTutorialsByPath: getTutorialsByPathCallback,
    getAvailableTutorials,
    getTutorialProgress: storage.getTutorialProgress,
    isTutorialCompleted: storage.isTutorialCompleted,
    updatePreferences,
    submitFeedback,
  };

  // Auto-start initial tutorial if specified
  useEffect(() => {
    if (initialTutorialId && storage.isLoaded && !isActive) {
      startTutorial(initialTutorialId);
    }
  }, [initialTutorialId, storage.isLoaded, isActive, startTutorial]);

  // Auto-start first visit tutorial
  useEffect(() => {
    if (!autoStartFirstVisit || !storage.isLoaded || isActive) return;

    // Check if this is the first visit
    const hasAnyProgress =
      Object.keys(storage.userState.tutorialProgress).length > 0;

    if (!hasAnyProgress && storage.userState.preferences.autoStartTutorials) {
      // Find a first-visit tutorial
      const firstVisitTutorial = allTutorials.find(
        (t) => t.triggers?.firstVisit && t.isActive
      );

      if (firstVisitTutorial) {
        // Small delay to let the UI settle
        const timer = setTimeout(() => {
          startTutorial(firstVisitTutorial.id);
        }, 1500);

        return () => clearTimeout(timer);
      }
    }
  }, [
    autoStartFirstVisit,
    storage.isLoaded,
    storage.userState,
    allTutorials,
    isActive,
    startTutorial,
  ]);

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  );
}

/**
 * Hook to access tutorial context
 */
export function useTutorial(): TutorialContextValue {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
}

/**
 * Hook to check if a tutorial is active (for UI overlays)
 */
export function useTutorialActive() {
  const { isActive, activeTutorial, currentStep } = useTutorial();
  return { isActive, activeTutorial, currentStep };
}

/**
 * Hook for getting current step content
 */
export function useCurrentStepContent() {
  const { activeTutorial, currentStep } = useTutorial();

  if (!activeTutorial) return null;

  const step = activeTutorial.steps[currentStep];
  if (!step) return null;

  return {
    step,
    stepNumber: currentStep + 1,
    totalSteps: activeTutorial.steps.length,
    isFirst: currentStep === 0,
    isLast: currentStep === activeTutorial.steps.length - 1,
    tutorialTitle: activeTutorial.title,
  };
}

// Export context for advanced usage
export { TutorialContext };
