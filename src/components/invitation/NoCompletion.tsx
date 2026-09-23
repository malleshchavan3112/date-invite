'use client';

import { motion } from 'framer-motion';
import { FadeIn } from '@/components/ui/PageTransition';

/**
 * P05 — Respectful NO Completion
 * Graceful, warm, non-judgmental ending for users who confirmed NO.
 * No further navigation. No questionnaire. (D006)
 */
export default function NoCompletion() {
  return (
    <div className="screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="content-card text-center max-w-sm mx-auto"
      >
        {/* Gently swaying flower */}
        <FadeIn delay={0.08}>
          <motion.div
            animate={{ rotate: [-6, 6, -6] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="text-5xl mb-6 select-none leading-none"
            role="img"
            aria-label="Cherry blossom"
          >
            🌸
          </motion.div>
        </FadeIn>

        {/* Main message */}
        <FadeIn delay={0.2}>
          <h1 className="font-serif text-display-md text-dark mb-3">
            I understand.
          </h1>
        </FadeIn>

        <FadeIn delay={0.34}>
          <p className="font-sans text-body-lg text-muted mb-3">
            Maybe next time.
          </p>
        </FadeIn>

        <FadeIn delay={0.48}>
          <p className="font-sans text-body-sm text-muted/70">
            Thank you for being honest. Take care&nbsp;🌿
          </p>
        </FadeIn>

        {/* Subtle decorative divider */}
        <FadeIn delay={0.65}>
          <div className="flex items-center justify-center gap-3 mt-8" aria-hidden="true">
            <div className="h-px flex-1 bg-border" />
            <span className="text-muted/40 text-xs">✦</span>
            <div className="h-px flex-1 bg-border" />
          </div>
        </FadeIn>

        <FadeIn delay={0.78}>
          <p className="font-sans text-label text-muted/40 uppercase tracking-widest mt-4">
            DateInvite
          </p>
        </FadeIn>
      </motion.div>
    </div>
  );
}
