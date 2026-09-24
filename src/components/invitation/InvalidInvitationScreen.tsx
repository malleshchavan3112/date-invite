'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { FadeIn } from '@/components/ui/PageTransition';
import DecorativeBackground from '@/components/ui/DecorativeBackground';

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
        <FadeIn delay={0.05}>
          <div className="bg-surface/95 backdrop-blur-md rounded-[2.25rem] p-7 sm:p-9 shadow-card hover:shadow-card-hover border border-border/80 transition-shadow duration-300 text-center">
            {/* Friendly Empty-State Envelope Illustration */}
            <div className="relative inline-flex items-center justify-center mb-5">
              <div
                className="w-20 h-20 rounded-full bg-primary-subtle border border-primary/20 flex items-center justify-center relative shadow-sm"
                aria-hidden="true"
              >
                {!prefersReducedMotion && (
                  <motion.div
                    className="absolute inset-0 rounded-full border border-primary/25"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.1, 0.5] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
                {/* Gentle muted envelope */}
                <motion.div
                  animate={
                    prefersReducedMotion
                      ? {}
                      : { rotate: [-4, 4, -4] }
                  }
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-4xl select-none leading-none"
                  role="img"
                  aria-label="Unopened letter"
                >
                  📭
                </motion.div>
              </div>
            </div>

            {/* Heading */}
            <FadeIn delay={0.15}>
              <h1
                ref={headingRef}
                tabIndex={-1}
                className="font-serif text-2xl sm:text-3xl text-dark mb-2.5 leading-snug outline-none font-normal"
              >
                This invitation isn&apos;t available
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
                  className="btn-primary w-full text-center py-3.5"
                  id="invalid-back-home-btn"
                >
                  Back to Home
                </Link>

                <p className="text-[11px] text-muted/60 tracking-wider uppercase font-sans mt-2">
                  DateInvite
                </p>
              </div>
            </FadeIn>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
