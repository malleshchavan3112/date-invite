'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CopyLinkButtonProps {
  url: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'compact' | 'icon';
  id?: string;
}

export default function CopyLinkButton({
  url,
  className = '',
  variant = 'primary',
  id = 'copy-link-btn',
}: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const handleCopy = useCallback(async () => {
    if (!url) return;

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
      setAnnouncement('Failed to copy. Please manually copy the link.');
    }
  }, [url]);

  if (variant === 'icon') {
    return (
      <>
        <span className="sr-only" aria-live="polite" role="status">
          {announcement}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          id={id}
          aria-label={copied ? 'Link copied' : 'Copy link to clipboard'}
          className={`p-2 rounded-xl text-muted hover:text-primary hover:bg-primary-subtle transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${className}`}
          title="Copy link to clipboard"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </>
    );
  }

  if (variant === 'compact') {
    return (
      <>
        <span className="sr-only" aria-live="polite" role="status">
          {announcement}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          id={id}
          aria-label={copied ? 'Link copied' : 'Copy link'}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all select-none ${
            copied
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-sand-100 text-dark hover:bg-primary-subtle hover:text-primary border border-border'
          } ${className}`}
        >
          {copied ? (
            <>
              <CheckIcon className="w-3.5 h-3.5" />
              <span>Link copied!</span>
            </>
          ) : (
            <>
              <CopyIcon className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </>
    );
  }

  const baseStyles =
    'inline-flex items-center justify-center gap-2 rounded-full font-sans font-semibold transition-all duration-200 select-none min-h-[48px] px-6 text-sm sm:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

  const variantStyles =
    variant === 'secondary'
      ? copied
        ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-400'
        : 'bg-white text-dark border-2 border-border hover:border-primary/40 hover:bg-sand-50 focus-visible:ring-primary/40 shadow-xs'
      : copied
      ? '!bg-emerald-600 hover:!bg-emerald-700 text-white shadow-button border border-emerald-700 focus-visible:ring-emerald-500'
      : 'bg-primary hover:bg-primary-hover text-white shadow-button hover:shadow-button-hover active:scale-[0.98] focus-visible:ring-primary';

  return (
    <>
      <span className="sr-only" aria-live="polite" role="status">
        {announcement}
      </span>
      <button
        type="button"
        onClick={handleCopy}
        id={id}
        aria-label={copied ? 'Link copied to clipboard' : 'Copy invitation link'}
        className={`${baseStyles} ${variantStyles} ${className}`}
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
              key="copy"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="inline-flex items-center gap-2"
            >
              <CopyIcon />
              <span>Copy Invitation Link</span>
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </>
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
