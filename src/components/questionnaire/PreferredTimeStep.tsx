'use client';

import { useState } from 'react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import ChoiceCard from '@/components/ui/ChoiceCard';
import QuestionnaireProgress from './QuestionnaireProgress';
import { FadeIn } from '@/components/ui/PageTransition';

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
    <div className="screen flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-md mx-auto">
        <FadeIn delay={0.05}>
          <div className="content-card bg-surface rounded-3xl p-6 sm:p-8 shadow-card border border-border">
            {/* Header progress & back */}
            <QuestionnaireProgress
              currentStep={4}
              totalSteps={6}
              onBack={onBack}
              isEditingFromReview={isEditingFromReview}
            />

            {/* Question & Supporting Copy */}
            <div className="mb-6 text-left">
              <h1 className="font-serif text-display-md text-dark mb-2.5 leading-tight text-balance">
                What time feels right?
              </h1>
              <p className="font-sans text-body-md text-muted leading-relaxed text-balance">
                Pick the hour that fits your flow.
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
            >
              {isEditingFromReview ? 'Save & Return to Review' : 'Continue'}
            </PrimaryButton>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
