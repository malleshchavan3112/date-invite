'use client';

import { useState } from 'react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import ChoiceCard from '@/components/ui/ChoiceCard';
import QuestionnaireProgress from './QuestionnaireProgress';
import { FadeIn } from '@/components/ui/PageTransition';

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
    <div className="screen flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-md mx-auto">
        <FadeIn delay={0.05}>
          <div className="content-card bg-surface rounded-3xl p-6 sm:p-8 shadow-card border border-border">
            {/* Header progress & back */}
            <QuestionnaireProgress
              currentStep={2}
              totalSteps={6}
              onBack={onBack}
              isEditingFromReview={isEditingFromReview}
            />

            {/* Question & Supporting Copy */}
            <div className="mb-6 text-left">
              <h1 className="font-serif text-display-md text-dark mb-2.5 leading-tight text-balance">
                What kind of date sounds good?
              </h1>
              <p className="font-sans text-body-md text-muted leading-relaxed text-balance">
                Pick the one that feels most like you.
              </p>
            </div>

            {/* Choice Cards Grid */}
            <div
              className="grid grid-cols-2 gap-3 mb-6"
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
            >
              {isEditingFromReview ? 'Save & Return to Review' : 'Continue'}
            </PrimaryButton>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
