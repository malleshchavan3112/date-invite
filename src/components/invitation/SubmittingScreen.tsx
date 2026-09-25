'use client';

import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import DecorativeBackground from '@/components/ui/DecorativeBackground';

import DateInviteCard from '@/components/ui/DateInviteCard';

/**
 * P13 — Submitting
 * Elegant animated submission state.
 * Displays glowing pulsing envelope with progress shimmer while response is being recorded.
 * Double-submit protected and keyboard-accessible.
 */
export default function SubmittingScreen() {
  const prefersReducedMotion = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div
      className="screen relative overflow-hidden min-h-dvh flex flex-col justify-center items-center px-4 py-8"
      role="status"
      aria-live="polite"
      aria-busy="true"
      id="submitting-screen"
    >
      {/* ── Ambient Decorative Background ── */}
      <DecorativeBackground />

      <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-[736px] mx-auto relative z-10">
        <DateInviteCard glow size="questionnaire">
          <div className="relative flex flex-col items-center gap-6 text-center py-4">
            {/* Glow rings and soaring envelope with particle trail */}
            <div className="relative flex items-center justify-center my-2">
              {/* Outer atmospheric halo */}
              {!prefersReducedMotion && (
                <motion.div
                  aria-hidden="true"
                  className="absolute w-36 h-36 rounded-full bg-gradient-to-tr from-primary/25 via-rose-300/20 to-amber-200/20 blur-xl"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}

              {/* Inner pulse ring */}
              {!prefersReducedMotion && (
                <motion.div
                  aria-hidden="true"
                  className="absolute w-24 h-24 rounded-full bg-primary/20"
                  animate={{ scale: [1, 1.25, 1], opacity: [0.7, 0.2, 0.7] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
                />
              )}

              {/* Rising flying envelope */}
              <motion.div
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        y: [0, -12, 0],
                        rotate: [-2, 3, -2],
                      }
                }
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative z-10 select-none text-6xl sm:text-7xl leading-none drop-shadow-md"
                role="img"
                aria-label="Flying sealed envelope"
              >
                💌
              </motion.div>

              {/* Trailing micro particles under the envelope */}
              {!prefersReducedMotion && (
                <>
                  <motion.span
                    animate={{ y: [0, 16], opacity: [0.8, 0], scale: [1, 0.5] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut', delay: 0.2 }}
                    className="absolute bottom-0 text-xs select-none pointer-events-none"
                    aria-hidden="true"
                  >
                    ✨
                  </motion.span>
                  <motion.span
                    animate={{ y: [0, 22], opacity: [0.8, 0], scale: [1, 0.4] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: 0.6 }}
                    className="absolute bottom-0 -right-2 text-xs select-none pointer-events-none"
                    aria-hidden="true"
                  >
                    💕
                  </motion.span>
                  <motion.span
                    animate={{ y: [0, 20], opacity: [0.7, 0], scale: [1, 0.4] }}
                    transition={{ duration: 1.7, repeat: Infinity, ease: 'easeOut', delay: 0.9 }}
                    className="absolute bottom-0 -left-2 text-xs select-none pointer-events-none"
                    aria-hidden="true"
                  >
                    ✦
                  </motion.span>
                </>
              )}
            </div>

            {/* Heading & Supporting Text */}
            <div className="flex flex-col items-center gap-2">
              <h1
                ref={headingRef}
                tabIndex={-1}
                className="font-serif text-2xl sm:text-3xl text-dark leading-snug outline-none font-normal"
              >
                Sending the important stuff…
              </h1>
              <p className="font-sans text-sm sm:text-base text-muted-foreground max-w-xs leading-relaxed">
                Hold tight — your response is on its way!
              </p>
            </div>

            {/* Indeterminate Shimmer Progress Bar */}
            <div
              className="w-52 h-2 bg-pink-100/70 border border-primary/20 rounded-full overflow-hidden relative shadow-inner"
              role="progressbar"
              aria-label="Sending response progress"
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <motion.div
                className="absolute top-0 bottom-0 bg-gradient-to-r from-primary via-[#FF3B6F] to-[#E93668] rounded-full"
                style={{ width: '45%' }}
                animate={
                  prefersReducedMotion
                    ? { width: '100%' }
                    : {
                        x: ['-100%', '240%'],
                      }
                }
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>

            {/* Reassurance text */}
            <p className="text-xs text-muted/60 tracking-wide font-sans">
              Please keep this tab open
            </p>
          </div>
        </DateInviteCard>
      </div>
    </div>
  );
}
