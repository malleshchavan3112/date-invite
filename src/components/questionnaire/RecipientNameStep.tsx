'use client';

import { useState } from 'react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import QuestionnaireProgress from './QuestionnaireProgress';
import { FadeIn } from '@/components/ui/PageTransition';
import DecorativeBackground from '@/components/ui/DecorativeBackground';

interface RecipientNameStepProps {
  value: string;
  onContinue: (name: string) => void;
  onBack: () => void;
  isEditingFromReview?: boolean;
}

/**
 * P06 — Recipient Name
 * First questionnaire screen immediately following the YES action.
 */
export default function RecipientNameStep({
  value,
  onContinue,
  onBack,
  isEditingFromReview = false,
}: RecipientNameStepProps) {
  const [name, setName] = useState(value);
  const [error, setError] = useState<string | null>(null);

  const handleValidateAndSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter your name.');
      return;
    }
    if (trimmed.length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }

    setError(null);
    onContinue(trimmed);
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
              currentStep={1}
              totalSteps={6}
              onBack={onBack}
              isEditingFromReview={isEditingFromReview}
            />

            {/* Question & Supporting Copy */}
            <div className="mb-6 text-left">
              <h1 className="font-serif text-2xl sm:text-3xl text-dark mb-2 leading-snug font-normal text-balance">
                First things first… what&apos;s your name?&nbsp;✨
              </h1>
              <p className="font-sans text-sm sm:text-base text-muted-foreground leading-relaxed text-balance">
                So I know who I&apos;m making this little plan for.
              </p>
            </div>

            {/* Name Input Form */}
            <form onSubmit={handleValidateAndSubmit} noValidate className="space-y-6">
              <div>
                <label
                  htmlFor="recipient-name-input"
                  className="block text-xs uppercase tracking-wider text-muted font-sans font-semibold mb-2"
                >
                  Your name
                </label>
                <div className="relative">
                  <input
                    id="recipient-name-input"
                    name="recipientName"
                    type="text"
                    autoComplete="given-name"
                    autoFocus
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (error) setError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleValidateAndSubmit(e);
                      }
                    }}
                    placeholder="Enter your name"
                    aria-invalid={!!error}
                    aria-describedby={error ? 'recipient-name-error' : undefined}
                    className={`w-full px-4 py-3.5 rounded-2xl border text-dark bg-sand-50/70 placeholder:text-muted/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-base min-h-[48px] ${
                      error ? 'border-primary ring-1 ring-primary/30' : 'border-border focus:border-primary'
                    }`}
                  />
                </div>
                {error && (
                  <p
                    id="recipient-name-error"
                    role="alert"
                    className="text-xs text-primary font-medium mt-1.5 flex items-center gap-1"
                  >
                    <span aria-hidden="true">•</span>
                    {error}
                  </p>
                )}
              </div>

              {/* Action */}
              <PrimaryButton
                type="submit"
                fullWidth
                id="recipient-name-continue-btn"
                className="py-3.5 text-base sm:text-lg"
              >
                {isEditingFromReview ? 'Save & Return to Review' : 'Continue'}
              </PrimaryButton>
            </form>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
