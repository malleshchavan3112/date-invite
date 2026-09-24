'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import DecorativeBackground from '@/components/ui/DecorativeBackground';
import DateInviteCard from '@/components/ui/DateInviteCard';

interface PlayfulNoProps {
  onActuallyYes: () => void;
  onConfirmNo: () => void;
}

// ─── Content per attempt ────────────────────────────────────────────────────
const MESSAGES = [
  null,
  {
    heading: 'Okay okay... 😭',
    body: "I respect the decision... but let's make sure that's actually what you mean.",
    emoji: '🙈',
  },
  {
    heading: 'Still dodging? 👀',
    body: "We're not crying, you are... okay maybe a tiny bit.",
    emoji: '🥺',
  },
  {
    heading: 'Alright, one last check 💔',
    body: 'Fair enough. Is this genuinely your final answer?',
    emoji: '🫣',
  },
] as const;

// Where the NO button drifts safely within card bounds
const DODGE_POSITIONS: Array<{ x: number; y: number }> = [
  { x: 0, y: 0 },
  { x: 70, y: -24 },
  { x: -75, y: 32 },
  { x: 80, y: 22 },
];

/**
 * P04 — Playful NO State
 * - Maximum 3 attempts total (D006)
 * - NO button playfully evades (reduced-motion: stays put)
 * - After 3 attempts: confirmation modal
 * - Never silently converts NO to YES (D006)
 */
export default function PlayfulNo({ onActuallyYes, onConfirmNo }: PlayfulNoProps) {
  const [attempts, setAttempts] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const yesActed = useRef(false);
  const noActed = useRef(false);

  const currentMsg = MESSAGES[Math.min(attempts, MESSAGES.length - 1)];
  const dodgePos = prefersReducedMotion
    ? { x: 0, y: 0 }
    : DODGE_POSITIONS[Math.min(attempts, DODGE_POSITIONS.length - 1)];

  const handleNoDodge = useCallback(() => {
    if (noActed.current) return;
    noActed.current = true;
    setTimeout(() => {
      noActed.current = false;
    }, 500);

    const next = attempts + 1;
    if (next >= 3) {
      setAttempts(next);
      setTimeout(() => setShowModal(true), prefersReducedMotion ? 0 : 450);
    } else {
      setAttempts(next);
    }
  }, [attempts, prefersReducedMotion]);

  const handleActuallyYes = useCallback(() => {
    if (yesActed.current) return;
    yesActed.current = true;
    setShowModal(false);
    onActuallyYes();
  }, [onActuallyYes]);

  const handleConfirmNo = useCallback(() => {
    setShowModal(false);
    onConfirmNo();
  }, [onConfirmNo]);

  return (
    <div className="screen relative overflow-hidden min-h-dvh flex flex-col justify-center items-center px-4 py-8">
      {/* ── Ambient Decorative Background ── */}
      <DecorativeBackground />

      <div className="w-full max-w-sm sm:max-w-md mx-auto relative z-10">
        <DateInviteCard>
          {/* Animated expressive character visual */}
          <div className="relative inline-flex items-center justify-center mb-4">
            <div
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-pink-100/60 border border-primary/20 flex items-center justify-center shadow-inner relative"
              aria-hidden="true"
            >
              <motion.div
                key={attempts}
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        rotate: [-6, 6, -6],
                        y: [0, -3, 0],
                      }
                }
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                className="text-4xl select-none leading-none"
                role="img"
                aria-label="Playful sad character"
              >
                {currentMsg?.emoji || '😭'}
              </motion.div>
            </div>
          </div>

          {/* Animated heading — swaps per attempt */}
          <AnimatePresence mode="wait">
            <motion.div
              key={attempts}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="font-serif text-2xl sm:text-3xl text-dark mb-2 text-balance leading-snug font-normal">
                {currentMsg?.heading}
              </h1>
              <p className="font-sans text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
                {currentMsg?.body}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Question reminder */}
          <p className="font-sans text-xs text-muted/70 italic mb-6">
            &ldquo;Will you go on a date with me?&rdquo;
          </p>

          {/* YES — always prominent, always accessible */}
          <PrimaryButton
            onClick={handleActuallyYes}
            fullWidth
            className="mb-5 text-base sm:text-lg shadow-button hover:shadow-button-hover"
            id="actually-yes-btn"
            aria-label="Change my mind — actually yes"
          >
            Actually YES ❤️
          </PrimaryButton>

          {/* NO — dodges playfully within bounded arena */}
          <div
            className="relative h-16 flex items-center justify-center overflow-visible"
            aria-label="No button area"
          >
            <motion.div
              animate={dodgePos}
              transition={
                prefersReducedMotion
                  ? { duration: 0.01 }
                  : {
                      type: 'spring',
                      stiffness: 300,
                      damping: 20,
                      mass: 0.7,
                    }
              }
            >
              <motion.div
                initial={prefersReducedMotion ? {} : { rotate: -6 }}
                animate={prefersReducedMotion ? {} : { rotate: [0, -5, 5, -3, 3, 0] }}
                transition={{ delay: 0.2, duration: 0.5, ease: 'easeInOut' }}
              >
                <SecondaryButton
                  onClick={handleNoDodge}
                  id="no-dodge-btn"
                  aria-label={`No — attempt ${attempts} of 3`}
                  className="whitespace-nowrap text-sm px-6 py-2.5"
                >
                  <span>NO</span>
                  <span className="text-xs" aria-hidden="true">😏</span>
                </SecondaryButton>
              </motion.div>
            </motion.div>
          </div>

          {/* Attempt counter — subtle accessibility aid */}
          <p
            className="font-sans text-xs text-muted/60 mt-3"
            aria-live="polite"
            aria-atomic="true"
          >
            {attempts < 3
              ? `${3 - attempts} more ${3 - attempts === 1 ? 'chance' : 'chances'} to change your mind`
              : ''}
          </p>
        </DateInviteCard>
      </div>

      {/* ── Confirmation Modal ── */}
      <AnimatePresence>
        {showModal && (
          <ConfirmNoModal
            onYes={handleActuallyYes}
            onNo={handleConfirmNo}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Confirmation Modal ──────────────────────────────────────────────────────

interface ConfirmNoModalProps {
  onYes: () => void;
  onNo: () => void;
}

function ConfirmNoModal({ onYes, onNo }: ConfirmNoModalProps) {
  const firstBtnRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    firstBtnRef.current?.focus();
  }, []);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-40"
      />

      {/* Modal — bottom sheet on mobile, centered on sm+ */}
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-heading"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        className="fixed inset-x-0 bottom-0 z-50 flex justify-center sm:inset-0 sm:items-center sm:p-6"
      >
        <div className="w-full max-w-sm bg-surface rounded-t-[2.25rem] sm:rounded-[2.25rem] px-7 pt-7 pb-9 sm:pb-8 shadow-2xl border border-border/80">
          {/* Handle (mobile) */}
          <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5 sm:hidden" aria-hidden="true" />

          <div className="text-center">
            <span className="text-4xl mb-3 block select-none" aria-hidden="true">
              😏
            </span>

            <h2
              id="modal-heading"
              className="font-serif text-2xl text-dark mb-2 font-normal"
            >
              Nice try 👀
            </h2>

            <p className="font-sans text-sm text-muted-foreground mb-6 leading-relaxed">
              Is this really your <em>final</em> answer? No hard feelings, promise!
            </p>

            <div className="flex flex-col gap-3">
              <PrimaryButton
                ref={firstBtnRef}
                onClick={onYes}
                fullWidth
                id="modal-yes-btn"
              >
                Actually YES ❤️
              </PrimaryButton>

              <SecondaryButton
                onClick={onNo}
                fullWidth
                id="modal-confirm-no-btn"
                aria-label="Confirm no — this is my final answer"
              >
                No, I really mean it.
              </SecondaryButton>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
