'use client';

import { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import DecorativeBackground from '@/components/ui/DecorativeBackground';

interface LoadingScreenProps {
  /** Called after the loading animation completes */
  onLoaded: () => void;
}

/**
 * P01 — Invitation Loading
 * Elegant animated loading state that builds anticipation before the landing.
 * Auto-advances after ~1700ms. Respects reduced-motion.
 */
export default function LoadingScreen({ onLoaded }: LoadingScreenProps) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(onLoaded, prefersReducedMotion ? 400 : 1700);
    return () => clearTimeout(timer);
  }, [onLoaded, prefersReducedMotion]);

  return (
    <div className="screen relative overflow-hidden min-h-dvh flex flex-col justify-center items-center px-4 py-8">
      {/* ── Ambient Decorative Background ── */}
      <DecorativeBackground />

      <div className="relative flex flex-col items-center gap-7 text-center z-10 max-w-sm mx-auto">
        <div className="relative flex items-center justify-center">
          {/* Outer slow pulse */}
          {!prefersReducedMotion && (
            <motion.div
              aria-hidden="true"
              className="absolute w-36 h-36 rounded-full bg-primary/10 blur-sm"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.1, 0.5] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}

          {/* Inner pulse */}
          {!prefersReducedMotion && (
            <motion.div
              aria-hidden="true"
              className="absolute w-24 h-24 rounded-full bg-primary/15"
              animate={{ scale: [1, 1.18, 1], opacity: [0.7, 0.2, 0.7] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
            />
          )}

          {/* Envelope emoji — floats and rocks gently */}
          <motion.div
            animate={
              prefersReducedMotion
                ? {}
                : {
                    y: [0, -8, 0],
                    rotate: [-3, 3, -3],
                  }
            }
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative z-10 select-none text-6xl sm:text-7xl leading-none drop-shadow-sm"
            role="img"
            aria-label="Envelope"
          >
            💌
          </motion.div>
        </div>

        {/* Text */}
        <div className="flex flex-col items-center gap-2">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.35 }}
            className="font-sans text-base sm:text-lg font-medium text-dark/90"
          >
            Getting your invitation ready…
          </motion.p>

          <LoadingDots />
        </div>

        {/* Shimmer progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="w-44 h-1.5 bg-primary-subtle border border-primary/15 rounded-full overflow-hidden"
          aria-label="Loading invitation"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-[#FF3B6F] rounded-full origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </div>
  );
}

function LoadingDots() {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) return null;

  return (
    <div className="flex items-center gap-1.5" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-primary"
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
  );
}
