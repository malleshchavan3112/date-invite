'use client';

import { useState } from 'react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import QuestionnaireProgress from './QuestionnaireProgress';
import { FadeIn } from '@/components/ui/PageTransition';
import DecorativeBackground from '@/components/ui/DecorativeBackground';

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

      <div className="w-full max-w-sm sm:max-w-md mx-auto relative z-10">
        <FadeIn delay={0.05}>
          <div className="bg-surface/95 backdrop-blur-md rounded-[2.25rem] p-6 sm:p-9 shadow-card hover:shadow-card-hover border border-border/80 transition-shadow duration-300">
            {/* Header progress & back */}
            <QuestionnaireProgress
              currentStep={6}
              totalSteps={6}
              onBack={onBack}
              isEditingFromReview={isEditingFromReview}
            />

            {/* Question & Supporting Copy */}
            <div className="mb-6 text-left">
              <h1 className="font-serif text-2xl sm:text-3xl text-dark mb-2 leading-snug font-normal text-balance">
                Want to leave a little message?&nbsp;💌
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
                    className="w-full px-4 py-3.5 rounded-2xl border border-border text-dark bg-sand-50/70 placeholder:text-muted/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base resize-none"
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
                  className="py-3.5 text-base sm:text-lg"
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
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
