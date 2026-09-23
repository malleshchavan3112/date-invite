'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { FadeIn } from '@/components/ui/PageTransition';

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
      className="screen"
      role="region"
      aria-label="Invitation Not Available"
      id="invalid-invitation-screen"
    >
      <div className="w-full max-w-md mx-auto">
        <FadeIn delay={0.05}>
          <div className="content-card text-center bg-surface rounded-3xl p-6 sm:p-8 shadow-card border border-border">
            {/* Friendly Empty-State Envelope Illustration */}
            <div className="relative flex justify-center mb-6">
              <div
                className="w-20 h-20 rounded-full bg-soft-pink flex items-center justify-center relative shadow-sm"
                aria-hidden="true"
              >
                {!prefersReducedMotion && (
                  <motion.div
                    className="absolute inset-0 rounded-full border border-primary/20"
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
                className="font-serif text-display-md text-dark mb-3 leading-tight outline-none"
              >
                This invitation isn&apos;t available
              </h1>
            </FadeIn>

            {/* Supporting Copy */}
            <FadeIn delay={0.25}>
              <p className="font-sans text-body-md text-muted mb-8 leading-relaxed max-w-xs mx-auto text-balance">
                It looks like this invitation is no longer active or the link may be incorrect.
              </p>
            </FadeIn>

            {/* Subtle decorative divider */}
            <div className="flex items-center justify-center gap-3 mb-6" aria-hidden="true">
              <div className="h-px flex-1 bg-border/60" />
              <span className="text-muted/40 text-xs">✦</span>
              <div className="h-px flex-1 bg-border/60" />
            </div>

            {/* Call to Action */}
            <FadeIn delay={0.35}>
              <div className="flex flex-col gap-3">
                <Link
                  href="/"
                  className="btn-primary w-full text-center"
                  id="invalid-back-home-btn"
                >
                  Back to Home
                </Link>

                <p className="text-xs text-muted/60 tracking-wider uppercase font-sans mt-2">
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
