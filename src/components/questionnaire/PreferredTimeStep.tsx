'use client';

import { useState } from 'react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import ChoiceCard from '@/components/ui/ChoiceCard';
import QuestionnaireProgress from './QuestionnaireProgress';
import { FadeIn } from '@/components/ui/PageTransition';
import DecorativeBackground from '@/components/ui/DecorativeBackground';

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

      <div className="w-full max-w-sm sm:max-w-md mx-auto relative z-10">
        <FadeIn delay={0.05}>
          <div className="bg-surface/95 backdrop-blur-md rounded-[2.25rem] p-6 sm:p-9 shadow-card hover:shadow-card-hover border border-border/80 transition-shadow duration-300">
            {/* Header progress & back */}
            <QuestionnaireProgress
              currentStep={4}
              totalSteps={6}
              onBack={onBack}
              isEditingFromReview={isEditingFromReview}
            />

            {/* Question & Supporting Copy */}
            <div className="mb-6 text-left">
              <h1 className="font-serif text-2xl sm:text-3xl text-dark mb-2 leading-snug font-normal text-balance">
                Pick a time that won&apos;t require a miracle&nbsp;⏰
              </h1>
              <p className="font-sans text-sm sm:text-base text-muted-foreground leading-relaxed text-balance">
                Or at least one where you&apos;ll actually be awake.
              </p>
            </div>

            {/* Choice Cards List */}
            <div
              className="space-y-2.5 mb-6"
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
