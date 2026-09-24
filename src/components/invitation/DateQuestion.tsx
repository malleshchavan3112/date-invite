'use client';

import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import PrimaryButton from '@/components/ui/PrimaryButton';
import NoEscapeButton from '@/components/ui/NoEscapeButton';
import DecorativeBackground from '@/components/ui/DecorativeBackground';
import type { Invitation, PublicInvitation } from '@/types';

interface DateQuestionProps {
  invitation?: Invitation | PublicInvitation | null;
  onYes: () => void;
  onNo: () => void;
}

const CELEBRATION_PARTICLES = [
  '❤️', '✨', '💕', '🌹', '💖', '🥰', '💫', '🎉',
];

/**
 * P03 — Main Date Question (Hero Screen)
 *
 * Funny & Playful Polish:
 * - Cheeky eyebrow: "⚠️ IMPORTANT QUESTION"
 * - Playful supporting copy: "No pressure... okay, maybe a tiny bit. 😌"
 * - Avatar surprise reaction whenever the NO button dodges
 * - Bold confident YES CTA: "Obviously YES 😌"
 * - Evasive NO button with progressive cheeky micro-copy
 * - Subtle bottom note: "Choose wisely 👀"
 */
export default function DateQuestion({ invitation, onYes, onNo }: DateQuestionProps) {
  const [celebrating, setCelebrating] = useState(false);
  const [avatarReaction, setAvatarReaction] = useState(0);
  const hasActed = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  const handleYes = useCallback(() => {
    if (hasActed.current) return;
    hasActed.current = true;
    setCelebrating(true);
    // Snappy transition
    setTimeout(onYes, prefersReducedMotion ? 100 : 750);
  }, [onYes, prefersReducedMotion]);

  const handleNo = useCallback(() => {
    if (hasActed.current) return;
    hasActed.current = true;
    onNo();
  }, [onNo]);

  const handleNoDodge = useCallback(() => {
    setAvatarReaction((prev) => prev + 1);
  }, []);

  return (
    <div className="screen relative overflow-hidden min-h-dvh flex flex-col justify-center items-center px-4 py-8">
      {/* ── Ambient Decorative Background ── */}
      <DecorativeBackground />

      {/* ── Celebration Burst Micro-Animation on YES ── */}
      <AnimatePresence>
        {celebrating && (
          <CelebrationBurst key="celebration" prefersReducedMotion={!!prefersReducedMotion} />
        )}
      </AnimatePresence>

      {/* ── Hero Invitation Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 22, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.42, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-sm sm:max-w-md mx-auto bg-surface/95 backdrop-blur-md rounded-[2.25rem] p-6 sm:p-9 shadow-card hover:shadow-card-hover border border-border/80 transition-shadow duration-300 relative z-10 text-center"
      >
        {/* Eyebrow Pill */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.3 }}
          className="mb-4 inline-flex items-center gap-1.5 bg-primary-subtle text-primary border border-primary/20 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" aria-hidden="true" />
          <span>⚠️ Important Question</span>
        </motion.div>

        {/* ── Refined Avatar / Image Presentation ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.14, duration: 0.38, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative mx-auto mb-5 w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center"
        >
          {/* Ambient soft glow ring behind avatar */}
          <div
            className="absolute inset-0 rounded-[1.75rem] bg-gradient-to-tr from-rose-200/50 to-pink-100/40 blur-md -z-10"
            aria-hidden="true"
          />

          {/* Avatar Container with idle breathing + cheeky dodge reaction */}
          <motion.div
            key={avatarReaction}
            animate={
              prefersReducedMotion
                ? {}
                : avatarReaction > 0
                ? {
                    y: [0, -8, 0],
                    rotate: [0, -6, 6, 0],
                    scale: [1, 1.05, 1],
                  }
                : {
                    y: [0, -5, 0],
                    rotate: [0, 1, 0, -1, 0],
                  }
            }
            transition={
              avatarReaction > 0
                ? { duration: 0.45, ease: 'easeOut' }
                : { duration: 5, repeat: Infinity, ease: 'easeInOut' }
            }
            className="w-full h-full relative rounded-[1.75rem] overflow-hidden border-2 border-white shadow-md bg-sand-50"
          >
            <Image
              src="/images/romantic-avatar.jpg"
              alt="Romantic invitation illustration"
              fill
              sizes="(max-width: 640px) 112px, 128px"
              priority
              className="object-cover object-center select-none"
            />
          </motion.div>

          {/* Little heart badge accent */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.35, type: 'spring', stiffness: 450, damping: 18 }}
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs shadow-button border-2 border-white"
            aria-hidden="true"
          >
            ❤️
          </motion.div>
        </motion.div>

        {/* ── Main Question Headline ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.32 }}
        >
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-[2rem] text-dark leading-snug mb-2 text-balance font-normal">
            Will you go on a date with me?
          </h1>
        </motion.div>

        {/* Supporting Line */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.3 }}
        >
          <p className="font-sans text-sm sm:text-base text-muted-foreground mb-7 text-balance max-w-xs mx-auto leading-relaxed">
            No pressure... okay, maybe a tiny bit. 😌
          </p>
        </motion.div>

        {/* ── Interactive Action Arena (YES + Evasive NO) ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34, duration: 0.3 }}
          className="relative flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-1 min-h-[64px]"
        >
          {/* YES Primary CTA with subtle pulse glow */}
          <div className="relative w-full sm:w-auto">
            {!celebrating && !prefersReducedMotion && (
              <motion.div
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-primary/20 pointer-events-none"
                animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}

            <PrimaryButton
              onClick={handleYes}
              disabled={celebrating}
              id="yes-btn"
              aria-label="Obviously yes, I would love to go on a date"
              className="w-full sm:w-auto px-8 py-3.5 text-base sm:text-lg shadow-button hover:shadow-button-hover font-semibold whitespace-nowrap"
            >
              <span>Obviously YES</span>
              <span className="text-sm" aria-hidden="true">😌</span>
            </PrimaryButton>
          </div>

          {/* Evasive NO Button (Desktop proximity dodge + mobile friendly nudge) */}
          <div className="w-full sm:w-auto flex justify-center">
            <NoEscapeButton
              onSelectNo={handleNo}
              onDodge={handleNoDodge}
              id="no-btn"
              disabled={celebrating}
              className="w-full sm:w-auto"
            />
          </div>
        </motion.div>

        {/* Humorous micro-footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="text-xs text-muted/70 tracking-wide font-sans mt-6"
        >
          Choose wisely 👀
        </motion.p>
      </motion.div>
    </div>
  );
}

// ─── Celebration Burst ───────────────────────────────────────────────────────

interface CelebrationBurstProps {
  prefersReducedMotion: boolean;
}

function CelebrationBurst({ prefersReducedMotion }: CelebrationBurstProps) {
  if (prefersReducedMotion) {
    return (
      <motion.div
        aria-hidden="true"
        className="fixed inset-0 bg-primary/10 pointer-events-none z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.8, 0] }}
        transition={{ duration: 0.5 }}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-30 overflow-hidden"
    >
      {Array.from({ length: 18 }).map((_, i) => {
        const emoji = CELEBRATION_PARTICLES[i % CELEBRATION_PARTICLES.length];
        const angle = (i / 18) * 360;
        const dist = 110 + Math.random() * 160;
        const tx = Math.cos((angle * Math.PI) / 180) * dist;
        const ty = Math.sin((angle * Math.PI) / 180) * dist - 80;
        const sz = 18 + Math.random() * 16;
        const delay = Math.random() * 0.1;

        return (
          <motion.span
            key={i}
            className="absolute select-none"
            style={{
              left: '50%',
              top: '50%',
              fontSize: sz,
              marginLeft: -sz / 2,
              marginTop: -sz / 2,
            }}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{
              x: tx,
              y: ty,
              scale: [0, 1.35, 1, 0],
              opacity: [1, 1, 0.8, 0],
            }}
            transition={{
              duration: 0.9,
              delay,
              ease: [0.2, 0, 0.4, 1],
            }}
          >
            {emoji}
          </motion.span>
        );
      })}
    </div>
  );
}
