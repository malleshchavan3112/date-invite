'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import type { SafeInvitationStatus, SafeResponseStatus } from '@/types';
import { checkCreatorStatusAction } from '@/lib/actions';
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
  // Local state for response allows live updates without page reload
  const [currentResponse, setCurrentResponse] = useState<SafeResponseStatus | null>(response);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastCheckedAt, setLastCheckedAt] = useState<Date>(() => new Date());

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

  // Keep state synced if server prop changes
  useEffect(() => {
    if (response) {
      setCurrentResponse(response);
    }
  }, [response]);

  // ── LIVE POLLING MECHANISM (STATE A: While waiting for response) ──
  useEffect(() => {
    // If response already exists or no token, do not poll
    if (currentResponse || !token) return;

    let isMounted = true;

    // Poll every 6 seconds for fresh response data from Supabase
    const pollInterval = setInterval(async () => {
      try {
        const result = await checkCreatorStatusAction(token);
        if (!isMounted) return;

        setLastCheckedAt(new Date());

        if (result.status === 'ok' && result.response) {
          // Detected response! Update state immediately -> triggers transition to State B
          setCurrentResponse(result.response);
          // Interval will be cleared when currentResponse changes
        }
      } catch (err) {
        console.error('[DateInvite Dashboard] Live poll error:', err);
      }
    }, 6000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [currentResponse, token]);

  // ── MANUAL REFRESH ACTION ──
  const handleManualRefresh = useCallback(async () => {
    if (!token || isRefreshing) return;
    setIsRefreshing(true);
    try {
      const result = await checkCreatorStatusAction(token);
      setLastCheckedAt(new Date());
      if (result.status === 'ok') {
        setCurrentResponse(result.response);
      }
    } catch (err) {
      console.error('[DateInvite Dashboard] Manual refresh failed:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [token, isRefreshing]);

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

  const hasResponse = Boolean(currentResponse);

  return (
    <div className="screen relative overflow-x-hidden min-h-dvh flex flex-col justify-start sm:justify-center items-center px-4 py-8 sm:py-12">
      {/* ── Ambient Decorative Background ── */}
      <DecorativeBackground />

      {/* ── Top Navigation Bar ── */}
      <header className="w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-[780px] mx-auto flex items-center justify-between mb-4 sm:mb-6 relative z-10 px-1">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-dark hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-lg p-1"
          aria-label="DateInvite homepage"
        >
          <span className="text-xl" aria-hidden="true">💌</span>
          <span className="font-serif text-lg font-normal tracking-tight">DateInvite</span>
        </Link>

        {/* Status indicator & Refresh button */}
        <div className="flex items-center gap-2">
          {token && (
            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              id="dashboard-header-refresh-btn"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-dark bg-white/80 border border-border px-3 py-1 rounded-full hover:bg-white transition-all shadow-2xs disabled:opacity-50 min-h-[32px]"
              title="Refresh response status from server"
            >
              <svg
                className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-primary' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>{isRefreshing ? 'Refreshing…' : 'Refresh'}</span>
            </button>
          )}

          <span className="text-[11px] uppercase tracking-widest font-bold text-muted/70 bg-sand-100/80 px-2.5 py-1 rounded-full border border-border/60">
            Creator Dashboard
          </span>
        </div>
      </header>

      {/* ── Main Dashboard Container (Responsive 680-780px Desktop Width) ── */}
      <main className="w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-[780px] mx-auto relative z-10">
        <DateInviteCard glow size="dashboard" className="!max-w-none">
          {!hasResponse ? (
            /* ── State 1: Waiting for response (Auto-polling every 6s) ── */
            <WaitingState
              invitation={invitation}
              invitationUrl={invitationUrl}
              token={token}
              onRefresh={handleManualRefresh}
              isRefreshing={isRefreshing}
              lastCheckedAt={lastCheckedAt}
            />
          ) : (
            /* ── State 2: Response Received (YES or NO) ── */
            <div className="space-y-6">
              <ResponseSummary
                response={currentResponse!}
                creatorName={invitation.creator_name}
              />

              {/* Response Timeline */}
              <ResponseTimeline
                invitationCreatedAt={invitation.created_at}
                responseSubmittedAt={currentResponse?.submitted_at || currentResponse?.created_at}
                hasResponse={true}
                answer={currentResponse?.answer}
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
