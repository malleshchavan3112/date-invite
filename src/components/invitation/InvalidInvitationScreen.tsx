'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { FadeIn } from '@/components/ui/PageTransition';
import DecorativeBackground from '@/components/ui/DecorativeBackground';
import DateInviteCard from '@/components/ui/DateInviteCard';

/**
 * P15 — Invalid Invitation Screen
 * Dedicated branded state displayed when:
 * - Slug does not exist
 * - Invitation is inactive
 * - Invitation cannot be resolved
 * 
 * Never exposes whether an invitation existed or any technical database errors.
 */
export default function InvalidInvitationScreen() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div
      className="screen relative overflow-hidden min-h-dvh flex flex-col justify-center items-center px-4 py-8"
      role="region"
      aria-label="Invitation Not Available"
      id="invalid-invitation-screen"
    >
      {/* ── Ambient Decorative Background ── */}
      <DecorativeBackground />

      <div className="w-full max-w-sm sm:max-w-md mx-auto relative z-10">
        <DateInviteCard>
          {/* Friendly Closed-Envelope Illustration with tiny question mark */}
          <div className="relative inline-flex items-center justify-center mb-5">
            <div
              className="w-20 h-20 rounded-full bg-sand-100/80 border border-primary/20 flex items-center justify-center relative shadow-sm"
              aria-hidden="true"
            >
              {!prefersReducedMotion && (
                <motion.div
                  className="absolute inset-0 rounded-full border border-primary/20"
                  animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.1, 0.5] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
              {/* Closed envelope */}
              <motion.div
                animate={
                  prefersReducedMotion
                    ? {}
                    : { rotate: [-3, 3, -3] }
                }
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="text-4xl select-none leading-none"
                role="img"
                aria-label="Unopened envelope"
              >
                ✉️
              </motion.div>

              {/* Tiny question mark badge */}
              <span
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary-subtle text-primary font-bold flex items-center justify-center text-xs shadow-xs border-2 border-white select-none"
                aria-hidden="true"
              >
                ?
              </span>
            </div>
          </div>

          {/* Heading */}
          <FadeIn delay={0.15}>
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="font-serif text-2xl sm:text-3xl text-dark mb-2.5 leading-snug outline-none font-normal"
            >
              Hmm... this invitation seems to have disappeared
            </h1>
          </FadeIn>

          {/* Supporting Copy */}
          <FadeIn delay={0.25}>
            <p className="font-sans text-sm sm:text-base text-muted-foreground mb-7 leading-relaxed max-w-xs mx-auto text-balance">
              It looks like this invitation is no longer active or the link may be incorrect.
            </p>
          </FadeIn>

          {/* Subtle decorative divider */}
          <div className="flex items-center justify-center gap-3 mb-6" aria-hidden="true">
            <div className="h-px flex-1 bg-border/70" />
            <span className="text-muted/40 text-xs">✦</span>
            <div className="h-px flex-1 bg-border/70" />
          </div>

          {/* Call to Action */}
          <FadeIn delay={0.35}>
            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="btn-primary w-full text-center py-3.5 shadow-button hover:shadow-button-hover"
                id="invalid-back-home-btn"
              >
                Back to DateInvite
              </Link>

              <p className="text-[11px] text-muted/60 tracking-wider uppercase font-sans mt-2">
                DateInvite
              </p>
            </div>
          </FadeIn>
        </DateInviteCard>
      </div>
    </div>
  );
}
