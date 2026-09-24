'use client';

import { motion } from 'framer-motion';

interface ResponseTimelineProps {
  invitationCreatedAt: string;
  responseSubmittedAt?: string | null;
  hasResponse: boolean;
  answer?: 'yes' | 'no';
  className?: string;
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

export default function ResponseTimeline({
  invitationCreatedAt,
  responseSubmittedAt,
  hasResponse,
  answer,
  className = '',
}: ResponseTimelineProps) {
  const createdDate = formatDate(invitationCreatedAt);
  const responseDate = formatDate(responseSubmittedAt);

  return (
    <div
      className={`w-full bg-white/70 backdrop-blur-md rounded-2xl border border-primary/15 p-4 sm:p-5 shadow-2xs ${className}`}
      aria-label="Invitation progress timeline"
    >
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-4 flex items-center gap-1.5">
        <span aria-hidden="true">⏱️</span>
        <span>Timeline</span>
      </h3>

      <div className="relative pl-6 sm:pl-7 space-y-6 before:absolute before:left-2.5 sm:before:left-3 before:top-2 before:bottom-3 before:w-[2px] before:bg-gradient-to-b before:from-emerald-400 before:via-emerald-300 before:to-border">
        {/* Step 1: Created */}
        <div className="relative group">
          <div
            className="absolute -left-6 sm:-left-7 top-0.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs border-2 border-white ring-1 ring-emerald-200"
            aria-hidden="true"
          >
            ✓
          </div>
          <div>
            <div className="flex items-baseline justify-between gap-2 flex-wrap">
              <span className="text-sm font-semibold text-dark">Invitation Created</span>
              {createdDate && (
                <span className="text-xs text-muted font-mono">{createdDate}</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Personalized invitation link generated.
            </p>
          </div>
        </div>

        {/* Step 2: Shared */}
        <div className="relative group">
          <div
            className="absolute -left-6 sm:-left-7 top-0.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs border-2 border-white ring-1 ring-emerald-200"
            aria-hidden="true"
          >
            ✓
          </div>
          <div>
            <div className="flex items-baseline justify-between gap-2 flex-wrap">
              <span className="text-sm font-semibold text-dark">Link Ready & Shared</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ready for the recipient to open and respond.
            </p>
          </div>
        </div>

        {/* Step 3: Response */}
        <div className="relative group">
          {hasResponse ? (
            <>
              <div
                className={`absolute -left-6 sm:-left-7 top-0.5 w-5 h-5 rounded-full ${
                  answer === 'yes' ? 'bg-primary text-white' : 'bg-slate-600 text-white'
                } flex items-center justify-center text-[10px] font-bold shadow-xs border-2 border-white ring-1 ring-primary/30`}
                aria-hidden="true"
              >
                {answer === 'yes' ? '❤️' : '✓'}
              </div>
              <div>
                <div className="flex items-baseline justify-between gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-dark">
                    {answer === 'yes' ? 'Response Received: YES 🎉' : 'Response Received: NO 🤝'}
                  </span>
                  {responseDate && (
                    <span className="text-xs text-muted font-mono">{responseDate}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {answer === 'yes'
                    ? 'Recipient accepted and submitted their preferences.'
                    : 'Recipient sent a polite NO response.'}
                </p>
              </div>
            </>
          ) : (
            <>
              <div
                className="absolute -left-6 sm:-left-7 top-0.5 w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-[10px] border-2 border-white ring-1 ring-amber-300"
                aria-hidden="true"
              >
                <motion.div
                  animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-2 h-2 rounded-full bg-amber-500"
                />
              </div>
              <div>
                <div className="flex items-baseline justify-between gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-dark flex items-center gap-1.5">
                    <span>Waiting for Response</span>
                    <span className="inline-block animate-pulse text-amber-500 text-xs">⏳</span>
                  </span>
                  <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full">
                    Pending
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Awaiting your date&apos;s answer. This dashboard updates once received!
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
