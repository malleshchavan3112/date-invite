'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import DecorativeBackground from '@/components/ui/DecorativeBackground';
import DateInviteCard from '@/components/ui/DateInviteCard';
import PrimaryButton from '@/components/ui/PrimaryButton';

export default function StatusErrorState() {
  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className="screen relative overflow-hidden min-h-dvh flex flex-col justify-center items-center px-4 py-8">
      {/* ── Ambient Decorative Background ── */}
      <DecorativeBackground />

      <div className="w-full max-w-sm sm:max-w-md mx-auto relative z-10">
        <DateInviteCard>
          <div className="text-center">
            {/* Icon */}
            <div className="relative inline-flex items-center justify-center mb-4">
              <div
                className="w-20 h-20 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center shadow-inner"
                aria-hidden="true"
              >
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-4xl select-none leading-none"
                  role="img"
                  aria-label="Server error"
                >
                  🥀
                </motion.span>
              </div>
            </div>

            {/* Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold mb-3">
              <span>Connection Error</span>
            </div>

            {/* Main heading */}
            <h1 className="font-serif text-2xl sm:text-3xl text-dark mb-2.5 font-normal">
              Something went wrong
            </h1>

            {/* Description — Safe, no SQL or stack traces */}
            <p className="font-sans text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
              Something went wrong while loading this invitation. Please try refreshing the page in a moment.
            </p>

            {/* Action buttons */}
            <div className="space-y-3">
              <PrimaryButton onClick={handleReload} fullWidth id="retry-status-btn">
                Try Refreshing Page 🔄
              </PrimaryButton>

              <Link href="/" className="block w-full text-center">
                <span className="text-xs font-medium text-muted hover:text-dark transition-colors underline underline-offset-4">
                  Return to Home
                </span>
              </Link>
            </div>
          </div>
        </DateInviteCard>
      </div>
    </div>
  );
}
