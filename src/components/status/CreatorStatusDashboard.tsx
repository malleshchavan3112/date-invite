'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import type { SafeInvitationStatus, SafeResponseStatus } from '@/types';
import DecorativeBackground from '@/components/ui/DecorativeBackground';
import DateInviteCard from '@/components/ui/DateInviteCard';
import WaitingState from './WaitingState';
import ResponseSummary from './ResponseSummary';
import ResponseTimeline from './ResponseTimeline';
import CopyLinkButton from './CopyLinkButton';
import ShareButton from './ShareButton';

interface CreatorStatusDashboardProps {
  invitation: SafeInvitationStatus;
  response: SafeResponseStatus | null;
  token?: string;
}

export default function CreatorStatusDashboard({
  invitation,
  response,
  token,
}: CreatorStatusDashboardProps) {
  const [invitationUrl, setInvitationUrl] = useState<string>(() => {
    return `https://dateinvite.me/invite/${invitation.slug}`;
  });
  const [dashboardUrl, setDashboardUrl] = useState<string>(() => {
    return token ? `https://dateinvite.me/manage/${token}` : '';
  });
  const [copiedDashboard, setCopiedDashboard] = useState<boolean>(false);

  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.origin) {
      setInvitationUrl(`${window.location.origin}/invite/${invitation.slug}`);
      if (token) {
        setDashboardUrl(`${window.location.origin}/manage/${token}`);
      }
    }
  }, [invitation.slug, token]);

  const handleCopyDashboard = async () => {
    if (!dashboardUrl) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(dashboardUrl);
      } else {
        const ta = document.createElement('textarea');
        ta.value = dashboardUrl;
        ta.style.position = 'fixed';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopiedDashboard(true);
      setTimeout(() => setCopiedDashboard(false), 2500);
    } catch {
      // ignore
    }
  };

  const hasResponse = Boolean(response);

  return (
    <div className="screen relative overflow-x-hidden min-h-dvh flex flex-col justify-start sm:justify-center items-center px-4 py-8 sm:py-12">
      {/* ── Ambient Decorative Background ── */}
      <DecorativeBackground />

      {/* ── Top Navigation Bar ── */}
      <header className="w-full max-w-sm sm:max-w-md md:max-w-xl mx-auto flex items-center justify-between mb-4 sm:mb-6 relative z-10 px-1">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-dark hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-lg p-1"
          aria-label="DateInvite homepage"
        >
          <span className="text-xl" aria-hidden="true">💌</span>
          <span className="font-serif text-lg font-normal tracking-tight">DateInvite</span>
        </Link>

        <span className="text-[11px] uppercase tracking-widest font-bold text-muted/70 bg-sand-100/80 px-2.5 py-1 rounded-full border border-border/60">
          Creator Dashboard
        </span>
      </header>

      {/* ── Main Dashboard Container ── */}
      <main className="w-full max-w-sm sm:max-w-md md:max-w-xl mx-auto relative z-10">
        <DateInviteCard glow className="!max-w-none">
          {!hasResponse ? (
            /* ── State 1: Waiting for response ── */
            <WaitingState
              invitation={invitation}
              invitationUrl={invitationUrl}
              token={token}
            />
          ) : (
            /* ── State 2: Response Received (YES or NO) ── */
            <div className="space-y-6">
              <ResponseSummary
                response={response!}
                creatorName={invitation.creator_name}
              />

              {/* Response Timeline */}
              <ResponseTimeline
                invitationCreatedAt={invitation.created_at}
                responseSubmittedAt={response?.submitted_at || response?.created_at}
                hasResponse={true}
                answer={response?.answer}
              />

              {/* Private Dashboard Save Banner */}
              {token && (
                <div className="bg-sand-50/90 border border-border/80 rounded-2xl p-4 space-y-2 text-left">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-xs uppercase tracking-wider font-bold text-dark flex items-center gap-1.5">
                      <span aria-hidden="true">🔐</span>
                      <span>Your Private Dashboard Link</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyDashboard}
                      id="dashboard-copy-token-link-btn"
                      className="text-xs font-semibold text-primary hover:text-primary-hover underline underline-offset-2"
                    >
                      {copiedDashboard ? 'Link Copied! ✓' : 'Copy Dashboard Link'}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Bookmark your current URL or copy this private link so you can return to check for responses anytime without creating an account.
                  </p>
                </div>
              )}

              {/* Public link reference */}
              <div className="pt-2 border-t border-border/70">
                <label
                  htmlFor="dashboard-invitation-url"
                  className="block text-xs uppercase tracking-wider text-muted font-sans font-semibold mb-2"
                >
                  Public Invitation Link (Sent to your date)
                </label>
                <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-sand-50/90 border border-border text-xs sm:text-sm font-mono text-dark/90">
                  <span id="dashboard-invitation-url" className="truncate select-all">
                    {invitationUrl}
                  </span>
                  <CopyLinkButton url={invitationUrl} variant="icon" />
                </div>
              </div>

              {/* Actions row */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <CopyLinkButton url={invitationUrl} variant="secondary" className="flex-1" />
                <ShareButton url={invitationUrl} className="flex-1" />
              </div>

              {/* Navigation links */}
              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted flex-wrap gap-2">
                <Link
                  href={`/invite/${invitation.slug}`}
                  target="_blank"
                  className="hover:text-primary transition-colors underline underline-offset-4"
                >
                  Preview public invitation ↗
                </Link>

                <Link
                  href="/create"
                  className="hover:text-primary transition-colors underline underline-offset-4"
                >
                  Create another invitation +
                </Link>
              </div>
            </div>
          )}
        </DateInviteCard>
      </main>

      {/* ── Footer ── */}
      <footer className="mt-8 text-center relative z-10">
        <p className="text-xs text-muted/60 font-sans">
          DateInvite • Private & Safe Date Invitations
        </p>
      </footer>
    </div>
  );
}
