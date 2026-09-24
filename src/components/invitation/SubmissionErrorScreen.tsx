'use client';

import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { SubmissionErrorCode } from '@/types';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { FadeIn } from '@/components/ui/PageTransition';
import DecorativeBackground from '@/components/ui/DecorativeBackground';

interface SubmissionErrorScreenProps {
  errorCode?: SubmissionErrorCode;
  errorMessage?: string;
  onTryAgain: () => void;
  onReviewAnswers: () => void;
}

/**
 * P16 — Submission Error Screen
 * Dedicated reassuring retry state when a network or submission failure occurs.
 * Reassures the user that their questionnaire responses are completely safe in memory.
 */
export default function SubmissionErrorScreen({
  errorCode,
  errorMessage,
  onTryAgain,
  onReviewAnswers,
}: SubmissionErrorScreenProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const isAlreadySubmitted = errorCode === 'ALREADY_SUBMITTED';

  return (
    <div
      className="screen relative overflow-hidden min-h-dvh flex flex-col justify-center items-center px-4 py-8"
      role="alert"
      aria-live="assertive"
      id="submission-error-screen"
    >
      {/* ── Ambient Decorative Background ── */}
      <DecorativeBackground />

      <div className="w-full max-w-sm sm:max-w-md mx-auto relative z-10">
        <FadeIn delay={0.05}>
          <div className="bg-surface/95 backdrop-blur-md rounded-[2.25rem] p-7 sm:p-9 shadow-card hover:shadow-card-hover border border-border/80 transition-shadow duration-300 text-center">
            {/* Soft Warm Error Icon Motif */}
            <div className="relative inline-flex items-center justify-center mb-5">
              <div
                className="w-20 h-20 rounded-full bg-primary-subtle border border-primary/25 flex items-center justify-center relative shadow-sm"
                aria-hidden="true"
              >
                {!prefersReducedMotion && (
                  <motion.div
                    className="absolute inset-0 rounded-full border border-primary/30"
                    animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.1, 0.5] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
                {/* Reassuring icon */}
                <motion.div
                  animate={
                    prefersReducedMotion
                      ? {}
                      : { rotate: [-3, 3, -3] }
                  }
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-4xl select-none leading-none"
                  role="img"
                  aria-label="Status icon"
                >
                  {isAlreadySubmitted ? '💌' : '🩹'}
                </motion.div>
              </div>
            </div>

            {/* Heading */}
            <FadeIn delay={0.15}>
              <h1
                ref={headingRef}
                tabIndex={-1}
                className="font-serif text-2xl sm:text-3xl text-dark mb-2 leading-snug outline-none font-normal"
              >
                {isAlreadySubmitted ? 'Already Submitted' : 'Something went wrong'}
              </h1>
            </FadeIn>

            {/* Supporting Copy */}
            <FadeIn delay={0.25}>
              <p className="font-sans text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed max-w-xs mx-auto text-balance">
                {isAlreadySubmitted
                  ? 'A response has already been submitted for this invitation. Thank you!'
                  : "We couldn't send your response just yet. Your answers are still here."}
              </p>
            </FadeIn>

            {/* Friendly reassurance badge */}
            {!isAlreadySubmitted && (
              <FadeIn delay={0.32}>
                <div className="inline-flex items-center gap-2 bg-primary-subtle border border-primary/20 rounded-full px-4 py-1.5 mb-6 text-xs font-medium text-dark">
                  <span className="text-primary font-bold">✓</span>
                  <span>All your answers are safely saved</span>
                </div>
              </FadeIn>
            )}

            {/* Actions */}
            <FadeIn delay={0.4}>
              <div className="flex flex-col gap-3">
                {!isAlreadySubmitted && (
                  <PrimaryButton
                    type="button"
                    onClick={onTryAgain}
                    fullWidth
                    id="error-try-again-btn"
                    className="py-3.5"
                  >
                    Try Again
                  </PrimaryButton>
                )}

                <SecondaryButton
                  type="button"
                  onClick={onReviewAnswers}
                  fullWidth
                  id="error-review-answers-btn"
                  className="py-3"
                >
                  {isAlreadySubmitted ? 'View Your Answers' : 'Review Answers'}
                </SecondaryButton>
              </div>
            </FadeIn>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
