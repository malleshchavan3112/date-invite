'use client';

import { useState } from 'react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import QuestionnaireProgress from './QuestionnaireProgress';
import DecorativeBackground from '@/components/ui/DecorativeBackground';
import DateInviteCard from '@/components/ui/DateInviteCard';

interface OptionalMessageStepProps {
  value: string;
  onContinue: (message: string) => void;
  onSkip: () => void;
  onBack: () => void;
  isEditingFromReview?: boolean;
}

const MAX_CHARACTERS = 300;

/**
 * P11 — Optional Message
 * Freeform text area for special requests, dietary restrictions, or sweet notes.
 */
export default function OptionalMessageStep({
  value,
  onContinue,
  onSkip,
  onBack,
  isEditingFromReview = false,
}: OptionalMessageStepProps) {
  const [message, setMessage] = useState<string>(value);

  const charCount = message.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinue(message.trim());
  };

  return (
    <div className="screen relative overflow-hidden min-h-dvh flex flex-col justify-center items-center px-4 py-8">
      {/* ── Ambient Decorative Background ── */}
      <DecorativeBackground />

      <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-[736px] mx-auto relative z-10">
        <DateInviteCard size="questionnaire">
          {/* Header progress & back */}
          <QuestionnaireProgress
            currentStep={9}
            totalSteps={9}
            onBack={onBack}
            isEditingFromReview={isEditingFromReview}
          />

          {/* Question & Supporting Copy */}
          <div className="mb-6 text-left">
            <h1 className="font-serif text-2xl sm:text-3xl text-dark mb-2 leading-snug font-normal text-balance">
              Want to leave a{' '}
              <span className="font-serif italic text-primary">little message?</span>&nbsp;💌
            </h1>
            <p className="font-sans text-sm sm:text-base text-muted-foreground leading-relaxed text-balance">
              Totally optional. Dietary preferences, inside jokes, or secret requests.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="optional-message-textarea"
                className="block text-xs uppercase tracking-wider text-muted font-sans font-semibold mb-2"
              >
                Your note (optional)
              </label>
              <div className="relative">
                <textarea
                  id="optional-message-textarea"
                  rows={4}
                  maxLength={MAX_CHARACTERS}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a little note…"
                  className="w-full px-4 py-3.5 rounded-2xl border border-border text-dark bg-sand-50/80 placeholder:text-muted/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all text-base resize-none shadow-inner"
                />
                {/* Character Counter */}
                <div className="flex justify-end mt-1.5">
                  <span
                    className={`text-xs font-sans tabular-nums ${
                      charCount >= MAX_CHARACTERS ? 'text-primary font-semibold' : 'text-muted/60'
                    }`}
                  >
                    {charCount} / {MAX_CHARACTERS}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-1">
              <PrimaryButton
                type="submit"
                fullWidth
                id="message-continue-btn"
                className="py-3.5 text-base sm:text-lg shadow-button hover:shadow-button-hover"
              >
                {isEditingFromReview ? 'Save & Return to Review' : 'Review Invitation'}
              </PrimaryButton>

              {!isEditingFromReview && (
                <SecondaryButton
                  type="button"
                  onClick={onSkip}
                  fullWidth
                  id="message-skip-btn"
                  className="py-3"
                >
                  Skip
                </SecondaryButton>
              )}
            </div>
          </form>
        </DateInviteCard>
      </div>
    </div>
  );
}
