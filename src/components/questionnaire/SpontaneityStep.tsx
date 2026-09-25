'use client';

import { useState } from 'react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import ChoiceCard from '@/components/ui/ChoiceCard';
import QuestionnaireProgress from './QuestionnaireProgress';
import DecorativeBackground from '@/components/ui/DecorativeBackground';
import DateInviteCard from '@/components/ui/DateInviteCard';

interface SpontaneityStepProps {
  value: string;
  onContinue: (spontaneity: string) => void;
  onBack: () => void;
  isEditingFromReview?: boolean;
}

const SPONTANEITY_OPTIONS = [
  {
    id: 'full_plan',
    label: 'Fully Planned',
    emoji: '📋',
    description: 'I like knowing every detail',
  },
  {
    id: 'loose_plan',
    label: 'Loose Plan',
    emoji: '🗒️',
    description: 'Rough idea, flexible details',
  },
  {
    id: 'go_with_flow',
    label: 'Go with the Flow',
    emoji: '🌊',
    description: 'Happy to wing it',
  },
  {
    id: 'surprise_me',
    label: 'Surprise Me!',
    emoji: '🎁',
    description: 'Total mystery is exciting',
  },
] as const;

/**
 * P13 — Spontaneity Level (Phase 8)
 * How structured or spontaneous the recipient prefers the date to be.
 */
export default function SpontaneityStep({
  value,
  onContinue,
  onBack,
  isEditingFromReview = false,
}: SpontaneityStepProps) {
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
            currentStep={8}
            totalSteps={9}
            onBack={onBack}
            isEditingFromReview={isEditingFromReview}
          />

          {/* Question & Supporting Copy */}
          <div className="mb-6 text-left">
            <h1 className="font-serif text-2xl sm:text-3xl text-dark mb-2 leading-snug font-normal text-balance">
              How{' '}
              <span className="font-serif italic text-primary">planned</span>{' '}
              do you like it?&nbsp;🎁
            </h1>
            <p className="font-sans text-sm sm:text-base text-muted-foreground leading-relaxed text-balance">
              Some people love a schedule; others love a mystery.
            </p>
          </div>

          {/* Choice Cards Grid */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-6"
            role="radiogroup"
            aria-label="Spontaneity level options"
          >
            {SPONTANEITY_OPTIONS.map((item) => (
              <ChoiceCard
                key={item.id}
                id={`spontaneity-${item.id}`}
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
            id="spontaneity-continue-btn"
            className="py-3.5 text-base sm:text-lg shadow-button hover:shadow-button-hover"
          >
            {isEditingFromReview ? 'Save & Return to Review' : 'Continue'}
          </PrimaryButton>
        </DateInviteCard>
      </div>
    </div>
  );
}
