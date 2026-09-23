'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { FadeIn } from '@/components/ui/PageTransition';

interface PlayfulNoProps {
  onActuallyYes: () => void;
  onConfirmNo: () => void;
}

// ─── Content per attempt ────────────────────────────────────────────────────
// attempts: 1 = just arrived, 2 = first in-screen dodge, 3 = second in-screen dodge → modal
const MESSAGES = [
  null, // index 0 — unused
  { heading: 'Hmm, are you sure? 🤔', body: 'The button seems a little slippery today…' },
  { heading: 'Really though? 😅',      body: 'It\'s really trying to avoid you…' },
  { heading: 'Okay, one last thing.',  body: 'We just need to confirm…' }, // modal opens instead
] as const;

// Where the NO button drifts — bounded within the card (safe for 320px+)
const DODGE_POSITIONS: Array<{ x: number; y: number }> = [
  { x: 0,    y: 0   }, // attempt 0 — initial (unused)
  { x: 78,   y: -42 }, // attempt 1 — entered from P03 (first dodge)
  { x: -82,  y: 52  }, // attempt 2 — first in-P04 click
  { x: 92,   y: 38  }, // attempt 3 — second in-P04 click (then modal)
];

/**
 * P04 — Playful NO State
 * - Maximum 3 attempts total (D006)
 * - NO button dodges on each attempt (reduced-motion: stays put)
 * - After 3 attempts: confirmation modal
 * - Never silently converts NO to YES (D006)
 */
export default function PlayfulNo({ onActuallyYes, onConfirmNo }: PlayfulNoProps) {
  // Start at attempt 1 — they already clicked NO in P03
  const [attempts, setAttempts] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const yesActed = useRef(false);
  const noActed = useRef(false); // per-click guard

  const currentMsg = MESSAGES[Math.min(attempts, MESSAGES.length - 1)];
  const dodgePos = prefersReducedMotion
    ? { x: 0, y: 0 }
    : DODGE_POSITIONS[Math.min(attempts, DODGE_POSITIONS.length - 1)];

  const handleNoDodge = useCallback(() => {
    if (noActed.current) return;
    noActed.current = true;
    // Release the guard after a short delay so they can try again
    setTimeout(() => { noActed.current = false; }, 600);

    const next = attempts + 1;
    if (next >= 3) {
      // Third attempt: dodge one last time then show modal
      setAttempts(next);
      setTimeout(() => setShowModal(true), prefersReducedMotion ? 0 : 500);
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
    <div className="screen relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="content-card text-center max-w-sm mx-auto relative"
      >
        {/* Animated heading — swaps per attempt */}
        <AnimatePresence mode="wait">
          <motion.div
            key={attempts}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
          >
            <h1 className="font-serif text-display-md text-dark mb-3 text-balance">
              {currentMsg?.heading}
            </h1>
            <p className="font-sans text-body-md text-muted mb-6">
              {currentMsg?.body}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Question reminder */}
        <p className="font-sans text-body-sm text-muted/50 italic mb-8">
          "Would you go on a date with me?"
        </p>

        {/* YES — always prominent, always accessible */}
        <PrimaryButton
          onClick={handleActuallyYes}
          fullWidth
          className="mb-6"
          id="actually-yes-btn"
          aria-label="Change my mind — actually yes"
        >
          Actually YES ❤️
        </PrimaryButton>

        {/* NO — dodges within a spacious container */}
        <div
          className="relative h-16 flex items-center justify-center"
          aria-label="No button area"
        >
          <motion.div
            animate={dodgePos}
            transition={
              prefersReducedMotion
                ? { duration: 0.01 }
                : {
                    type: 'spring',
                    stiffness: 280,
                    damping: 18,
                    mass: 0.8,
                  }
            }
          >
            {/* Wiggle on entrance */}
            <motion.div
              initial={prefersReducedMotion ? {} : { rotate: -8 }}
              animate={prefersReducedMotion ? {} : { rotate: [0, -6, 6, -4, 3, 0] }}
              transition={{ delay: 0.3, duration: 0.55, ease: 'easeInOut' }}
            >
              <SecondaryButton
                onClick={handleNoDodge}
                id="no-dodge-btn"
                aria-label={`No — attempt ${attempts} of 3`}
                className="whitespace-nowrap text-sm"
              >
                NO 😏
              </SecondaryButton>
            </motion.div>
          </motion.div>
        </div>

        {/* Attempt counter — subtle accessibility aid */}
        <p
          className="font-sans text-body-sm text-muted/40 mt-3"
          aria-live="polite"
          aria-atomic="true"
        >
          {attempts < 3
            ? `${3 - attempts} more ${3 - attempts === 1 ? 'chance' : 'chances'} to change your mind`
            : ''}
        </p>
      </motion.div>

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
  // Trap focus on mount
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
        className="fixed inset-0 bg-dark/45 backdrop-blur-sm z-30"
      />

      {/* Modal — bottom sheet on mobile, centered on sm+ */}
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-heading"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        className="fixed inset-x-0 bottom-0 z-40 flex justify-center sm:inset-0 sm:items-center sm:p-8"
      >
        <div className="w-full max-w-sm bg-surface rounded-t-[2rem] sm:rounded-[2rem] px-8 pt-8 pb-10 sm:pb-8 shadow-2xl">
          {/* Handle (mobile) */}
          <div className="w-10 h-1 bg-border rounded-full mx-auto mb-6 sm:hidden" aria-hidden="true" />

          <div className="text-center">
            <p className="text-4xl mb-4 select-none" aria-hidden="true">😏</p>

            <h2
              id="modal-heading"
              className="font-serif text-display-md text-dark mb-2"
            >
              Nice try.
            </h2>

            <p className="font-sans text-body-md text-muted mb-8">
              But is this your <em>final</em> answer?
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
