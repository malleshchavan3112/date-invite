'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { SafeInvitationStatus } from '@/types';
import CopyLinkButton from './CopyLinkButton';
import ShareButton from './ShareButton';
import ResponseTimeline from './ResponseTimeline';

interface WaitingStateProps {
  invitation: SafeInvitationStatus;
  invitationUrl: string;
  token?: string;
}

export default function WaitingState({
  invitation,
  invitationUrl,
  token,
}: WaitingStateProps) {
  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="text-center">
        <div className="relative inline-flex items-center justify-center mb-4">
          {/* Subtle floating celebration/waiting particles */}
          <motion.span
            animate={{ y: [0, -4, 0], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-2 -left-2 text-base select-none pointer-events-none"
            aria-hidden="true"
          >
            ✨
          </motion.span>
          <motion.span
            animate={{ y: [0, 4, 0], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            className="absolute -top-3 -right-2 text-sm select-none pointer-events-none"
            aria-hidden="true"
          >
            💌
          </motion.span>

          {/* Ambient glow behind icon */}
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/25 to-pink-200/40 blur-lg -z-10"
            aria-hidden="true"
          />

          <motion.div
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-white via-rose-50 to-pink-100/80 border-2 border-primary/25 flex items-center justify-center text-4xl shadow-md select-none"
          >
            💌
          </motion.div>
        </div>

        {/* Status Pill */}
        <div className="mb-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" aria-hidden="true" />
            <span>Waiting for Response</span>
          </span>
        </div>

        {/* Heading */}
        <h2 className="font-serif text-2xl sm:text-3xl text-dark mb-2 font-normal leading-snug text-balance">
          Your invitation is waiting for a response&nbsp;✨
        </h2>

        {/* Subtitle */}
        <p className="font-sans text-sm sm:text-base text-muted-foreground max-w-sm mx-auto leading-relaxed text-balance">
          {invitation.creator_name
            ? `Your invitation from ${invitation.creator_name} is active and ready.`
            : 'Your invitation is active and ready.'}{' '}
          Share your link with your special someone!
        </p>
      </div>

      {/* Status Checklist Card */}
      <div className="bg-white/80 backdrop-blur-sm border border-primary/15 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-3 flex items-center gap-1.5">
          <span aria-hidden="true">📋</span>
          <span>Invitation Status</span>
        </h3>

        <div className="space-y-2.5">
          <div className="flex items-center gap-3 text-sm text-dark font-medium">
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
              ✓
            </span>
            <span>Invitation Created</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-dark font-medium">
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
              ✓
            </span>
            <span>Link Ready to Share</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-amber-800 font-semibold bg-amber-50/70 p-2 rounded-xl border border-amber-200/60">
            <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 animate-pulse">
              ⏳
            </span>
            <span>Waiting for Response</span>
          </div>
        </div>
      </div>

      {/* Shareable Link Box */}
      <div>
        <label
          htmlFor="public-invitation-link-input"
          className="block text-xs uppercase tracking-wider text-muted font-sans font-semibold mb-2"
        >
          Shareable Invitation Link
        </label>
        <div className="flex items-center justify-between gap-2 px-3.5 py-3 rounded-2xl bg-sand-50/90 border border-border hover:border-primary/40 transition-colors">
          <span
            id="public-invitation-link-input"
            className="text-xs sm:text-sm font-mono text-dark/90 truncate select-all"
          >
            {invitationUrl}
          </span>
          <CopyLinkButton url={invitationUrl} variant="icon" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-1">
        <CopyLinkButton url={invitationUrl} variant="primary" className="w-full" />
        <ShareButton url={invitationUrl} className="w-full" />
      </div>

      {/* Visual Timeline */}
      <ResponseTimeline
        invitationCreatedAt={invitation.created_at}
        hasResponse={false}
      />

      {/* Private Creator Dashboard Save Callout */}
      {token && (
        <div className="bg-sand-50/90 border border-border/80 rounded-2xl p-4 space-y-1.5 text-left">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dark">
            <span aria-hidden="true">🔐</span>
            <span>Private Dashboard Link</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Bookmark your current URL or copy this private link so you can return to check for responses anytime without creating an account.
          </p>
        </div>
      )}

      {/* Preview Link */}
      <div className="pt-2 text-center border-t border-border/70">
        <p className="text-xs text-muted mb-1.5">Curious to see what they will see?</p>
        <Link
          href={`/invite/${invitation.slug}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:text-primary-hover underline underline-offset-4"
        >
          <span>Preview your invitation</span>
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </div>
  );
}
