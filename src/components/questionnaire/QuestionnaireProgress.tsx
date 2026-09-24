'use client';

import { motion } from 'framer-motion';

interface QuestionnaireProgressProps {
  currentStep: number; // 1 to 6
  totalSteps?: number; // default 6
  onBack: () => void;
  backLabel?: string;
  isEditingFromReview?: boolean;
}

const STEP_CHAPTERS: Record<number, { title: string; subtitle: string; icon: string }> = {
  1: { title: 'THE FUN BEGINS', subtitle: 'Who is this for?', icon: '🏷️' },
  2: { title: 'THE PLAN', subtitle: 'What are we doing?', icon: '🍽️' },
  3: { title: 'THE DAY', subtitle: 'Which day feels right?', icon: '📅' },
  4: { title: 'THE TIME', subtitle: 'What time suits best?', icon: '⏰' },
  5: { title: 'THE VIBE', subtitle: 'What mood are we going for?', icon: '💫' },
  6: { title: 'ALMOST THERE', subtitle: 'A quick little note?', icon: '💌' },
};

/**
 * QuestionnaireProgress — Date Planning Journey system for P06–P11.
 * Features:
 * - Back button with accessible tap target (>= 44px)
 * - Journey chapter title & step number
 * - Thematic micro-illustration badge
 * - Thin progress track with glowing animated pink indicator
 */
export default function QuestionnaireProgress({
  currentStep,
  totalSteps = 6,
  onBack,
  backLabel = 'Back',
  isEditingFromReview = false,
}: QuestionnaireProgressProps) {
  const chapter = STEP_CHAPTERS[currentStep] || {
    title: `STEP 0${currentStep}`,
    subtitle: 'Planning the date',
    icon: '✨',
  };

  const progressPercent = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));

  return (
    <div className="w-full mb-6">
      {/* Top row: Back button & Step badge */}
      <div className="flex items-center justify-between gap-3 mb-3">
        {/* Accessible Back Button */}
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-dark focus-visible:text-dark transition-colors py-2 px-2.5 -ml-2 rounded-full hover:bg-sand-100/80 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          aria-label={isEditingFromReview ? 'Cancel and return to review' : 'Go back to previous question'}
        >
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.4"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>{isEditingFromReview ? 'Back to Review' : backLabel}</span>
        </button>

        {/* Step counter & chapter title pill */}
        <div
          className="flex items-center gap-2 bg-white/80 border border-primary/15 rounded-full py-1 px-3 shadow-2xs"
          role="region"
          aria-label={`Date planning journey: step ${currentStep} of ${totalSteps}`}
        >
          <span className="text-base select-none leading-none" aria-hidden="true">
            {chapter.icon}
          </span>
          <span className="text-[11px] font-sans font-bold tracking-wider text-primary uppercase">
            0{currentStep}
          </span>
          <span className="text-muted/40 text-[10px]" aria-hidden="true">/</span>
          <span className="text-[11px] font-sans font-medium text-muted-foreground tracking-wide">
            {chapter.title}
          </span>
        </div>
      </div>

      {/* Thin glowing animated progress bar */}
      <div
        className="w-full h-1.5 bg-pink-100/70 rounded-full overflow-hidden relative shadow-inner"
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`Questionnaire progress: ${progressPercent}%`}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-primary via-[#FF3B6F] to-[#E93668] rounded-full relative"
          initial={{ width: `${((currentStep - 1) / totalSteps) * 100}%` }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Subtle glowing head on progress bar */}
          <div
            className="absolute right-0 top-0 bottom-0 w-3 bg-white/50 blur-[2px] rounded-full"
            aria-hidden="true"
          />
        </motion.div>
      </div>
    </div>
  );
}
