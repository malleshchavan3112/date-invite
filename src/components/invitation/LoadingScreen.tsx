'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  /** Called after the loading animation completes */
  onLoaded: () => void;
}

/**
 * P01 — Invitation Loading
 * Elegant animated loading state that builds anticipation before the landing.
 * Auto-advances after ~1800ms. Respects reduced-motion.
 */
export default function LoadingScreen({ onLoaded }: LoadingScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onLoaded, 1800);
    return () => clearTimeout(timer);
  }, [onLoaded]);

  return (
    <div className="screen">
      {/* Glow ring behind the envelope */}
      <div className="relative flex flex-col items-center gap-8">
        <div className="relative flex items-center justify-center">
          {/* Outer slow pulse */}
          <motion.div
            aria-hidden="true"
            className="absolute w-32 h-32 rounded-full bg-primary/8"
            animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Inner pulse */}
          <motion.div
            aria-hidden="true"
            className="absolute w-20 h-20 rounded-full bg-primary/12"
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          />

          {/* Envelope emoji — floats and rocks */}
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [-3, 3, -3] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative z-10 select-none text-6xl leading-none"
            role="img"
            aria-label="Envelope"
          >
            💌
          </motion.div>
        </div>

        {/* Text */}
        <div className="flex flex-col items-center gap-3">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="font-sans text-body-md text-muted"
          >
            Getting your invitation ready
          </motion.p>

          {/* Animated dots */}
          <LoadingDots />
        </div>

        {/* Shimmer progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="w-40 h-1 bg-soft-pink rounded-full overflow-hidden"
          aria-label="Loading"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <motion.div
            className="h-full bg-primary rounded-full origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.6, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </div>
  );
}

function LoadingDots() {
  return (
    <div className="flex items-center gap-1.5" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-primary"
          animate={{
            opacity: [0.25, 1, 0.25],
            scale: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.22,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
