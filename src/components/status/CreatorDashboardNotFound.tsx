'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import DecorativeBackground from '@/components/ui/DecorativeBackground';
import DateInviteCard from '@/components/ui/DateInviteCard';
import PrimaryButton from '@/components/ui/PrimaryButton';

export default function CreatorDashboardNotFound() {
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
                className="w-20 h-20 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shadow-inner"
                aria-hidden="true"
              >
                <motion.span
                  animate={{ rotate: [-4, 4, -4] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-4xl select-none leading-none"
                  role="img"
                  aria-label="Dashboard not found"
                >
                  🔐
                </motion.span>
              </div>
            </div>

            {/* Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold mb-3">
              <span>Private Access</span>
            </div>

            {/* Main heading */}
            <h1 className="font-serif text-2xl sm:text-3xl text-dark mb-2.5 font-normal">
              Creator dashboard not found
            </h1>

            {/* Description — Safe, no database or SQL errors */}
            <p className="font-sans text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
              We couldn&apos;t find an invitation dashboard matching this private link. Please make sure the entire link was copied correctly.
            </p>

            {/* Action */}
            <Link href="/create" className="block w-full">
              <PrimaryButton fullWidth id="dashboard-not-found-create-btn">
                Create a New Invitation ✨
              </PrimaryButton>
            </Link>

            <div className="mt-4">
              <Link
                href="/"
                className="text-xs font-medium text-muted hover:text-dark transition-colors underline underline-offset-4"
              >
                Return to DateInvite Home
              </Link>
            </div>
          </div>
        </DateInviteCard>
      </div>
    </div>
  );
}
