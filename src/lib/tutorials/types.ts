/**
 * Tutorial System Types for Visual Admin Serbia
 * Feature 39: Interactive Tutorials System
 */

// Learning paths for different user types
export type TutorialPath =
  | 'citizen'
  | 'developer'
  | 'government'
  | 'journalist';

// Path metadata for display
export interface TutorialPathInfo {
  id: TutorialPath;
  name: {
    en: string;
    sr: string;
    srLat: string;
  };
  description: {
    en: string;
    sr: string;
    srLat: string;
  };
  icon: string;
  estimatedTime: number; // in minutes
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
}

// Target element for highlighting
export interface TutorialTarget {
  selector: string; // CSS selector for the element
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  offset?: {
    x?: number;
    y?: number;
  };
}

// Content for a single tutorial step
export interface TutorialStepContent {
  title: {
    en: string;
    sr: string;
    srLat: string;
  };
  description: {
    en: string;
    sr: string;
    srLat: string;
  };
  tips?: {
    en: string[];
    sr: string[];
    srLat: string[];
  };
  // Optional code example to show
  codeExample?: {
    language: string;
    code: string;
  };
  // Optional image/illustration
  image?: {
    src: string;
    alt: {
      en: string;
      sr: string;
      srLat: string;
    };
  };
  // Optional link to documentation
  learnMore?: {
    url: string;
    text: {
      en: string;
      sr: string;
      srLat: string;
    };
  };
}

// Single step in a tutorial
export interface TutorialStep {
  id: string;
  order: number;
  target?: TutorialTarget; // If undefined, shows centered modal
  content: TutorialStepContent;
  // Interaction requirements
  interaction?: {
    type: 'click' | 'input' | 'scroll' | 'hover' | 'none';
    target?: string; // CSS selector
    validate?: (element: Element) => boolean;
  };
  // Delay before showing this step (ms)
  delay?: number;
  // Skip conditions
  skipIf?: {
    condition: string; // JS expression to evaluate
    message?: TutorialStepContent['description'];
  };
}

// Complete tutorial definition
export interface Tutorial {
  id: string;
  path: TutorialPath;
  order: number; // Order within path
  title: {
    en: string;
    sr: string;
    srLat: string;
  };
  description: {
    en: string;
    sr: string;
    srLat: string;
  };
  steps: TutorialStep[];
  // Metadata
  duration: number; // estimated time in minutes
  prerequisites?: string[]; // Tutorial IDs that should be completed first
  badges?: string[]; // Achievement badges earned
  // Trigger options
  triggers?: {
    route?: string | RegExp; // Auto-show on specific routes
    element?: string; // Auto-show when element appears
    firstVisit?: boolean; // Show on first visit to the app
    manual?: boolean; // Only show when explicitly requested
  };
  // State
  isActive?: boolean; // Can be started
  isFeatured?: boolean; // Show in featured tutorials
}

// User's progress on a tutorial
export interface TutorialProgress {
  tutorialId: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'skipped';
  currentStep: number;
  completedSteps: string[];
  startedAt?: Date;
  completedAt?: Date;
  lastAccessedAt?: Date;
  // Feedback
  rating?: 1 | 2 | 3 | 4 | 5;
  feedback?: string;
}

// User's overall tutorial state
export interface UserTutorialState {
  currentPath?: TutorialPath;
  completedTutorials: string[];
  tutorialProgress: Record<string, TutorialProgress>;
  preferences: {
    autoStartTutorials: boolean;
    showHints: boolean;
    skipCompleted: boolean;
    preferredLanguage: 'en' | 'sr' | 'srLat';
  };
  achievements: string[];
  totalMinutesLearned: number;
}

// Tutorial context actions
export interface TutorialContextValue {
  // State
  activeTutorial: Tutorial | null;
  currentStep: number;
  isActive: boolean;
  isLoading: boolean;
  userState: UserTutorialState;

  // Actions
  startTutorial: (tutorialId: string) => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (stepIndex: number) => void;
  skipTutorial: () => void;
  completeTutorial: () => void;
  exitTutorial: () => void;

  // Path management
  setCurrentPath: (path: TutorialPath) => void;
  getTutorialsByPath: (path: TutorialPath) => Tutorial[];
  getAvailableTutorials: () => Tutorial[];

  // Progress
  getTutorialProgress: (tutorialId: string) => TutorialProgress | undefined;
  isTutorialCompleted: (tutorialId: string) => boolean;

  // Preferences
  updatePreferences: (prefs: Partial<UserTutorialState['preferences']>) => void;

  // Feedback
  submitFeedback: (
    tutorialId: string,
    rating: number,
    feedback?: string
  ) => void;
}

// Event types for tutorial analytics
export type TutorialEvent =
  | { type: 'tutorial_started'; tutorialId: string; path: TutorialPath }
  | {
      type: 'step_completed';
      tutorialId: string;
      stepId: string;
      duration: number;
    }
  | { type: 'tutorial_completed'; tutorialId: string; totalDuration: number }
  | { type: 'tutorial_skipped'; tutorialId: string; stepId: string }
  | {
      type: 'tutorial_exited';
      tutorialId: string;
      stepId: string;
      duration: number;
    }
  | { type: 'feedback_submitted'; tutorialId: string; rating: number };

// Tutorial registry structure
export interface TutorialRegistry {
  tutorials: Tutorial[];
  paths: TutorialPathInfo[];
  version: string;
  lastUpdated: Date;
}

// Props for tutorial overlay component
export interface TutorialOverlayProps {
  tutorial: Tutorial;
  currentStep: number;
  onPrevious: () => void;
  onNext: () => void;
  onSkip: () => void;
  onComplete: () => void;
  onExit: () => void;
}

// Props for individual step component
export interface TutorialStepProps {
  step: TutorialStep;
  stepNumber: number;
  totalSteps: number;
  locale: 'en' | 'sr' | 'srLat';
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  isFirst: boolean;
  isLast: boolean;
}

// Highlight element wrapper props
export interface HighlightElementProps {
  target: TutorialTarget;
  isActive: boolean;
  children: React.ReactNode;
}

// Tooltip positioning
export interface TooltipPosition {
  top: number;
  left: number;
  placement: 'top' | 'bottom' | 'left' | 'right' | 'center';
  arrowPosition: {
    top?: number;
    left?: number;
  };
}

// Tutorial badge/achievement
export interface TutorialBadge {
  id: string;
  name: {
    en: string;
    sr: string;
    srLat: string;
  };
  description: {
    en: string;
    sr: string;
    srLat: string;
  };
  icon: string;
  earnedAt?: Date;
}

// Export all types
export const TUTORIAL_STORAGE_KEY = 'visual-admin-tutorials';
export const TUTORIAL_VERSION = '1.0.0';
