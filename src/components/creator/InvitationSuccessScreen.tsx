'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { FadeIn } from '@/components/ui/PageTransition';

// Decorative celebration floaters
const CELEBRATION_ACCENTS = [
  { emoji: '✨', x: '10%', y: '12%', delay: 0.1, size: 'text-xl', dur: 4.5 },
  { emoji: '💌', x: '85%', y: '15%', delay: 0.3, size: 'text-2xl', dur: 5.2 },
  { emoji: '🎉', x: '7%',  y: '68%', delay: 0.5, size: 'text-lg', dur: 4.8 },
  { emoji: '💕', x: '88%', y: '70%', delay: 0.2, size: 'text-xl', dur: 5.5 },
  { emoji: '💫', x: '75%', y: '86%', delay: 0.4, size: 'text-base', dur: 4.2 },
] as const;

export default function InvitationSuccessScreen() {
  const searchParams = useSearchParams();
  const prefersReducedMotion = useReducedMotion();

  const [slug, setSlug] = useState<string>('');
  const [invitationUrl, setInvitationUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [copyAnnouncement, setCopyAnnouncement] = useState<string>('');

  useEffect(() => {
    // 1. Resolve slug from query param or session storage
    const paramSlug = searchParams.get('slug');
    let resolvedSlug = paramSlug;

    if (!resolvedSlug && typeof window !== 'undefined') {
      resolvedSlug = sessionStorage.getItem('dateinvite_last_slug') || 'demo-date';
    }

    if (!resolvedSlug) {
      resolvedSlug = 'demo-date';
    }

    setSlug(resolvedSlug);

    // 2. Construct absolute invitation URL
    const origin =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : 'https://dateinvite.app';

    setInvitationUrl(`${origin}/invite/${resolvedSlug}`);
  }, [searchParams]);

  // Copy Link action
  const handleCopyLink = async () => {
    if (!invitationUrl) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(invitationUrl);
      } else {
        // Fallback for older browsers
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

      setCopied(true);
      setCopyAnnouncement('Invitation link copied to clipboard.');
      setTimeout(() => {
        setCopied(false);
        setCopyAnnouncement('');
      }, 2500);
    } catch {
      setCopyAnnouncement('Failed to copy. Please manually copy the link.');
    }
  };

  // Native Share action (fallback to copy if unsupported)
  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: "You're Invited 💌",
          text: 'Someone has a date invitation for you.',
          url: invitationUrl,
        });
      } catch (err: unknown) {
        // Ignore user-cancelled share dialogs
        if ((err as Error)?.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      // Fallback to clipboard copy
      handleCopyLink();
    }
  };

  // WhatsApp share link with strict prefilled text
  const getWhatsAppShareUrl = () => {
    const message = `Hey! I made you a little invitation 💌\n\nOpen this:\n${invitationUrl}`;
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="screen relative overflow-hidden bg-bg min-h-dvh flex flex-col justify-center items-center px-4 py-8">
      {/* Accessible live region for copy announcements */}
      <div className="sr-only" aria-live="polite" role="status">
        {copyAnnouncement}
      </div>

      {/* ── Background Celebration Accents ── */}
      {!prefersReducedMotion &&
        CELEBRATION_ACCENTS.map((item, i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            className={`absolute select-none pointer-events-none ${item.size}`}
            style={{ left: item.x, top: item.y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.55, 0.45, 0.55],
              scale: [0, 1, 0.95, 1],
              y: [0, -10, 0],
            }}
            transition={{
              opacity: { delay: item.delay, duration: 0.8 },
              scale:   { delay: item.delay, duration: 0.5 },
              y:       { delay: item.delay + 0.4, duration: item.dur, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            {item.emoji}
          </motion.span>
        ))}

      {/* ── Main Content Container ── */}
      <div className="w-full max-w-md mx-auto relative z-10">
        {/* Success Icon & Heading */}
        <div className="text-center mb-6">
          <FadeIn delay={0.08}>
            <div className="relative inline-flex items-center justify-center mb-4">
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 350, damping: 20, delay: 0.1 }}
                className="w-20 h-20 rounded-full bg-soft-pink border-2 border-primary/30 flex items-center justify-center text-4xl shadow-card"
              >
                💌
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 450, damping: 18, delay: 0.3 }}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-sm shadow-button"
              >
                ✓
              </motion.div>
            </div>
          </FadeIn>

          <FadeIn delay={0.18}>
            <h1 className="font-serif text-display-md text-dark mb-2.5 leading-tight text-balance">
              Your invitation is ready&nbsp;✨
            </h1>
          </FadeIn>

          <FadeIn delay={0.26}>
            <p className="font-sans text-body-md text-muted max-w-xs mx-auto text-balance">
              Now send this link to the person you&apos;d love to hear from.
            </p>
          </FadeIn>
        </div>

        {/* Link Card & Action Container */}
        <FadeIn delay={0.34}>
          <div className="content-card bg-surface rounded-3xl p-6 sm:p-8 shadow-card border border-border space-y-6">
            {/* Shareable Link Display */}
            <div>
              <label
                htmlFor="invitation-url-display"
                className="block text-label uppercase tracking-wider text-muted font-sans font-semibold mb-2"
              >
                Your Private Invitation Link
              </label>
              <div
                id="invitation-url-display"
                className="flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl bg-sand-50/70 border border-border text-dark text-sm sm:text-base font-mono break-all select-all group hover:border-primary/40 transition-colors"
              >
                <span className="truncate text-dark/90 font-medium">
                  {invitationUrl || 'Generating link…'}
                </span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  aria-label="Copy invitation link"
                  className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-soft-pink/60 transition-colors flex-shrink-0"
                  title="Copy to clipboard"
                >
                  <CopyIcon />
                </button>
              </div>
            </div>

            {/* Actions Stack */}
            <div className="space-y-3 pt-1">
              {/* Primary: Copy Link Button */}
              <PrimaryButton
                type="button"
                onClick={handleCopyLink}
                fullWidth
                id="copy-link-btn"
                className={copied ? '!bg-emerald-600 hover:!bg-emerald-700' : ''}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {copied ? (
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
                      Copy Link
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
                className="w-full inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-base font-semibold transition-all duration-180 bg-[#25D366] text-white hover:bg-[#20BA5A] shadow-sm hover:shadow active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 min-h-[44px]"
              >
                <WhatsAppIcon />
                Share on WhatsApp
              </a>
            </div>

            {/* Preview link for creator testing */}
            <div className="pt-2 border-t border-border/60 text-center">
              <p className="text-xs text-muted mb-2">Want to see what they will see?</p>
              <Link
                href={`/invite/${slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover underline underline-offset-4"
              >
                <span>Preview your invitation</span>
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </FadeIn>

        {/* Create Another Action */}
        <FadeIn delay={0.46}>
          <div className="text-center mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-dark transition-colors py-2 px-4 rounded-full hover:bg-sand-100"
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

function CopyIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
