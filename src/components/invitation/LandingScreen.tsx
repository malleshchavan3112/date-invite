'use client';

import { motion } from 'framer-motion';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { FadeIn } from '@/components/ui/PageTransition';
import DecorativeBackground from '@/components/ui/DecorativeBackground';
import type { Invitation, PublicInvitation } from '@/types';

interface LandingScreenProps {
  invitation: Invitation | PublicInvitation;
  onOpen: () => void;
}

/**
 * P02 — Landing / Open Invitation
 * The "sealed envelope" reveal moment. Premium, romantic, and anticipatory.
 */
export default function LandingScreen({ invitation, onOpen }: LandingScreenProps) {
  return (
    <div className="screen relative overflow-hidden min-h-dvh flex flex-col justify-center items-center px-4 py-8">
      {/* ── Ambient Decorative Background ── */}
      <DecorativeBackground />

      {/* ── Main card ── */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-sm sm:max-w-md mx-auto bg-surface/95 backdrop-blur-md rounded-[2.25rem] p-7 sm:p-9 shadow-card hover:shadow-card-hover border border-border/80 transition-shadow duration-300 relative z-10 text-center"
      >
        {/* Rocking envelope icon with soft glow backdrop */}
        <FadeIn delay={0.08}>
          <div className="relative inline-flex items-center justify-center mb-5">
            <div
              className="w-20 h-20 rounded-full bg-primary-subtle border border-primary/20 flex items-center justify-center shadow-sm"
              aria-hidden="true"
            >
              <motion.div
                animate={{ rotate: [-3, 3, -3] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
                className="text-4xl select-none leading-none"
                role="img"
                aria-label="Love letter"
              >
                💌
              </motion.div>
            </div>
          </div>
        </FadeIn>

        {/* Eyebrow label */}
        <FadeIn delay={0.16}>
          <span className="inline-block text-xs uppercase tracking-widest text-primary font-semibold mb-3 bg-primary-subtle border border-primary/20 px-3.5 py-1 rounded-full">
            Just For You
          </span>
        </FadeIn>

        {/* Main heading */}
        <FadeIn delay={0.24}>
          <h1 className="font-serif text-2xl sm:text-3xl text-dark mb-3 text-balance leading-snug font-normal">
            You&apos;ve received a special invitation&nbsp;💌
          </h1>
        </FadeIn>

        {/* Supporting text */}
        <FadeIn delay={0.34}>
          <p className="font-sans text-sm sm:text-base text-muted-foreground mb-7 text-balance leading-relaxed">
            {invitation.intro_text}
          </p>
        </FadeIn>

        {/* CTA */}
        <FadeIn delay={0.46}>
          <PrimaryButton
            onClick={onOpen}
            fullWidth
            id="open-invitation-btn"
            className="text-base sm:text-lg py-4"
          >
            <span>Open My Invitation</span>
            <ArrowRight />
          </PrimaryButton>
        </FadeIn>

        {/* Subtle footer hint */}
        <FadeIn delay={0.58}>
          <p className="font-sans text-xs text-muted/60 mt-5">
            Created with care • Private link
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
      className="flex-shrink-0 ml-1"
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
