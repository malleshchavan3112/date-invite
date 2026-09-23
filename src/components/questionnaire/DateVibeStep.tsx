'use client';

import { useState } from 'react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import ChoiceCard from '@/components/ui/ChoiceCard';
import QuestionnaireProgress from './QuestionnaireProgress';
import { FadeIn } from '@/components/ui/PageTransition';

interface DateVibeStepProps {
  value: string;
  onContinue: (vibe: string) => void;
  onBack: () => void;
  isEditingFromReview?: boolean;
}

const VIBES = [
  { id: 'cozy', label: 'Cozy', emoji: '🧸', description: 'Warm, intimate & comfortable' },
  { id: 'romantic', label: 'Romantic', emoji: '🌹', description: 'Candlelight & soft music' },
  { id: 'fun', label: 'Fun', emoji: '🎈', description: 'Laughs, energy & playfulness' },
  { id: 'fancy', label: 'Fancy', emoji: '🍸', description: 'Dressed up & upscale' },
  { id: 'chill', label: 'Chill', emoji: '🌿', description: 'Low-key & zero pressure' },
  { id: 'spontaneous', label: 'Spontaneous', emoji: '🎲', description: 'Go with the flow' },
] as const;

/**
 * P10 — Date Vibe
 * Single-selection choice cards for date aesthetic and atmosphere.
 */
export default function DateVibeStep({
  value,
  onContinue,
  onBack,
  isEditingFromReview = false,
}: DateVibeStepProps) {
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
              currentStep={5}
              totalSteps={6}
              onBack={onBack}
              isEditingFromReview={isEditingFromReview}
            />

            {/* Question & Supporting Copy */}
            <div className="mb-6 text-left">
              <h1 className="font-serif text-display-md text-dark mb-2.5 leading-tight text-balance">
                What&apos;s the vibe?
              </h1>
              <p className="font-sans text-body-md text-muted leading-relaxed text-balance">
                Set the mood for our time together.
              </p>
            </div>

            {/* Choice Cards Grid */}
            <div
              className="grid grid-cols-2 gap-3 mb-6"
              role="radiogroup"
              aria-label="Date vibe options"
            >
              {VIBES.map((item) => (
                <ChoiceCard
                  key={item.id}
                  id={`date-vibe-${item.id}`}
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
              id="date-vibe-continue-btn"
            >
              {isEditingFromReview ? 'Save & Return to Review' : 'Continue'}
            </PrimaryButton>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
