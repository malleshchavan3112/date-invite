'use client';

import { motion } from 'framer-motion';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { FadeIn } from '@/components/ui/PageTransition';
import type { Invitation, PublicInvitation } from '@/types';

interface LandingScreenProps {
  invitation: Invitation | PublicInvitation;
  onOpen: () => void;
}

// Subtle floating decorative elements (aria-hidden, purely visual)
const FLOATERS = [
  { emoji: '✨', x: '8%',  y: '18%', delay: 0.2,  size: 'text-lg',  dur: 5 },
  { emoji: '💕', x: '82%', y: '14%', delay: 0.6,  size: 'text-xl',  dur: 4 },
  { emoji: '🌸', x: '6%',  y: '68%', delay: 1.0,  size: 'text-base',dur: 6 },
  { emoji: '✨', x: '86%', y: '62%', delay: 0.4,  size: 'text-sm',  dur: 5 },
  { emoji: '💫', x: '74%', y: '84%', delay: 0.8,  size: 'text-base',dur: 4 },
  { emoji: '🌹', x: '14%', y: '82%', delay: 1.3,  size: 'text-sm',  dur: 6 },
  { emoji: '💗', x: '50%', y: '5%',  delay: 1.1,  size: 'text-sm',  dur: 5 },
] as const;

/**
 * P02 — Landing / Open Invitation
 * The "sealed envelope" reveal moment. Premium and anticipatory.
 */
export default function LandingScreen({ invitation, onOpen }: LandingScreenProps) {
  return (
    <div className="screen relative overflow-hidden">
      {/* ── Decorative background floaters ── */}
      {FLOATERS.map((el, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className={`absolute select-none pointer-events-none ${el.size}`}
          style={{ left: el.x, top: el.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.55, 0.45, 0.55],
            scale: [0, 1, 0.92, 1],
            y: [0, -10, 0],
          }}
          transition={{
            opacity: { delay: el.delay + 0.6, duration: 0.8 },
            scale:   { delay: el.delay + 0.6, duration: 0.5 },
            y:       { delay: el.delay + 1.2, duration: el.dur, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          {el.emoji}
        </motion.span>
      ))}

      {/* ── Main card ── */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="content-card text-center max-w-sm mx-auto relative z-10"
      >
        {/* Rocking envelope icon */}
        <FadeIn delay={0.08}>
          <motion.div
            animate={{ rotate: [-4, 4, -4] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="text-5xl mb-6 select-none leading-none"
            role="img"
            aria-label="Love letter"
          >
            💌
          </motion.div>
        </FadeIn>

        {/* Eyebrow label */}
        <FadeIn delay={0.16}>
          <p className="text-label uppercase tracking-widest text-muted mb-3">
            For you
          </p>
        </FadeIn>

        {/* Main heading */}
        <FadeIn delay={0.25}>
          <h1 className="font-serif text-display-md text-dark mb-4 text-balance leading-tight">
            You&apos;ve received a special invitation&nbsp;💌
          </h1>
        </FadeIn>

        {/* Supporting text */}
        <FadeIn delay={0.38}>
          <p className="font-sans text-body-md text-muted mb-8 text-balance">
            {invitation.intro_text}
          </p>
        </FadeIn>

        {/* CTA */}
        <FadeIn delay={0.52}>
          <PrimaryButton
            onClick={onOpen}
            fullWidth
            id="open-invitation-btn"
          >
            Open My Invitation
            <ArrowRight />
          </PrimaryButton>
        </FadeIn>

        {/* Subtle footer hint */}
        <FadeIn delay={0.7}>
          <p className="font-sans text-body-sm text-muted/60 mt-5">
            This invitation was made just for you.
          </p>
        </FadeIn>
      </motion.div>
    </div>
  );
}

function ArrowRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="flex-shrink-0"
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
