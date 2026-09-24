'use client';

import PrimaryButton from '@/components/ui/PrimaryButton';
import DecorativeBackground from '@/components/ui/DecorativeBackground';
import DateInviteCard from '@/components/ui/DateInviteCard';
import type { QuestionnaireAnswers } from '@/types';

interface ReviewAnswersStepProps {
  answers: QuestionnaireAnswers;
  onEditStep: (stepKey: 'name' | 'date-type' | 'preferred-day' | 'preferred-time' | 'date-vibe' | 'message') => void;
  onBack: () => void;
  onContinue: () => void;
}

const DATE_TYPE_LABELS: Record<string, string> = {
  coffee: 'Coffee',
  dinner: 'Dinner',
  picnic: 'Picnic',
  movie: 'Movie',
  adventure: 'Adventure',
  surprise: 'Surprise',
};

const DAY_LABELS: Record<string, string> = {
  weekday: 'Weekday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
  any: 'Any day',
};

const TIME_LABELS: Record<string, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
  night: 'Night',
};

const VIBE_LABELS: Record<string, string> = {
  cozy: 'Cozy',
  romantic: 'Romantic',
  fun: 'Fun',
  fancy: 'Fancy',
  chill: 'Chill',
  spontaneous: 'Spontaneous',
};

/**
 * P12 — Review Answers
 * Consolidated summary card styled like an elegant date plan dossier.
 */
export default function ReviewAnswersStep({
  answers,
  onEditStep,
  onBack,
  onContinue,
}: ReviewAnswersStepProps) {
  const planItems = [
    {
      key: 'name' as const,
      label: 'WHO',
      icon: '🏷️',
      value: answers.recipient_name || 'Not provided',
      hasValue: !!answers.recipient_name,
    },
    {
      key: 'date-type' as const,
      label: 'DATE',
      icon: '🍽️',
      value: DATE_TYPE_LABELS[answers.date_type] || answers.date_type || 'None selected',
      hasValue: !!answers.date_type,
    },
    {
      key: 'preferred-day' as const,
      label: 'DAY',
      icon: '📅',
      value: DAY_LABELS[answers.preferred_day] || answers.preferred_day || 'None selected',
      hasValue: !!answers.preferred_day,
    },
    {
      key: 'preferred-time' as const,
      label: 'TIME',
      icon: '⏰',
      value: TIME_LABELS[answers.preferred_time] || answers.preferred_time || 'None selected',
      hasValue: !!answers.preferred_time,
    },
    {
      key: 'date-vibe' as const,
      label: 'VIBE',
      icon: '💫',
      value: VIBE_LABELS[answers.date_vibe] || answers.date_vibe || 'None selected',
      hasValue: !!answers.date_vibe,
    },
  ];

  return (
    <div className="screen relative overflow-hidden min-h-dvh flex flex-col justify-center items-center px-4 py-8">
      {/* ── Ambient Decorative Background ── */}
      <DecorativeBackground />

      <div className="w-full max-w-sm sm:max-w-md mx-auto relative z-10">
        <DateInviteCard>
          {/* Header back button */}
          <div className="w-full flex items-center justify-between gap-4 mb-5">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-dark focus-visible:text-dark transition-colors py-2 px-2.5 -ml-2 rounded-full hover:bg-sand-100 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
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

            <span className="text-xs uppercase tracking-wider font-semibold text-primary bg-primary-subtle border border-primary/20 px-3.5 py-1 rounded-full shadow-2xs">
              Final Review
            </span>
          </div>

          {/* Heading */}
          <div className="mb-6 text-left">
            <h1 className="font-serif text-2xl sm:text-3xl text-dark mb-2 leading-snug font-normal text-balance">
              Okay... let&apos;s see{' '}
              <span className="font-serif italic text-primary">what we&apos;ve planned</span>&nbsp;👀
            </h1>
            <p className="font-sans text-sm sm:text-base text-muted-foreground leading-relaxed text-balance">
              Double-check everything before sealing and sending your date plan.
            </p>
          </div>

          {/* Date Plan Cards Grid */}
          <div className="grid grid-cols-2 gap-2.5 mb-3">
            {planItems.map((item) => (
              <div
                key={item.key}
                className="bg-white/80 border border-primary/15 rounded-2xl p-3 shadow-2xs flex flex-col justify-between relative group hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-muted flex items-center gap-1">
                    <span aria-hidden="true">{item.icon}</span>
                    {item.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => onEditStep(item.key)}
                    className="text-[11px] font-semibold text-primary hover:text-primary-hover underline underline-offset-2 p-1 -m-1"
                    aria-label={`Edit ${item.label}`}
                  >
                    Edit
                  </button>
                </div>
                <span
                  className={`text-sm font-semibold truncate ${
                    item.hasValue ? 'text-dark' : 'text-muted italic'
                  }`}
                >
                  {item.value}
                </span>
              </div>
            ))}

            {/* Note card spanning full width if present or editable */}
            <div className="col-span-2 bg-white/80 border border-primary/15 rounded-2xl p-3 shadow-2xs flex flex-col justify-between hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-muted flex items-center gap-1">
                  <span aria-hidden="true">💌</span>
                  MESSAGE
                </span>
                <button
                  type="button"
                  onClick={() => onEditStep('message')}
                  className="text-[11px] font-semibold text-primary hover:text-primary-hover underline underline-offset-2 p-1 -m-1"
                  aria-label="Edit message"
                >
                  Edit
                </button>
              </div>
              <span
                className={`text-sm ${
                  answers.message ? 'text-dark font-medium italic' : 'text-muted/70 italic text-xs'
                }`}
              >
                {answers.message ? `"${answers.message}"` : 'No special note added'}
              </span>
            </div>
          </div>

          {/* Subtle sealed envelope visual indicator */}
          <div className="flex items-center justify-center gap-2 py-2 mb-4 text-xs font-medium text-muted/70">
            <span className="text-base" aria-hidden="true">💌</span>
            <span>Ready to seal and send to your date</span>
          </div>

          {/* Continue Action */}
          <PrimaryButton
            type="button"
            onClick={onContinue}
            fullWidth
            id="review-continue-btn"
            className="py-4 text-base sm:text-lg shadow-button hover:shadow-button-hover"
          >
            Send My Answer — It&apos;s a Date! 💌
          </PrimaryButton>
        </DateInviteCard>
      </div>
    </div>
  );
}
