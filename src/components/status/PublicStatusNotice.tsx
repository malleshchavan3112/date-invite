'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import DecorativeBackground from '@/components/ui/DecorativeBackground';
import DateInviteCard from '@/components/ui/DateInviteCard';
import PrimaryButton from '@/components/ui/PrimaryButton';

interface PublicStatusNoticeProps {
  slug: string;
  creatorName?: string;
}

export default function PublicStatusNotice({
  slug,
  creatorName,
}: PublicStatusNoticeProps) {
  return (
    <div className="screen relative overflow-hidden min-h-dvh flex flex-col justify-center items-center px-4 py-8">
      {/* ── Ambient Decorative Background ── */}
      <DecorativeBackground />

      <div className="w-full max-w-sm sm:max-w-md mx-auto relative z-10">
        <DateInviteCard>
          <div className="text-center">
            {/* Lock / Key Icon */}
            <div className="relative inline-flex items-center justify-center mb-4">
              <div
                className="w-20 h-20 rounded-full bg-sand-100 border border-border flex items-center justify-center shadow-inner"
                aria-hidden="true"
              >
                <motion.span
                  animate={{ rotate: [-3, 3, -3] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-4xl select-none leading-none"
                  role="img"
                  aria-label="Private dashboard"
                >
                  🔐
                </motion.span>
              </div>
            </div>

            {/* Pill */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sand-100 border border-border text-dark text-xs font-semibold mb-3">
              <span>Creator Access</span>
            </div>

            {/* Main heading */}
            <h1 className="font-serif text-2xl sm:text-3xl text-dark mb-2.5 font-normal leading-snug">
              Private Creator Dashboard
            </h1>

            {/* Explanation */}
            <p className="font-sans text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed">
              Responses are private. To protect confidentiality, invitation responses are only accessible via your unique private link (<code>/manage/...</code>).
            </p>

            <div className="bg-sand-50 border border-border rounded-xl p-3.5 text-xs text-muted-foreground text-left mb-6 leading-relaxed">
              💡 <strong>Are you {creatorName || 'the creator'}?</strong> Please open the private dashboard link you saved when creating this invitation.
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <Link href={`/invite/${slug}`} className="block w-full">
                <PrimaryButton fullWidth id="view-public-invitation-btn">
                  Open Public Invitation 💌
                </PrimaryButton>
              </Link>

              <Link
                href="/"
                className="block text-xs font-medium text-muted hover:text-dark transition-colors py-1.5 underline underline-offset-4"
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
