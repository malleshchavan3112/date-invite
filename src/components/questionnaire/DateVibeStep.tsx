'use client';

import { useState } from 'react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import ChoiceCard from '@/components/ui/ChoiceCard';
import QuestionnaireProgress from './QuestionnaireProgress';
import DecorativeBackground from '@/components/ui/DecorativeBackground';
import DateInviteCard from '@/components/ui/DateInviteCard';

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
    <div className="screen relative overflow-hidden min-h-dvh flex flex-col justify-center items-center px-4 py-8">
      {/* ── Ambient Decorative Background ── */}
      <DecorativeBackground />

      <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-[736px] mx-auto relative z-10">
        <DateInviteCard size="questionnaire">
          {/* Header progress & back */}
          <QuestionnaireProgress
            currentStep={5}
            totalSteps={6}
            onBack={onBack}
            isEditingFromReview={isEditingFromReview}
          />

          {/* Question & Supporting Copy */}
          <div className="mb-6 text-left">
            <h1 className="font-serif text-2xl sm:text-3xl text-dark mb-2 leading-snug font-normal text-balance">
              Now the important part:{' '}
              <span className="font-serif italic text-primary">what&apos;s the vibe?</span>&nbsp;✨
            </h1>
            <p className="font-sans text-sm sm:text-base text-muted-foreground leading-relaxed text-balance">
              Set the mood for our time together.
            </p>
          </div>

          {/* Choice Cards Grid */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-6"
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
            className="py-3.5 text-base sm:text-lg shadow-button hover:shadow-button-hover"
          >
            {isEditingFromReview ? 'Save & Return to Review' : 'Continue'}
          </PrimaryButton>
        </DateInviteCard>
      </div>
    </div>
  );
}
