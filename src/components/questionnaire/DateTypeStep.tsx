'use client';

import { useState } from 'react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import ChoiceCard from '@/components/ui/ChoiceCard';
import QuestionnaireProgress from './QuestionnaireProgress';
import { FadeIn } from '@/components/ui/PageTransition';
import DecorativeBackground from '@/components/ui/DecorativeBackground';

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

      <div className="w-full max-w-sm sm:max-w-md mx-auto relative z-10">
        <FadeIn delay={0.05}>
          <div className="bg-surface/95 backdrop-blur-md rounded-[2.25rem] p-6 sm:p-9 shadow-card hover:shadow-card-hover border border-border/80 transition-shadow duration-300">
            {/* Header progress & back */}
            <QuestionnaireProgress
              currentStep={2}
              totalSteps={6}
              onBack={onBack}
              isEditingFromReview={isEditingFromReview}
            />

            {/* Question & Supporting Copy */}
            <div className="mb-6 text-left">
              <h1 className="font-serif text-2xl sm:text-3xl text-dark mb-2 leading-snug font-normal text-balance">
                What kind of date sounds good?
              </h1>
              <p className="font-sans text-sm sm:text-base text-muted-foreground leading-relaxed text-balance">
                Pick the one that feels most like you.
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
              className="py-3.5 text-base sm:text-lg"
            >
              {isEditingFromReview ? 'Save & Return to Review' : 'Continue'}
            </PrimaryButton>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
