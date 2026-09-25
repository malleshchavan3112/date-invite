'use client';

import { useState } from 'react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import ChoiceCard from '@/components/ui/ChoiceCard';
import QuestionnaireProgress from './QuestionnaireProgress';
import DecorativeBackground from '@/components/ui/DecorativeBackground';
import DateInviteCard from '@/components/ui/DateInviteCard';

interface PreferredTimeStepProps {
  value: string;
  onContinue: (time: string) => void;
  onBack: () => void;
  isEditingFromReview?: boolean;
}

const TIMES = [
  { id: 'morning', label: 'Morning', emoji: '☀️', description: 'Breakfast or early stroll' },
  { id: 'afternoon', label: 'Afternoon', emoji: '🌤️', description: 'Golden hour & afternoon breeze' },
  { id: 'evening', label: 'Evening', emoji: '🌆', description: 'Sunset, dinner & drinks' },
  { id: 'night', label: 'Night', emoji: '🌙', description: 'Late night vibes & city lights' },
] as const;

/**
 * P09 — Preferred Time
 * Single-selection choice cards for preferred date time.
 */
export default function PreferredTimeStep({
  value,
  onContinue,
  onBack,
  isEditingFromReview = false,
}: PreferredTimeStepProps) {
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
            currentStep={6}
            totalSteps={9}
            onBack={onBack}
            isEditingFromReview={isEditingFromReview}
          />

          {/* Question & Supporting Copy */}
          <div className="mb-6 text-left">
            <h1 className="font-serif text-2xl sm:text-3xl text-dark mb-2 leading-snug font-normal text-balance">
              Pick a time that{' '}
              <span className="font-serif italic text-primary">won&apos;t require a miracle</span>&nbsp;⏰
            </h1>
            <p className="font-sans text-sm sm:text-base text-muted-foreground leading-relaxed text-balance">
              Or at least one where you&apos;ll actually be awake.
            </p>
          </div>

          {/* Choice Cards Grid */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-6"
            role="radiogroup"
            aria-label="Preferred time options"
          >
            {TIMES.map((item) => (
              <ChoiceCard
                key={item.id}
                id={`preferred-time-${item.id}`}
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
            id="preferred-time-continue-btn"
            className="py-3.5 text-base sm:text-lg shadow-button hover:shadow-button-hover"
          >
            {isEditingFromReview ? 'Save & Return to Review' : 'Continue'}
          </PrimaryButton>
        </DateInviteCard>
      </div>
    </div>
  );
}
