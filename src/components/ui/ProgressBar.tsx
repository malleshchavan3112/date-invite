'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  /** Current step (1-indexed) */
  current: number;
  /** Total number of steps */
  total: number;
  /** Optional label for screen readers */
  label?: string;
}

/**
 * ProgressBar — animated horizontal progress indicator.
 * Used across P06–P12 (questionnaire + review).
 * Accessible: role="progressbar" with aria-valuenow/min/max.
 */
export default function ProgressBar({ current, total, label }: ProgressBarProps) {
  const percentage = Math.min(Math.round((current / total) * 100), 100);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Step counter */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-label uppercase tracking-widest text-muted font-sans">
          {label ?? `Step ${current} of ${total}`}
        </span>
        <span className="text-label text-primary font-sans font-semibold">
          {percentage}%
        </span>
      </div>

      {/* Track */}
      <div
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={label ?? `Step ${current} of ${total}`}
        className="h-1.5 w-full bg-soft-pink rounded-full overflow-hidden"
      >
        {/* Fill */}
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      </div>

      {/* Dot indicators for small step counts */}
      {total <= 7 && (
        <div
          className="flex items-center justify-center gap-1.5 mt-3"
          aria-hidden="true"
        >
          {Array.from({ length: total }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: i === current - 1 ? 20 : 6,
                backgroundColor: i < current ? '#FF4F7B' : '#FFE4EC',
              }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="h-1.5 rounded-full"
            />
          ))}
        </div>
      )}
    </div>
  );
}
