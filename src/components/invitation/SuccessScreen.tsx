'use client';

import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import type { PublicInvitation, QuestionnaireAnswers } from '@/types';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { FadeIn } from '@/components/ui/PageTransition';
import DecorativeBackground from '@/components/ui/DecorativeBackground';

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

// Tasteful celebration particles
const CONFETTI_PARTICLES = [
  { emoji: '✨', x: '15%', delay: 0.1, dur: 3.2 },
  { emoji: '💕', x: '82%', delay: 0.3, dur: 3.6 },
  { emoji: '🎉', x: '25%', delay: 0.5, dur: 3.8 },
  { emoji: '🌸', x: '75%', delay: 0.2, dur: 4.1 },
  { emoji: '💫', x: '50%', delay: 0.4, dur: 3.4 },
];

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

  return (
    <div
      className="screen relative overflow-hidden min-h-dvh flex flex-col justify-center items-center px-4 py-8"
      role="region"
      aria-label="Invitation Accepted"
      id="success-screen"
    >
      {/* ── Ambient Decorative Background ── */}
      <DecorativeBackground />

      {/* ── Floating celebratory confetti/sparkles ── */}
      {!prefersReducedMotion && (
        <div className="fixed inset-0 pointer-events-none -z-5 overflow-hidden" aria-hidden="true">
          {CONFETTI_PARTICLES.map((item, idx) => (
            <motion.span
              key={idx}
              className="absolute select-none text-xl sm:text-2xl"
              style={{ left: item.x, top: '-20px' }}
              initial={{ y: -20, opacity: 0, scale: 0.6 }}
              animate={{
                y: ['0vh', '105vh'],
                opacity: [0, 0.9, 0.9, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: item.dur,
                repeat: Infinity,
                delay: item.delay,
                ease: 'linear',
              }}
            >
              {item.emoji}
            </motion.span>
          ))}
        </div>
      )}

      <div className="w-full max-w-sm sm:max-w-md mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 22, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
          className="bg-surface/95 backdrop-blur-md rounded-[2.25rem] p-6 sm:p-9 shadow-card hover:shadow-card-hover border border-border/80 transition-shadow duration-300 text-center"
        >
          {/* Celebratory Icon & Badge */}
          <div className="relative inline-flex items-center justify-center mb-5">
            {/* Soft pink glow backdrop */}
            <div
              className="w-20 h-20 rounded-full bg-primary-subtle border border-primary/25 flex items-center justify-center relative shadow-sm"
              aria-hidden="true"
            >
              {!prefersReducedMotion && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary/30"
                  animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
              {/* Party popper emoji */}
              <motion.div
                initial={prefersReducedMotion ? {} : { scale: 0.7, rotate: -12 }}
                animate={prefersReducedMotion ? {} : { scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 14, stiffness: 220 }}
                className="text-4xl select-none leading-none"
                role="img"
                aria-label="Celebration"
              >
                🎉
              </motion.div>
            </div>

            {/* Checkmark badge */}
            <motion.div
              initial={prefersReducedMotion ? {} : { scale: 0 }}
              animate={prefersReducedMotion ? {} : { scale: 1 }}
              transition={{ delay: 0.25, type: 'spring', stiffness: 450, damping: 18 }}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shadow-button border-2 border-white"
              aria-hidden="true"
            >
              ✓
            </motion.div>
          </div>

          {/* Heading */}
          <FadeIn delay={0.1}>
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="font-serif text-2xl sm:text-3xl text-dark mb-2 leading-snug outline-none font-normal"
            >
              It&apos;s a date!&nbsp;🎉
            </h1>
          </FadeIn>

          {/* Supporting Copy */}
          <FadeIn delay={0.18}>
            <p className="font-sans text-base font-semibold text-primary mb-2">
              Well... that went better than expected.&nbsp;😌
            </p>
          </FadeIn>

          <FadeIn delay={0.26}>
            <p className="font-sans text-sm text-muted-foreground mb-6 leading-relaxed max-w-xs mx-auto text-balance">
              Your response has been sent to {invitation.creator_name}. They&apos;ll take it from here!
            </p>
          </FadeIn>

          {/* Tasteful Summary Badge */}
          <FadeIn delay={0.34}>
            <div className="rounded-2xl bg-sand-50/80 border border-border/70 p-4 mb-6 text-left">
              <span className="block text-[11px] uppercase tracking-wider font-semibold text-muted mb-2.5">
                What you shared
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {answers.recipient_name && (
                  <div className="bg-white rounded-xl p-2.5 border border-border/50 shadow-2xs">
                    <span className="block text-muted/70 text-[10px] uppercase font-bold tracking-wider">Your Name</span>
                    <span className="font-semibold text-dark truncate block mt-0.5">
                      {answers.recipient_name}
                    </span>
                  </div>
                )}
                {answers.date_type && (
                  <div className="bg-white rounded-xl p-2.5 border border-border/50 shadow-2xs">
                    <span className="block text-muted/70 text-[10px] uppercase font-bold tracking-wider">Activity</span>
                    <span className="font-semibold text-dark truncate block mt-0.5">
                      {DATE_TYPE_LABELS[answers.date_type] || answers.date_type}
                    </span>
                  </div>
                )}
                {answers.preferred_day && (
                  <div className="bg-white rounded-xl p-2.5 border border-border/50 shadow-2xs">
                    <span className="block text-muted/70 text-[10px] uppercase font-bold tracking-wider">When</span>
                    <span className="font-semibold text-dark truncate block mt-0.5">
                      {DAY_LABELS[answers.preferred_day] || answers.preferred_day}
                    </span>
                  </div>
                )}
                {answers.preferred_time && (
                  <div className="bg-white rounded-xl p-2.5 border border-border/50 shadow-2xs">
                    <span className="block text-muted/70 text-[10px] uppercase font-bold tracking-wider">Time</span>
                    <span className="font-semibold text-dark truncate block mt-0.5">
                      {TIME_LABELS[answers.preferred_time] || answers.preferred_time}
                    </span>
                  </div>
                )}
                {answers.date_vibe && (
                  <div className="bg-white rounded-xl p-2.5 border border-border/50 shadow-2xs">
                    <span className="block text-muted/70 text-[10px] uppercase font-bold tracking-wider">Vibe</span>
                    <span className="font-semibold text-dark truncate block mt-0.5">
                      {VIBE_LABELS[answers.date_vibe] || answers.date_vibe}
                    </span>
                  </div>
                )}
                {answers.message && (
                  <div className="bg-white rounded-xl p-2.5 border border-border/50 col-span-2 shadow-2xs">
                    <span className="block text-muted/70 text-[10px] uppercase font-bold tracking-wider">Note</span>
                    <span className="font-medium text-dark italic truncate block mt-0.5">
                      &ldquo;{answers.message}&rdquo;
                    </span>
                  </div>
                )}
              </div>
            </div>
          </FadeIn>

          {/* Action Button */}
          <FadeIn delay={0.44}>
            <div className="flex flex-col gap-3">
              {onDone ? (
                <PrimaryButton
                  type="button"
                  onClick={onDone}
                  fullWidth
                  id="success-done-btn"
                  className="py-3.5"
                >
                  Done
                </PrimaryButton>
              ) : (
                <Link
                  href="/"
                  className="btn-primary w-full text-center py-3.5"
                  id="success-home-link"
                >
                  Done
                </Link>
              )}

              <Link
                href="/"
                className="text-xs font-medium text-muted hover:text-dark transition-colors py-1.5"
              >
                Want to ask someone out? Create your own DateInvite →
              </Link>
            </div>
          </FadeIn>
        </motion.div>
      </div>
    </div>
  );
}
