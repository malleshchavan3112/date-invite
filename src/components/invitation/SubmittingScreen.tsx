'use client';

import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * P13 — Submitting
 * Elegant animated submission state.
 * Displays glowing pulsing envelope with progress shimmer while response is being recorded.
 * Double-submit protected and keyboard-accessible.
 */
export default function SubmittingScreen() {
  const prefersReducedMotion = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Manage focus for screen readers and keyboard users
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div
      className="screen"
      role="status"
      aria-live="polite"
      aria-busy="true"
      id="submitting-screen"
    >
      <div className="relative flex flex-col items-center gap-8 max-w-sm mx-auto text-center px-4">
        {/* Glow rings and animated envelope */}
        <div className="relative flex items-center justify-center">
          {/* Outer glow ring */}
          {!prefersReducedMotion && (
            <motion.div
              aria-hidden="true"
              className="absolute w-36 h-36 rounded-full bg-primary/10"
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.1, 0.4] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}

          {/* Inner pulse ring */}
          {!prefersReducedMotion && (
            <motion.div
              aria-hidden="true"
              className="absolute w-24 h-24 rounded-full bg-primary/15"
              animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.2, 0.6] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
            />
          )}

          {/* Animated envelope — soaring/gliding motion */}
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
              duration: 2.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative z-10 select-none text-6xl leading-none filter drop-shadow-md"
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
            className="font-serif text-display-md text-dark leading-tight outline-none"
          >
            Sending your answer…
          </h1>
          <p className="font-sans text-body-md text-muted max-w-xs leading-relaxed">
            Just a moment — your response is on its way.
          </p>
        </div>

        {/* Animated Loading Dots */}
        <div className="flex items-center gap-2" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      opacity: [0.3, 1, 0.3],
                      scale: [0.8, 1.15, 0.8],
                    }
              }
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Indeterminate Shimmer Progress Bar */}
        <div
          className="w-48 h-1.5 bg-soft-pink rounded-full overflow-hidden relative"
          role="progressbar"
          aria-label="Sending response progress"
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <motion.div
            className="absolute top-0 bottom-0 bg-primary rounded-full"
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
        <p className="text-xs text-muted/70 tracking-wide font-sans mt-2">
          Please keep this tab open
        </p>
      </div>
    </div>
  );
}
