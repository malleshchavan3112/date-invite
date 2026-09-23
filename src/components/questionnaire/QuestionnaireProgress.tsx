'use client';

import { motion } from 'framer-motion';

interface QuestionnaireProgressProps {
  currentStep: number; // 1 to 6
  totalSteps?: number; // default 6
  onBack: () => void;
  backLabel?: string;
  isEditingFromReview?: boolean;
}

/**
 * QuestionnaireProgress — subtle, animated progress header for P06–P11.
 * Features a clean back button, step indicator, and progress dots.
 */
export default function QuestionnaireProgress({
  currentStep,
  totalSteps = 6,
  onBack,
  backLabel = 'Back',
  isEditingFromReview = false,
}: QuestionnaireProgressProps) {
  return (
    <div className="w-full flex items-center justify-between gap-4 mb-6">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-dark focus-visible:text-dark transition-colors py-1.5 px-2.5 -ml-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        aria-label={isEditingFromReview ? 'Cancel and return to review' : `Go back to previous question`}
      >
        <svg
          className="w-4 h-4 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.2"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span>{isEditingFromReview ? 'Back to Review' : backLabel}</span>
      </button>

      {/* Progress Dots & Counter */}
      <div
        className="flex items-center gap-2"
        role="region"
        aria-label={`Questionnaire progress: step ${currentStep} of ${totalSteps}`}
      >
        <span className="text-label text-muted/70 text-xs tracking-wider uppercase font-semibold">
          {currentStep} of {totalSteps}
        </span>
        <div className="flex items-center gap-1" aria-hidden="true">
          {Array.from({ length: totalSteps }).map((_, i) => {
            const isCompleted = i < currentStep - 1;
            const isCurrent = i === currentStep - 1;

            return (
              <motion.span
                key={i}
                animate={{
                  width: isCurrent ? 14 : 5,
                  backgroundColor: isCurrent ? '#FF4F7B' : isCompleted ? '#FF7A9B' : '#F0D6DF',
                }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="h-1.5 rounded-full inline-block"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
