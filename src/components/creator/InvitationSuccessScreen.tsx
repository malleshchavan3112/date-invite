'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { FadeIn } from '@/components/ui/PageTransition';
import DecorativeBackground from '@/components/ui/DecorativeBackground';
import DateInviteCard from '@/components/ui/DateInviteCard';

export default function InvitationSuccessScreen() {
  const searchParams = useSearchParams();

  const [slug, setSlug] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [invitationUrl, setInvitationUrl] = useState<string>('');
  const [dashboardUrl, setDashboardUrl] = useState<string>('');
  const [copiedInvite, setCopiedInvite] = useState<boolean>(false);
  const [copiedDashboard, setCopiedDashboard] = useState<boolean>(false);
  const [copyAnnouncement, setCopyAnnouncement] = useState<string>('');

  useEffect(() => {
    const paramSlug = searchParams.get('slug');
    const paramToken = searchParams.get('token');
    let resolvedSlug = paramSlug;
    let resolvedToken = paramToken;

    if (!resolvedSlug && typeof window !== 'undefined') {
      resolvedSlug = sessionStorage.getItem('dateinvite_last_slug') || 'demo-date';
    }
    if (!resolvedToken && typeof window !== 'undefined') {
      resolvedToken = sessionStorage.getItem('dateinvite_last_token') || '';
    }

    if (!resolvedSlug) {
      resolvedSlug = 'demo-date';
    }

    setSlug(resolvedSlug);
    setToken(resolvedToken || '');

    const origin =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : 'https://dateinvite.me';

    setInvitationUrl(`${origin}/invite/${resolvedSlug}`);
    if (resolvedToken) {
      setDashboardUrl(`${origin}/manage/${resolvedToken}`);
    }
  }, [searchParams]);

  const handleCopyInviteLink = async () => {
    if (!invitationUrl) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(invitationUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = invitationUrl;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setCopiedInvite(true);
      setCopyAnnouncement('Invitation link copied to clipboard.');
      setTimeout(() => {
        setCopiedInvite(false);
        setCopyAnnouncement('');
      }, 2500);
    } catch {
      setCopyAnnouncement('Failed to copy. Please manually copy the link.');
    }
  };

  const handleCopyDashboardLink = async () => {
    if (!dashboardUrl) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(dashboardUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = dashboardUrl;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setCopiedDashboard(true);
      setCopyAnnouncement('Dashboard link copied to clipboard.');
      setTimeout(() => {
        setCopiedDashboard(false);
        setCopyAnnouncement('');
      }, 2500);
    } catch {
      setCopyAnnouncement('Failed to copy dashboard link.');
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: "You're Invited 💌",
          text: 'Someone has a special date invitation for you.',
          url: invitationUrl,
        });
      } catch (err: unknown) {
        if ((err as Error)?.name !== 'AbortError') {
          handleCopyInviteLink();
        }
      }
    } else {
      handleCopyInviteLink();
    }
  };

  const getWhatsAppShareUrl = () => {
    const message = `Hey! I made you a little invitation 💌\n\nOpen this:\n${invitationUrl}`;
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="screen relative overflow-hidden min-h-dvh flex flex-col justify-center items-center px-4 py-8">
      {/* Accessible live region for copy announcements */}
      <div className="sr-only" aria-live="polite" role="status">
        {copyAnnouncement}
      </div>

      {/* ── Ambient Decorative Background ── */}
      <DecorativeBackground />

      <div className="w-full max-w-sm sm:max-w-md mx-auto relative z-10">
        {/* Success Icon & Heading */}
        <div className="text-center mb-6">
          <FadeIn delay={0.08}>
            <div className="relative inline-flex items-center justify-center mb-4">
              {/* Floating celebration micro-sparkles */}
              <motion.span
                animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6], y: [0, -3, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-2 -left-2 text-base select-none pointer-events-none"
              >
                ✨
              </motion.span>
              <motion.span
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.9, 0.5], y: [0, -4, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                className="absolute -top-3 -right-3 text-sm select-none pointer-events-none"
              >
                💕
              </motion.span>
              <motion.span
                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
                className="absolute -bottom-2 -left-3 text-xs select-none pointer-events-none"
              >
                🎉
              </motion.span>

              {/* Ambient glow behind celebration envelope */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/30 to-pink-200/50 blur-lg -z-10" />

              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 350, damping: 20, delay: 0.1 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-white via-rose-50 to-pink-100/80 border-2 border-primary/25 flex items-center justify-center text-4xl shadow-card"
              >
                💌
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 450, damping: 18, delay: 0.3 }}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shadow-button border-2 border-white"
              >
                ✓
              </motion.div>
            </div>
          </FadeIn>

          <FadeIn delay={0.14}>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-semibold mb-3 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Ready to Share</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.18}>
            <h1 className="font-serif text-3xl sm:text-4xl text-dark mb-2 leading-tight text-balance font-normal">
              Your invitation is ready&nbsp;✨
            </h1>
          </FadeIn>

          <FadeIn delay={0.26}>
            <p className="font-sans text-sm sm:text-base text-muted-foreground max-w-xs mx-auto text-balance">
              Now send this link to the person you&apos;d love to hear from.
            </p>
          </FadeIn>
        </div>

        {/* Link Card & Action Container */}
        <DateInviteCard delay={0.32} className="space-y-6">
          {/* ── SECTION 1: PUBLIC INVITATION LINK ── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="invitation-url-display"
                className="block text-xs uppercase tracking-wider text-muted font-sans font-bold flex items-center gap-1.5"
              >
                <span aria-hidden="true">💌</span>
                <span>Invitation Link (For Your Date)</span>
              </label>
            </div>
            <div
              id="invitation-url-display"
              className="flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl bg-sand-50/80 border border-border text-dark text-xs sm:text-sm font-mono break-all select-all group hover:border-primary/40 transition-colors"
            >
              <span className="truncate text-dark/90 font-medium">
                {invitationUrl || 'Generating link…'}
              </span>
              <button
                type="button"
                onClick={handleCopyInviteLink}
                aria-label="Copy invitation link"
                className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-primary-subtle transition-colors flex-shrink-0"
                title="Copy to clipboard"
              >
                {copiedInvite ? <CheckIcon /> : <CopyIcon />}
              </button>
            </div>
          </div>

          {/* Actions Stack for Public Invitation */}
          <div className="space-y-3 pt-1">
            {/* Primary: Copy Link Button */}
            <PrimaryButton
              type="button"
              onClick={handleCopyInviteLink}
              fullWidth
              id="copy-link-btn"
              className={copiedInvite ? '!bg-emerald-600 hover:!bg-emerald-700 py-3.5' : 'py-3.5'}
            >
              <AnimatePresence mode="wait" initial={false}>
                {copiedInvite ? (
                  <motion.span
                    key="copied"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="inline-flex items-center gap-2"
                  >
                    <CheckIcon />
                    Link Copied ✓
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="inline-flex items-center gap-2"
                  >
                    <CopyIcon />
                    Copy Invitation Link
                  </motion.span>
                )}
              </AnimatePresence>
            </PrimaryButton>

            {/* Secondary: Native Share Button */}
            <SecondaryButton
              type="button"
              onClick={handleNativeShare}
              fullWidth
              id="share-invitation-btn"
              className="py-3"
            >
              <ShareIcon />
              Share Invitation
            </SecondaryButton>

            {/* Optional: WhatsApp Share Button */}
            <a
              href={getWhatsAppShareUrl()}
              target="_blank"
              rel="noopener noreferrer"
              id="whatsapp-share-btn"
              className="w-full inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3 text-sm sm:text-base font-semibold transition-all duration-180 bg-[#25D366] text-white hover:bg-[#20BA5A] shadow-sm hover:shadow active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 min-h-[44px]"
            >
              <WhatsAppIcon />
              Share on WhatsApp
            </a>
          </div>

          {/* ── SECTION 2: PRIVATE CREATOR DASHBOARD ── */}
          <div className="pt-5 border-t border-border/70 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-base" aria-hidden="true">🔐</span>
              <div>
                <h2 className="text-sm font-bold text-dark font-serif">
                  Creator Dashboard
                </h2>
                <p className="text-xs text-muted-foreground">
                  Use your private dashboard link to check your response later.
                </p>
              </div>
            </div>

            {/* Important Save Callout */}
            <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-3.5 text-xs text-amber-900 leading-relaxed shadow-2xs">
              <div className="flex items-start gap-2">
                <span className="text-amber-600 text-sm mt-0.5" aria-hidden="true">⚠️</span>
                <div>
                  <strong className="font-semibold block mb-0.5">Save this private dashboard link:</strong>
                  You can use it to return to your invitation anytime without creating an account.
                </div>
              </div>
            </div>

            {/* Dashboard Actions */}
            <div className="space-y-2 pt-1">
              {dashboardUrl ? (
                <>
                  <Link href={`/manage/${token}`} className="block w-full">
                    <button
                      type="button"
                      id="open-dashboard-btn"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200 bg-sand-100 hover:bg-sand-200 text-dark border border-border/80 shadow-xs hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                      <span>Open Creator Dashboard</span>
                      <span aria-hidden="true">↗</span>
                    </button>
                  </Link>

                  <button
                    type="button"
                    onClick={handleCopyDashboardLink}
                    id="copy-dashboard-link-btn"
                    className={`w-full inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold transition-all border ${
                      copiedDashboard
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-white hover:bg-sand-50 text-muted-foreground hover:text-dark border-border'
                    }`}
                  >
                    {copiedDashboard ? (
                      <>
                        <CheckIcon className="w-4 h-4 text-emerald-600" />
                        <span>Dashboard link copied! ✓</span>
                      </>
                    ) : (
                      <>
                        <CopyIcon className="w-4 h-4" />
                        <span>Copy Dashboard Link</span>
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="text-center py-2 text-xs text-muted">
                  Creating private dashboard link…
                </div>
              )}
            </div>
          </div>

          {/* Preview link for creator testing */}
          <div className="pt-3 border-t border-border/60 text-center">
            <p className="text-xs text-muted mb-1.5">Want to see what they will see?</p>
            <Link
              href={`/invite/${slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover underline underline-offset-4"
            >
              <span>Preview your public invitation</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </DateInviteCard>

        {/* Create Another Action */}
        <FadeIn delay={0.46}>
          <div className="text-center mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-dark transition-colors py-2 px-4 rounded-full hover:bg-sand-100"
            >
              <span>←</span>
              <span>Create Another Invitation</span>
            </Link>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

// ─── Inline SVG Icons ──────────────────────────────────────────────────────

function CopyIcon({ className = 'w-5 h-5 flex-shrink-0' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}

function CheckIcon({ className = 'w-5 h-5 flex-shrink-0' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0 fill-current" viewBox="0 0 24 24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}
