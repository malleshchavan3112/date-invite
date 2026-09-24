'use client';

import { motion } from 'framer-motion';
import { FadeIn } from '@/components/ui/PageTransition';
import DecorativeBackground from '@/components/ui/DecorativeBackground';

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

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-sm sm:max-w-md mx-auto bg-surface/95 backdrop-blur-md rounded-[2.25rem] p-7 sm:p-9 shadow-card hover:shadow-card-hover border border-border/80 transition-shadow duration-300 relative z-10 text-center"
      >
        {/* Gently swaying cherry blossom motif */}
        <FadeIn delay={0.08}>
          <motion.div
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="text-5xl mb-5 select-none leading-none inline-block"
            role="img"
            aria-label="Cherry blossom"
          >
            🌸
          </motion.div>
        </FadeIn>

        {/* Main heading */}
        <FadeIn delay={0.18}>
          <h1 className="font-serif text-2xl sm:text-3xl text-dark mb-2.5 font-normal">
            I understand.
          </h1>
        </FadeIn>

        <FadeIn delay={0.28}>
          <p className="font-sans text-base text-muted-foreground mb-2">
            Maybe next time.
          </p>
        </FadeIn>

        <FadeIn delay={0.38}>
          <p className="font-sans text-sm text-muted leading-relaxed">
            Thank you for being honest. Take care&nbsp;🌿
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
      </motion.div>
    </div>
  );
}
