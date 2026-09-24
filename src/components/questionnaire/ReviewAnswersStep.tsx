'use client';

import PrimaryButton from '@/components/ui/PrimaryButton';
import DecorativeBackground from '@/components/ui/DecorativeBackground';
import DateInviteCard from '@/components/ui/DateInviteCard';
import type { QuestionnaireAnswers } from '@/types';

interface ReviewAnswersStepProps {
  answers: QuestionnaireAnswers;
  onEditStep: (
    stepKey:
      | 'name'
      | 'date-type'
      | 'activity'
      | 'location'
      | 'preferred-day'
      | 'preferred-time'
      | 'food'
      | 'spontaneity'
      | 'message'
  ) => void;
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

const ACTIVITY_LABELS: Record<string, string> = {
  outdoor:     'Outdoors',
  indoor:      'Indoors',
  active:      'Active',
  relaxed:     'Relaxed',
  cultural:    'Cultural',
  surprise_me: 'Surprise Me',
};

const LOCATION_LABELS: Record<string, string> = {
  city_center:  'City Center',
  neighborhood: 'Local Area',
  nature:       'Nature',
  waterfront:   'Waterfront',
  anywhere:     'Anywhere',
};

const DAY_LABELS: Record<string, string> = {
  weekday:  'Weekday',
  friday:   'Friday',
  saturday: 'Saturday',
  sunday:   'Sunday',
  any:      'Any day',
};

const TIME_LABELS: Record<string, string> = {
  morning:   'Morning',
  afternoon: 'Afternoon',
  evening:   'Evening',
  night:     'Night',
};

const FOOD_LABELS: Record<string, string> = {
  no_preference: 'No Preference',
  vegetarian:    'Vegetarian',
  vegan:         'Vegan',
  seafood:       'Seafood',
  street_food:   'Street Food',
  fine_dining:   'Fine Dining',
  no_food:       'No Food',
};

const SPONTANEITY_LABELS: Record<string, string> = {
  full_plan:     'Fully Planned',
  loose_plan:    'Loose Plan',
  go_with_flow:  'Go with the Flow',
  surprise_me:   'Surprise Me!',
};

/**
 * P15 — Review Answers (Phase 8)
 * Consolidated summary card styled like an elegant date plan dossier.
 * Now shows all 9 preference dimensions.
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
      label: 'DATE TYPE',
      icon: '🍽️',
      value: DATE_TYPE_LABELS[answers.date_type] || answers.date_type || 'None selected',
      hasValue: !!answers.date_type,
    },
    {
      key: 'activity' as const,
      label: 'ACTIVITY',
      icon: '🌿',
      value: ACTIVITY_LABELS[answers.activity_preference] || answers.activity_preference || 'None selected',
      hasValue: !!answers.activity_preference,
    },
    {
      key: 'location' as const,
      label: 'SETTING',
      icon: '🗺️',
      value: LOCATION_LABELS[answers.location_preference] || answers.location_preference || 'None selected',
      hasValue: !!answers.location_preference,
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
      key: 'food' as const,
      label: 'FOOD',
      icon: '🍽️',
      value: FOOD_LABELS[answers.food_preference] || answers.food_preference || 'None selected',
      hasValue: !!answers.food_preference,
    },
    {
      key: 'spontaneity' as const,
      label: 'PLAN STYLE',
      icon: '🎁',
      value: SPONTANEITY_LABELS[answers.spontaneity] || answers.spontaneity || 'None selected',
      hasValue: !!answers.spontaneity,
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
          <div className="mb-5 text-left">
            <h1 className="font-serif text-2xl sm:text-3xl text-dark mb-2 leading-snug font-normal text-balance">
              Okay... let&apos;s see{' '}
              <span className="font-serif italic text-primary">what we&apos;ve planned</span>&nbsp;👀
            </h1>
            <p className="font-sans text-sm sm:text-base text-muted-foreground leading-relaxed text-balance">
              Double-check everything before sealing and sending your date plan.
            </p>
          </div>

          {/* Date Plan Cards Grid */}
          <div className="grid grid-cols-2 gap-2 mb-3">
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

            {/* Note card spanning full width */}
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
