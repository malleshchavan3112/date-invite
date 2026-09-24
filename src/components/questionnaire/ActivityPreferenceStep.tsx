'use client';

import { useState } from 'react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import ChoiceCard from '@/components/ui/ChoiceCard';
import QuestionnaireProgress from './QuestionnaireProgress';
import DecorativeBackground from '@/components/ui/DecorativeBackground';
import DateInviteCard from '@/components/ui/DateInviteCard';

interface ActivityPreferenceStepProps {
  value: string;
  onContinue: (activity: string) => void;
  onBack: () => void;
  isEditingFromReview?: boolean;
}

const ACTIVITIES = [
  { id: 'outdoor',    label: 'Outdoors',   emoji: '🌿', description: 'Fresh air & open spaces' },
  { id: 'indoor',     label: 'Indoors',    emoji: '🏠', description: 'Cozy & sheltered' },
  { id: 'active',     label: 'Active',     emoji: '🏃', description: 'Moving & energetic' },
  { id: 'relaxed',    label: 'Relaxed',    emoji: '🛋️', description: 'Slow & easy-paced' },
  { id: 'cultural',   label: 'Cultural',   emoji: '🎭', description: 'Art, music, or history' },
  { id: 'surprise_me', label: 'Surprise Me', emoji: '🎲', description: 'You choose, I trust you' },
] as const;

/**
 * P08 — Activity Preference (Phase 8)
 * Single-selection choice cards for preferred activity setting.
 */
export default function ActivityPreferenceStep({
  value,
  onContinue,
  onBack,
  isEditingFromReview = false,
}: ActivityPreferenceStepProps) {
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
        <DateInviteCard>
          {/* Header progress & back */}
          <QuestionnaireProgress
            currentStep={3}
            totalSteps={9}
            onBack={onBack}
            isEditingFromReview={isEditingFromReview}
          />

          {/* Question & Supporting Copy */}
          <div className="mb-6 text-left">
            <h1 className="font-serif text-2xl sm:text-3xl text-dark mb-2 leading-snug font-normal text-balance">
              What kind of{' '}
              <span className="font-serif italic text-primary">vibe are you feeling?</span>&nbsp;🌿
            </h1>
            <p className="font-sans text-sm sm:text-base text-muted-foreground leading-relaxed text-balance">
              Think about how you'd love to spend the time.
            </p>
          </div>

          {/* Choice Cards Grid */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-6"
            role="radiogroup"
            aria-label="Activity preference options"
          >
            {ACTIVITIES.map((item) => (
              <ChoiceCard
                key={item.id}
                id={`activity-${item.id}`}
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
            id="activity-continue-btn"
            className="py-3.5 text-base sm:text-lg shadow-button hover:shadow-button-hover"
          >
            {isEditingFromReview ? 'Save & Return to Review' : 'Continue'}
          </PrimaryButton>
        </DateInviteCard>
      </div>
    </div>
  );
}
