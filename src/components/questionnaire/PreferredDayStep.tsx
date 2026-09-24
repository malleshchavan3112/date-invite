'use client';

import { useState } from 'react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import ChoiceCard from '@/components/ui/ChoiceCard';
import QuestionnaireProgress from './QuestionnaireProgress';
import { FadeIn } from '@/components/ui/PageTransition';
import DecorativeBackground from '@/components/ui/DecorativeBackground';

interface PreferredDayStepProps {
  value: string;
  onContinue: (day: string) => void;
  onBack: () => void;
  isEditingFromReview?: boolean;
}

const DAYS = [
  { id: 'weekday', label: 'Weekday', emoji: '🗓️', description: 'Monday – Thursday' },
  { id: 'friday', label: 'Friday', emoji: '🥂', description: 'Kick off the weekend' },
  { id: 'saturday', label: 'Saturday', emoji: '🌅', description: 'Classic date night' },
  { id: 'sunday', label: 'Sunday', emoji: '☕', description: 'Relaxed & easygoing' },
  { id: 'any', label: 'Any day', emoji: '💫', description: 'Flexible with anything' },
] as const;

/**
 * P08 — Preferred Day
 * Single-selection choice cards for preferred date day.
 */
export default function PreferredDayStep({
  value,
  onContinue,
  onBack,
  isEditingFromReview = false,
}: PreferredDayStepProps) {
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
              currentStep={3}
              totalSteps={6}
              onBack={onBack}
              isEditingFromReview={isEditingFromReview}
            />

            {/* Question & Supporting Copy */}
            <div className="mb-6 text-left">
              <h1 className="font-serif text-2xl sm:text-3xl text-dark mb-2 leading-snug font-normal text-balance">
                When would you like to go?
              </h1>
              <p className="font-sans text-sm sm:text-base text-muted-foreground leading-relaxed text-balance">
                Pick your favorite day to hang out.
              </p>
            </div>

            {/* Choice Cards List */}
            <div
              className="space-y-2.5 mb-6"
              role="radiogroup"
              aria-label="Preferred day options"
            >
              {DAYS.map((item) => (
                <ChoiceCard
                  key={item.id}
                  id={`preferred-day-${item.id}`}
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
              id="preferred-day-continue-btn"
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
