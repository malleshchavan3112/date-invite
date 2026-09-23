'use client';

import { useState } from 'react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import QuestionnaireProgress from './QuestionnaireProgress';
import { FadeIn } from '@/components/ui/PageTransition';

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
    <div className="screen flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-md mx-auto">
        <FadeIn delay={0.05}>
          <div className="content-card bg-surface rounded-3xl p-6 sm:p-8 shadow-card border border-border">
            {/* Header progress & back */}
            <QuestionnaireProgress
              currentStep={1}
              totalSteps={6}
              onBack={onBack}
              isEditingFromReview={isEditingFromReview}
            />

            {/* Question & Supporting Copy */}
            <div className="mb-6 text-left">
              <h1 className="font-serif text-display-md text-dark mb-2.5 leading-tight text-balance">
                First things first… what&apos;s your name?&nbsp;✨
              </h1>
              <p className="font-sans text-body-md text-muted leading-relaxed text-balance">
                So I know who I&apos;m making this little plan for.
              </p>
            </div>

            {/* Name Input Form */}
            <form onSubmit={handleValidateAndSubmit} noValidate className="space-y-6">
              <div>
                <label
                  htmlFor="recipient-name-input"
                  className="block text-label uppercase tracking-wider text-muted font-sans font-semibold mb-2"
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
                    className={`w-full px-4 py-3.5 rounded-2xl border text-dark bg-sand-50/60 placeholder:text-muted/50 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-base min-h-[48px] ${
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
