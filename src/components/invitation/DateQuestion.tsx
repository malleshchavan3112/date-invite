'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { FadeIn } from '@/components/ui/PageTransition';

interface DateQuestionProps {
  onYes: () => void;
  onNo: () => void;
}

const CELEBRATION_PARTICLES = [
  '❤️', '💕', '💗', '💖', '✨', '🌹', '💝', '🎉', '💫', '🥰',
];

/**
 * P03 — Main Date Question
 * "Would you go on a date with me?"
 * YES: celebration burst → onYes()
 * NO: → onNo() (P04 PlayfulNo)
 */
export default function DateQuestion({ onYes, onNo }: DateQuestionProps) {
  const [celebrating, setCelebrating] = useState(false);
  const hasActed = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  const handleYes = useCallback(() => {
    if (hasActed.current) return; // prevent double-click
    hasActed.current = true;
    setCelebrating(true);
    // After celebration, advance
    setTimeout(onYes, prefersReducedMotion ? 100 : 1100);
  }, [onYes, prefersReducedMotion]);

  const handleNo = useCallback(() => {
    if (hasActed.current) return;
    hasActed.current = true;
    onNo();
  }, [onNo]);

  return (
    <div className="screen relative overflow-hidden">
      {/* Celebration burst — rendered over full screen */}
      <AnimatePresence>
        {celebrating && (
          <CelebrationBurst key="celebration" prefersReducedMotion={!!prefersReducedMotion} />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        className="content-card text-center max-w-sm mx-auto relative z-10"
      >
        {/* Eyebrow */}
        <FadeIn delay={0.05}>
          <p className="text-label uppercase tracking-widest text-muted mb-5">
            Here&apos;s the question…
          </p>
        </FadeIn>

        {/* Main question */}
        <FadeIn delay={0.15}>
          <h1 className="font-serif text-display-md text-dark mb-10 text-balance leading-tight">
            Would you go on a date with me?
          </h1>
        </FadeIn>

        {/* YES button with ambient pulse ring */}
        <FadeIn delay={0.3}>
          <div className="relative flex justify-center mb-5">
            {/* Ambient glow — hidden when celebrating */}
            {!celebrating && (
              <motion.div
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-primary/15"
                animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
            <PrimaryButton
              onClick={handleYes}
              disabled={celebrating}
              id="yes-btn"
              aria-label="Yes, I would go on a date"
              className="relative z-10 text-xl px-12 py-5 !text-xl"
            >
              YES ❤️
            </PrimaryButton>
          </div>
        </FadeIn>

        {/* NO — clearly secondary, smaller, below YES */}
        <FadeIn delay={0.5}>
          <SecondaryButton
            onClick={handleNo}
            disabled={celebrating}
            id="no-btn"
            aria-label="No, I would not go on a date"
            className="text-sm opacity-70 hover:opacity-100"
          >
            NO 😏
          </SecondaryButton>
        </FadeIn>
      </motion.div>
    </div>
  );
}

// ─── Celebration Burst ────────────────────────────────────────────────────

interface CelebrationBurstProps {
  prefersReducedMotion: boolean;
}

function CelebrationBurst({ prefersReducedMotion }: CelebrationBurstProps) {
  if (prefersReducedMotion) {
    // Reduced motion: just a simple flash overlay
    return (
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-primary/10 pointer-events-none z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.6, times: [0, 0.3, 1] }}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none z-20 overflow-hidden"
    >
      {Array.from({ length: 14 }).map((_, i) => {
        const emoji = CELEBRATION_PARTICLES[i % CELEBRATION_PARTICLES.length];
        const angle = (i / 14) * 360;
        const dist = 90 + Math.random() * 140;
        const tx = Math.cos((angle * Math.PI) / 180) * dist;
        // bias upward: subtract extra y so hearts fly up
        const ty = Math.sin((angle * Math.PI) / 180) * dist - 80;
        const sz = 18 + Math.random() * 18;
        const delay = Math.random() * 0.15;

        return (
          <motion.span
            key={i}
            className="absolute select-none"
            style={{
              left: '50%',
              top: '50%',
              fontSize: sz,
              // start centered
              marginLeft: -sz / 2,
              marginTop: -sz / 2,
            }}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{
              x: tx,
              y: ty,
              scale: [0, 1.3, 1, 0],
              opacity: [1, 1, 0.7, 0],
            }}
            transition={{
              duration: 1.0,
              delay,
              ease: [0.2, 0, 0.6, 1],
            }}
          >
            {emoji}
          </motion.span>
        );
      })}
    </div>
  );
}
