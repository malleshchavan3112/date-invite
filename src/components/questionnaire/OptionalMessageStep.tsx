'use client';

import { useState } from 'react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import QuestionnaireProgress from './QuestionnaireProgress';
import { FadeIn } from '@/components/ui/PageTransition';

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
    <div className="screen flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-md mx-auto">
        <FadeIn delay={0.05}>
          <div className="content-card bg-surface rounded-3xl p-6 sm:p-8 shadow-card border border-border">
            {/* Header progress & back */}
            <QuestionnaireProgress
              currentStep={6}
              totalSteps={6}
              onBack={onBack}
              isEditingFromReview={isEditingFromReview}
            />

            {/* Question & Supporting Copy */}
            <div className="mb-6 text-left">
              <h1 className="font-serif text-display-md text-dark mb-2.5 leading-tight text-balance">
                Anything you&apos;d like them to know?
              </h1>
              <p className="font-sans text-body-md text-muted leading-relaxed text-balance">
                Totally optional. Dietary preferences, little ideas, or anything else.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="optional-message-textarea"
                  className="block text-label uppercase tracking-wider text-muted font-sans font-semibold mb-2"
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
                    className="w-full px-4 py-3.5 rounded-2xl border border-border text-dark bg-sand-50/60 placeholder:text-muted/50 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base resize-none"
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
                >
                  {isEditingFromReview ? 'Save & Return to Review' : 'Review Invitation'}
                </PrimaryButton>

                {!isEditingFromReview && (
                  <SecondaryButton
                    type="button"
                    onClick={onSkip}
                    fullWidth
                    id="message-skip-btn"
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
