'use client';

import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import type { PublicInvitation, QuestionnaireAnswers } from '@/types';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { FadeIn } from '@/components/ui/PageTransition';

interface SuccessScreenProps {
  invitation: PublicInvitation;
  answers: QuestionnaireAnswers;
  onDone?: () => void;
}

const DATE_TYPE_LABELS: Record<string, string> = {
  coffee: '☕ Coffee',
  dinner: '🍽️ Dinner',
  picnic: '🧺 Picnic',
  movie: '🎬 Movie',
  adventure: '🌆 Adventure',
  surprise: '✨ Surprise',
};

const DAY_LABELS: Record<string, string> = {
  weekday: '🗓️ Weekday',
  friday: '🥂 Friday',
  saturday: '🌅 Saturday',
  sunday: '☕ Sunday',
  any: '💫 Any day',
};

const TIME_LABELS: Record<string, string> = {
  morning: '☀️ Morning',
  afternoon: '🌤️ Afternoon',
  evening: '🌆 Evening',
  night: '🌙 Night',
};

const VIBE_LABELS: Record<string, string> = {
  cozy: '🧸 Cozy',
  romantic: '🌹 Romantic',
  fun: '🎈 Fun',
  fancy: '🍸 Fancy',
  chill: '🌿 Chill',
  spontaneous: '🎲 Spontaneous',
};

/**
 * P14 — Success Screen
 * Final celebratory recipient state.
 * Premium romantic aesthetic with tasteful sparkles, response confirmation, and summary card.
 * Privacy-safe: never reveals creator_email.
 */
export default function SuccessScreen({
  invitation,
  answers,
  onDone,
}: SuccessScreenProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  // Soft sparkle particles positioned tastefully around the card
  const sparkles = [
    { top: '-12px', left: '15%', delay: 0.1, size: 'text-lg' },
    { top: '10px', right: '12%', delay: 0.3, size: 'text-sm' },
    { bottom: '25px', left: '8%', delay: 0.5, size: 'text-base' },
    { bottom: '-10px', right: '18%', delay: 0.2, size: 'text-xl' },
  ];

  return (
    <div
      className="screen"
      role="region"
      aria-label="Invitation Accepted"
      id="success-screen"
    >
      <div className="relative w-full max-w-md mx-auto">
        {/* Floating subtle sparkles in background */}
        {!prefersReducedMotion && (
          <div className="absolute inset-0 pointer-events-none -z-10" aria-hidden="true">
            {sparkles.map((sp, idx) => (
              <motion.span
                key={idx}
                className={`absolute select-none ${sp.size}`}
                style={{ top: sp.top, left: sp.left, right: sp.right, bottom: sp.bottom }}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{
                  opacity: [0.3, 0.9, 0.3],
                  scale: [0.8, 1.2, 0.8],
                  y: [0, -6, 0],
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  delay: sp.delay,
                  ease: 'easeInOut',
                }}
              >
                ✨
              </motion.span>
            ))}
          </div>
        )}

        <div className="content-card text-center bg-surface rounded-3xl p-6 sm:p-8 shadow-card border border-border">
          {/* Celebratory Icon & Badge */}
          <div className="relative flex justify-center mb-6">
            {/* Soft pink glow backdrop */}
            <div
              className="w-20 h-20 rounded-full bg-soft-pink flex items-center justify-center relative shadow-sm"
              aria-hidden="true"
            >
              {!prefersReducedMotion && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary/30"
                  animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
              {/* Checkmark + Opened Envelope Motif */}
              <motion.div
                initial={prefersReducedMotion ? {} : { scale: 0.6, rotate: -10 }}
                animate={prefersReducedMotion ? {} : { scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 14, stiffness: 200 }}
                className="text-4xl select-none leading-none"
                role="img"
                aria-label="Celebration heart"
              >
                🎉
              </motion.div>
            </div>

            {/* Checkmark badge */}
            <div
              className="absolute bottom-0 right-1/2 translate-x-7 translate-y-1 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shadow"
              aria-hidden="true"
            >
              ✓
            </div>
          </div>

          {/* Heading */}
          <FadeIn delay={0.1}>
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="font-serif text-display-md text-dark mb-2 leading-tight outline-none"
            >
              It&apos;s a date!&nbsp;🎉
            </h1>
          </FadeIn>

          {/* Supporting Copy */}
          <FadeIn delay={0.2}>
            <p className="font-sans text-body-lg font-medium text-primary mb-2">
              Your answer has been sent.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="font-sans text-body-sm text-muted mb-6 leading-relaxed max-w-xs mx-auto">
              Your response has been recorded. {invitation.creator_name} will get your response and can take it from here.
            </p>
          </FadeIn>

          {/* Tasteful Summary Badge */}
          <FadeIn delay={0.4}>
            <div className="rounded-2xl bg-sand-50/70 border border-border p-4 mb-6 text-left">
              <span className="block text-xs uppercase tracking-wider font-semibold text-muted/70 mb-2">
                What you shared
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {answers.recipient_name && (
                  <div className="bg-surface/80 rounded-xl p-2.5 border border-border/50">
                    <span className="block text-muted/80 text-[10px] uppercase font-bold">Your Name</span>
                    <span className="font-semibold text-dark truncate block mt-0.5">
                      {answers.recipient_name}
                    </span>
                  </div>
                )}
                {answers.date_type && (
                  <div className="bg-surface/80 rounded-xl p-2.5 border border-border/50">
                    <span className="block text-muted/80 text-[10px] uppercase font-bold">Activity</span>
                    <span className="font-semibold text-dark truncate block mt-0.5">
                      {DATE_TYPE_LABELS[answers.date_type] || answers.date_type}
                    </span>
                  </div>
                )}
                {answers.preferred_day && (
                  <div className="bg-surface/80 rounded-xl p-2.5 border border-border/50">
                    <span className="block text-muted/80 text-[10px] uppercase font-bold">When</span>
                    <span className="font-semibold text-dark truncate block mt-0.5">
                      {DAY_LABELS[answers.preferred_day] || answers.preferred_day}
                    </span>
                  </div>
                )}
                {answers.preferred_time && (
                  <div className="bg-surface/80 rounded-xl p-2.5 border border-border/50">
                    <span className="block text-muted/80 text-[10px] uppercase font-bold">Time</span>
                    <span className="font-semibold text-dark truncate block mt-0.5">
                      {TIME_LABELS[answers.preferred_time] || answers.preferred_time}
                    </span>
                  </div>
                )}
                {answers.date_vibe && (
                  <div className="bg-surface/80 rounded-xl p-2.5 border border-border/50">
                    <span className="block text-muted/80 text-[10px] uppercase font-bold">Vibe</span>
                    <span className="font-semibold text-dark truncate block mt-0.5">
                      {VIBE_LABELS[answers.date_vibe] || answers.date_vibe}
                    </span>
                  </div>
                )}
                {answers.message && (
                  <div className="bg-surface/80 rounded-xl p-2.5 border border-border/50 col-span-2">
                    <span className="block text-muted/80 text-[10px] uppercase font-bold">Note</span>
                    <span className="font-medium text-dark italic truncate block mt-0.5">
                      &ldquo;{answers.message}&rdquo;
                    </span>
                  </div>
                )}
              </div>
            </div>
          </FadeIn>

          {/* Action Button */}
          <FadeIn delay={0.5}>
            <div className="flex flex-col gap-3">
              {onDone ? (
                <PrimaryButton
                  type="button"
                  onClick={onDone}
                  fullWidth
                  id="success-done-btn"
                >
                  Done
                </PrimaryButton>
              ) : (
                <Link
                  href="/"
                  className="btn-primary w-full text-center"
                  id="success-home-link"
                >
                  Done
                </Link>
              )}

              <Link
                href="/"
                className="text-xs font-medium text-muted hover:text-dark transition-colors py-2"
              >
                Want to ask someone out? Create your own DateInvite →
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
