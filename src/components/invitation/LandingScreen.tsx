'use client';

import { motion } from 'framer-motion';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { FadeIn } from '@/components/ui/PageTransition';
import DecorativeBackground from '@/components/ui/DecorativeBackground';
import DateInviteCard from '@/components/ui/DateInviteCard';
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
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto relative z-10">
        <DateInviteCard glow size="narrow">
          {/* Floating 3D-styled sealed envelope centerpiece */}
          <FadeIn delay={0.06}>
            <div className="relative inline-flex items-center justify-center mb-6">
              {/* Soft atmospheric halo glow */}
              <div
                className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-primary/20 via-rose-300/20 to-amber-200/15 blur-xl -z-10"
                aria-hidden="true"
              />

              {/* Envelope badge container with gentle floating animation */}
              <motion.div
                animate={{
                  y: [0, -6, 0],
                  rotate: [-1.5, 1.5, -1.5],
                }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-24 h-24 rounded-3xl bg-gradient-to-b from-white to-pink-50/70 border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/10"
              >
                {/* Floating micro sparkles */}
                <motion.span
                  animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 0.9, 0.4] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-2 -right-1 text-sm select-none"
                  aria-hidden="true"
                >
                  ✨
                </motion.span>
                <motion.span
                  animate={{ scale: [1, 0.7, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                  className="absolute -bottom-1 -left-1 text-xs select-none"
                  aria-hidden="true"
                >
                  ✦
                </motion.span>

                {/* Love letter icon */}
                <span
                  className="text-5xl select-none leading-none drop-shadow-sm"
                  role="img"
                  aria-label="Love letter"
                >
                  💌
                </span>

                {/* Wax seal heart accent */}
                <span
                  className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-tr from-primary to-[#E93668] text-white flex items-center justify-center text-xs shadow-md border-2 border-white select-none"
                  aria-hidden="true"
                >
                  ♥
                </span>
              </motion.div>
            </div>
          </FadeIn>

          {/* Eyebrow badge */}
          <FadeIn delay={0.14}>
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-primary font-semibold bg-primary-subtle border border-primary/20 px-3.5 py-1 rounded-full shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" aria-hidden="true" />
                Just For You
              </span>
            </div>
          </FadeIn>

          {/* Main editorial heading */}
          <FadeIn delay={0.22}>
            <h1 className="font-serif text-2xl sm:text-3xl text-dark mb-3 text-balance leading-snug font-normal">
              You&apos;ve received a
              <span className="font-serif italic text-primary block sm:inline"> special invitation 💌</span>
            </h1>
          </FadeIn>

          {/* Supporting text */}
          <FadeIn delay={0.3}>
            <p className="font-sans text-sm sm:text-base text-muted-foreground mb-7 text-balance leading-relaxed">
              {invitation.intro_text}
            </p>
          </FadeIn>

          {/* Primary CTA */}
          <FadeIn delay={0.4}>
            <PrimaryButton
              onClick={onOpen}
              fullWidth
              id="open-invitation-btn"
              className="text-base sm:text-lg py-4 shadow-button hover:shadow-button-hover"
            >
              <span>Open My Invitation</span>
              <ArrowRight />
            </PrimaryButton>
          </FadeIn>

          {/* Subtle footer */}
          <FadeIn delay={0.5}>
            <p className="font-sans text-xs text-muted/60 mt-5 flex items-center justify-center gap-1.5">
              <span>Created with care</span>
              <span aria-hidden="true">•</span>
              <span>Private link</span>
            </p>
          </FadeIn>
        </DateInviteCard>
      </div>
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
