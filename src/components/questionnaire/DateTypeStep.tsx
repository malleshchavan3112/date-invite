'use client';

import { useState } from 'react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import ChoiceCard from '@/components/ui/ChoiceCard';
import QuestionnaireProgress from './QuestionnaireProgress';
import DecorativeBackground from '@/components/ui/DecorativeBackground';
import DateInviteCard from '@/components/ui/DateInviteCard';

interface DateTypeStepProps {
  value: string;
  onContinue: (dateType: string) => void;
  onBack: () => void;
  isEditingFromReview?: boolean;
}

const DATE_TYPES = [
  { id: 'coffee', label: 'Coffee', emoji: '☕', description: 'Casual & caffeinated' },
  { id: 'dinner', label: 'Dinner', emoji: '🍽️', description: 'Good food & conversation' },
  { id: 'picnic', label: 'Picnic', emoji: '🧺', description: 'Sunshine & good snacks' },
  { id: 'movie', label: 'Movie', emoji: '🎬', description: 'Popcorn & cozy seats' },
  { id: 'adventure', label: 'Adventure', emoji: '🌆', description: 'Something unexpected' },
  { id: 'surprise', label: 'Surprise', emoji: '✨', description: 'You pick, I’m in' },
] as const;

/**
 * P07 — Date Type
 * Single-selection choice cards for date activity.
 */
export default function DateTypeStep({
  value,
  onContinue,
  onBack,
  isEditingFromReview = false,
}: DateTypeStepProps) {
  const [selected, setSelected] = useState<string>(value);

  const handleContinue = () => {
    if (selected) {
      onContinue(selected);
    }
  };

  return (
    <div className="screen relative overflow-hidden min-h-dvh flex flex-col justify-center items-center px-4 py-8">
      {/* ── Ambient Decorative Background ── */}
      <DecorativeBackground />

      <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-[736px] mx-auto relative z-10">
        <DateInviteCard size="questionnaire">
          {/* Header progress & back */}
          <QuestionnaireProgress
            currentStep={2}
            totalSteps={9}
            onBack={onBack}
            isEditingFromReview={isEditingFromReview}
          />

          {/* Question & Supporting Copy */}
          <div className="mb-6 text-left">
            <h1 className="font-serif text-2xl sm:text-3xl text-dark mb-2 leading-snug font-normal text-balance">
              Okay, what kind of{' '}
              <span className="font-serif italic text-primary">date are we talking?</span>&nbsp;🍽️
            </h1>
            <p className="font-sans text-sm sm:text-base text-muted-foreground leading-relaxed text-balance">
              Pick the one that sounds like the most fun.
            </p>
          </div>

          {/* Choice Cards Grid */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-6"
            role="radiogroup"
            aria-label="Date type options"
          >
            {DATE_TYPES.map((item) => (
              <ChoiceCard
                key={item.id}
                id={`date-type-${item.id}`}
                label={item.label}
                emoji={item.emoji}
                description={item.description}
                selected={selected === item.id}
                onSelect={() => setSelected(item.id)}
              />
            ))}
          </div>

          {/* Continue CTA */}
          <PrimaryButton
            type="button"
            onClick={handleContinue}
            disabled={!selected}
            fullWidth
            id="date-type-continue-btn"
            className="py-3.5 text-base sm:text-lg shadow-button hover:shadow-button-hover"
          >
            {isEditingFromReview ? 'Save & Return to Review' : 'Continue'}
          </PrimaryButton>
        </DateInviteCard>
      </div>
    </div>
  );
}
