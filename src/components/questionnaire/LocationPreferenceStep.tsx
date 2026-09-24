'use client';

import { useState } from 'react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import ChoiceCard from '@/components/ui/ChoiceCard';
import QuestionnaireProgress from './QuestionnaireProgress';
import DecorativeBackground from '@/components/ui/DecorativeBackground';
import DateInviteCard from '@/components/ui/DateInviteCard';

interface LocationPreferenceStepProps {
  value: string;
  onContinue: (location: string) => void;
  onBack: () => void;
  isEditingFromReview?: boolean;
}

const LOCATIONS = [
  { id: 'city_center',   label: 'City Center',    emoji: '🏙️', description: 'Busy streets & energy' },
  { id: 'neighborhood',  label: 'Local Area',     emoji: '🏘️', description: 'Familiar & close by' },
  { id: 'nature',        label: 'Nature',         emoji: '🌲', description: 'Parks, trails & fresh air' },
  { id: 'waterfront',    label: 'Waterfront',     emoji: '🌊', description: 'Lake, river or seaside' },
  { id: 'anywhere',      label: 'Anywhere Works', emoji: '🗺️', description: 'No preference at all' },
] as const;

/**
 * P09 — Location Preference (Phase 8)
 * Picks a general area type — NO exact addresses, home locations, or GPS.
 */
export default function LocationPreferenceStep({
  value,
  onContinue,
  onBack,
  isEditingFromReview = false,
}: LocationPreferenceStepProps) {
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
            currentStep={4}
            totalSteps={9}
            onBack={onBack}
            isEditingFromReview={isEditingFromReview}
          />

          {/* Question & Supporting Copy */}
          <div className="mb-6 text-left">
            <h1 className="font-serif text-2xl sm:text-3xl text-dark mb-2 leading-snug font-normal text-balance">
              What kind of{' '}
              <span className="font-serif italic text-primary">setting sounds good?</span>&nbsp;🗺️
            </h1>
            <p className="font-sans text-sm sm:text-base text-muted-foreground leading-relaxed text-balance">
              Just a general feel — no exact location needed.
            </p>
          </div>

          {/* Choice Cards Grid */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-6"
            role="radiogroup"
            aria-label="Location preference options"
          >
            {LOCATIONS.map((item) => (
              <ChoiceCard
                key={item.id}
                id={`location-${item.id}`}
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
            id="location-continue-btn"
            className="py-3.5 text-base sm:text-lg shadow-button hover:shadow-button-hover"
          >
            {isEditingFromReview ? 'Save & Return to Review' : 'Continue'}
          </PrimaryButton>
        </DateInviteCard>
      </div>
    </div>
  );
}
