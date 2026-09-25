'use client';

import { motion } from 'framer-motion';
import { FadeIn } from '@/components/ui/PageTransition';
import DecorativeBackground from '@/components/ui/DecorativeBackground';
import DateInviteCard from '@/components/ui/DateInviteCard';

/**
 * P05 — Respectful NO Completion
 * Graceful, warm, non-judgmental ending for users who confirmed NO.
 * No further navigation. No questionnaire. (D006)
 */
export default function NoCompletion() {
  return (
    <div className="screen relative overflow-hidden min-h-dvh flex flex-col justify-center items-center px-4 py-8">
      {/* ── Ambient Decorative Background ── */}
      <DecorativeBackground />

      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto relative z-10">
        <DateInviteCard size="narrow">
          {/* Gently swaying cherry blossom / sprig motif */}
          <FadeIn delay={0.08}>
            <div className="relative inline-flex items-center justify-center mb-5">
              <div
                className="w-20 h-20 rounded-full bg-emerald-50/70 border border-emerald-200/50 flex items-center justify-center shadow-inner"
                aria-hidden="true"
              >
                <motion.div
                  animate={{ rotate: [-4, 4, -4] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-4xl select-none leading-none inline-block"
                  role="img"
                  aria-label="Peaceful sprig"
                >
                  🌿
                </motion.div>
              </div>
            </div>
          </FadeIn>

          {/* Main heading */}
          <FadeIn delay={0.18}>
            <h1 className="font-serif text-2xl sm:text-3xl text-dark mb-2.5 font-normal">
              No worries.&nbsp;🤝
            </h1>
          </FadeIn>

          <FadeIn delay={0.28}>
            <p className="font-sans text-base text-muted-foreground mb-2">
              Thanks for being honest.
            </p>
          </FadeIn>

          <FadeIn delay={0.38}>
            <p className="font-sans text-sm text-muted leading-relaxed">
              Maybe another time. Take good care&nbsp;🌸
            </p>
          </FadeIn>

          {/* Subtle decorative divider */}
          <FadeIn delay={0.5}>
            <div className="flex items-center justify-center gap-3 mt-8" aria-hidden="true">
              <div className="h-px flex-1 bg-border/80" />
              <span className="text-muted/40 text-xs">✦</span>
              <div className="h-px flex-1 bg-border/80" />
            </div>
          </FadeIn>

          <FadeIn delay={0.6}>
            <p className="font-sans text-label text-muted/40 uppercase tracking-widest mt-4 text-[10px]">
              DateInvite
            </p>
          </FadeIn>
        </DateInviteCard>
      </div>
    </div>
  );
}
