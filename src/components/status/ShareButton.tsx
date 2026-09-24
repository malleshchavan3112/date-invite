'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareButtonProps {
  url: string;
  title?: string;
  text?: string;
  className?: string;
  id?: string;
}

export default function ShareButton({
  url,
  title = "You're Invited 💌",
  text = 'Someone has a special date invitation for you.',
  className = '',
  id = 'share-btn',
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [hasWebShare, setHasWebShare] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setHasWebShare(true);
    }
  }, []);

  const handleShare = useCallback(async () => {
    if (!url) return;

    if (hasWebShare && navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (err: unknown) {
        // User aborted or dismissed the share sheet
        if ((err as Error)?.name !== 'AbortError') {
          // Fall back to clipboard
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  }, [url, title, text, hasWebShare]);

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setCopied(true);
      setAnnouncement('Link copied to clipboard!');
      setTimeout(() => {
        setCopied(false);
        setAnnouncement('');
      }, 2500);
    } catch {
      setAnnouncement('Failed to copy link.');
    }
  };

  return (
    <>
      <span className="sr-only" aria-live="polite" role="status">
        {announcement}
      </span>
      <button
        type="button"
        onClick={handleShare}
        id={id}
        aria-label={copied ? 'Link copied' : hasWebShare ? 'Share invitation' : 'Copy invitation link to share'}
        className={`inline-flex items-center justify-center gap-2 rounded-full font-sans font-semibold transition-all duration-200 select-none min-h-[48px] px-6 text-sm sm:text-base border-2 bg-white text-dark border-border hover:border-primary/40 hover:bg-sand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 shadow-xs active:scale-[0.98] ${
          copied ? '!border-emerald-400 !bg-emerald-50 !text-emerald-700' : ''
        } ${className}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="copied"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="inline-flex items-center gap-2"
            >
              <CheckIcon />
              <span>Link copied!</span>
            </motion.span>
          ) : (
            <motion.span
              key="share"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="inline-flex items-center gap-2"
            >
              {hasWebShare ? <ShareIcon /> : <CopyIcon />}
              <span>{hasWebShare ? 'Share Invitation' : 'Copy Link to Share'}</span>
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </>
  );
}

function ShareIcon({ className = 'w-5 h-5 flex-shrink-0' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
      />
    </svg>
  );
}

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
