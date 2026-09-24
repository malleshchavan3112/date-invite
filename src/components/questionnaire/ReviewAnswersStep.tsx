'use client';

import PrimaryButton from '@/components/ui/PrimaryButton';
import { FadeIn } from '@/components/ui/PageTransition';
import DecorativeBackground from '@/components/ui/DecorativeBackground';
import type { QuestionnaireAnswers } from '@/types';

interface ReviewAnswersStepProps {
  answers: QuestionnaireAnswers;
  onEditStep: (stepKey: 'name' | 'date-type' | 'preferred-day' | 'preferred-time' | 'date-vibe' | 'message') => void;
  onBack: () => void;
  onContinue: () => void;
}

const DATE_TYPE_LABELS: Record<string, string> = {
  coffee: '☕ Coffee',
  dinner: '🍽️ Dinner',
  picnic: '🧺 Picnic',
  movie: '🎬 Movie',
  adventure: '🌆 Adventure',
  surprise: '✨ Surprise',
};

const DAY_LABELS: Record<string, string> = {
  weekday: '🗓️ Weekday',
  friday: '🥂 Friday',
  saturday: '🌅 Saturday',
  sunday: '☕ Sunday',
  any: '💫 Any day',
};

const TIME_LABELS: Record<string, string> = {
  morning: '☀️ Morning',
  afternoon: '🌤️ Afternoon',
  evening: '🌆 Evening',
  night: '🌙 Night',
};

const VIBE_LABELS: Record<string, string> = {
  cozy: '🧸 Cozy',
  romantic: '🌹 Romantic',
  fun: '🎈 Fun',
  fancy: '🍸 Fancy',
  chill: '🌿 Chill',
  spontaneous: '🎲 Spontaneous',
};

/**
 * P12 — Review Answers
 * Consolidated summary card displaying all answers with individual edit actions.
 * Prepares questionnaire state for Phase 4 submission without triggering network requests.
 */
export default function ReviewAnswersStep({
  answers,
  onEditStep,
  onBack,
  onContinue,
}: ReviewAnswersStepProps) {
  const reviewItems = [
    {
      key: 'name' as const,
      label: 'Your Name',
      value: answers.recipient_name || 'Not provided',
      hasValue: !!answers.recipient_name,
    },
    {
      key: 'date-type' as const,
      label: 'Date Type',
      value: DATE_TYPE_LABELS[answers.date_type] || answers.date_type || 'None selected',
      hasValue: !!answers.date_type,
    },
    {
      key: 'preferred-day' as const,
      label: 'Preferred Day',
      value: DAY_LABELS[answers.preferred_day] || answers.preferred_day || 'None selected',
      hasValue: !!answers.preferred_day,
    },
    {
      key: 'preferred-time' as const,
      label: 'Preferred Time',
      value: TIME_LABELS[answers.preferred_time] || answers.preferred_time || 'None selected',
      hasValue: !!answers.preferred_time,
    },
    {
      key: 'date-vibe' as const,
      label: 'Date Vibe',
      value: VIBE_LABELS[answers.date_vibe] || answers.date_vibe || 'None selected',
      hasValue: !!answers.date_vibe,
    },
    {
      key: 'message' as const,
      label: 'Message',
      value: answers.message ? `"${answers.message}"` : 'No message added',
      hasValue: !!answers.message,
      isMessage: true,
    },
  ];

  return (
    <div className="screen relative overflow-hidden min-h-dvh flex flex-col justify-center items-center px-4 py-8">
      {/* ── Ambient Decorative Background ── */}
      <DecorativeBackground />

      <div className="w-full max-w-sm sm:max-w-md mx-auto relative z-10">
        <FadeIn delay={0.05}>
          <div className="bg-surface/95 backdrop-blur-md rounded-[2.25rem] p-6 sm:p-9 shadow-card hover:shadow-card-hover border border-border/80 transition-shadow duration-300">
            {/* Header back button */}
            <div className="w-full flex items-center justify-between gap-4 mb-5">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-dark focus-visible:text-dark transition-colors py-2 px-3 -ml-3 rounded-full hover:bg-sand-100 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                aria-label="Go back to note question"
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
                <span>Back</span>
              </button>

              <span className="text-xs uppercase tracking-wider font-semibold text-primary bg-primary-subtle border border-primary/20 px-3.5 py-1 rounded-full">
                Final Review
              </span>
            </div>

            {/* Heading */}
            <div className="mb-6 text-left">
              <h1 className="font-serif text-2xl sm:text-3xl text-dark mb-2 leading-snug font-normal text-balance">
                Looks good?&nbsp;💌
              </h1>
              <p className="font-sans text-sm sm:text-base text-muted-foreground leading-relaxed text-balance">
                Here&apos;s what you&apos;re sending back.
              </p>
            </div>

            {/* Review Items Card List */}
            <div className="divide-y divide-border/60 rounded-2xl bg-sand-50/70 border border-border/80 px-4 py-1 mb-6">
              {reviewItems.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between py-3.5 gap-3"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <span className="block text-[11px] uppercase tracking-wider font-semibold text-muted mb-0.5">
                      {item.label}
                    </span>
                    <span
                      className={`block text-sm font-medium truncate ${
                        item.hasValue
                          ? 'text-dark font-semibold'
                          : 'text-muted italic'
                      } ${item.isMessage ? 'italic' : ''}`}
                    >
                      {item.value}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onEditStep(item.key)}
                    className="flex-shrink-0 text-xs font-semibold text-primary hover:text-primary-hover underline underline-offset-4 py-1.5 px-2.5 rounded-lg hover:bg-primary-subtle transition-colors min-h-[36px]"
                    aria-label={`Edit ${item.label}`}
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>

            {/* Continue Action */}
            <PrimaryButton
              type="button"
              onClick={onContinue}
              fullWidth
              id="review-continue-btn"
              className="py-4 text-base sm:text-lg"
            >
              Send My Answer — It&apos;s a Date! 💌
            </PrimaryButton>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
