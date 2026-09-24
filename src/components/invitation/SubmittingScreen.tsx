'use client';

import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import DecorativeBackground from '@/components/ui/DecorativeBackground';

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

      <div className="relative flex flex-col items-center gap-7 max-w-sm mx-auto text-center px-4 z-10">
        {/* Glow rings and animated envelope */}
        <div className="relative flex items-center justify-center">
          {/* Outer glow ring */}
          {!prefersReducedMotion && (
            <motion.div
              aria-hidden="true"
              className="absolute w-40 h-40 rounded-full bg-primary/10 blur-md"
              animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0.1, 0.4] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}

          {/* Inner pulse ring */}
          {!prefersReducedMotion && (
            <motion.div
              aria-hidden="true"
              className="absolute w-28 h-28 rounded-full bg-primary/15"
              animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.15, 0.6] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
            />
          )}

          {/* Animated envelope — soaring motion */}
          <motion.div
            animate={
              prefersReducedMotion
                ? {}
                : {
                    y: [0, -10, 0],
                    rotate: [-2, 3, -2],
                  }
            }
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative z-10 select-none text-6xl sm:text-7xl leading-none drop-shadow-md"
            role="img"
            aria-label="Flying sealed envelope"
          >
            💌
          </motion.div>
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

        {/* Animated Loading Dots */}
        {!prefersReducedMotion && (
          <div className="flex items-center gap-2" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-primary"
                animate={{
                  opacity: [0.25, 1, 0.25],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 1.1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        )}

        {/* Indeterminate Shimmer Progress Bar */}
        <div
          className="w-48 h-1.5 bg-primary-subtle border border-primary/20 rounded-full overflow-hidden relative"
          role="progressbar"
          aria-label="Sending response progress"
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <motion.div
            className="absolute top-0 bottom-0 bg-gradient-to-r from-primary to-[#FF3B6F] rounded-full"
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
        <p className="text-xs text-muted/60 tracking-wide font-sans mt-1">
          Please keep this tab open
        </p>
      </div>
    </div>
  );
}
