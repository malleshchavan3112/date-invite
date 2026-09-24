'use client';

import { motion } from 'framer-motion';

interface ChoiceCardProps {
  id: string;
  label: string;
  emoji?: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

/**
 * ChoiceCard — Tap-selectable card for questionnaire screens (P07–P10).
 * Highly accessible with full keyboard support and touch target >= 48px.
 * Features smooth spring animation on select, subtle elevation, and clear checkmark.
 */
export default function ChoiceCard({
  id,
  label,
  emoji,
  description,
  selected,
  onSelect,
  disabled = false,
}: ChoiceCardProps) {
  return (
    <motion.button
      id={id}
      type="button"
      role="radio"
      aria-checked={selected}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={onSelect}
      whileTap={{ scale: 0.98 }}
      whileHover={disabled ? {} : { y: -2 }}
      animate={
        selected
          ? { scale: 1.01, y: -2 }
          : { scale: 1, y: 0 }
      }
      transition={{ type: 'spring', stiffness: 450, damping: 28 }}
      className={[
        'choice-card text-left w-full flex items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl sm:rounded-3xl',
        'border-2 transition-all duration-200 min-h-[58px] relative overflow-hidden',
        selected
          ? 'border-primary bg-gradient-to-r from-primary-subtle/90 to-pink-50/90 shadow-[0_6px_22px_-2px_rgba(255,79,123,0.22)] ring-1 ring-primary/20'
          : 'border-border/80 bg-white/90 hover:border-primary/40 hover:bg-white hover:shadow-md',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {emoji && (
          <span
            className="text-2xl sm:text-3xl flex-shrink-0 select-none leading-none drop-shadow-2xs"
            aria-hidden="true"
          >
            {emoji}
          </span>
        )}
        <div className="flex flex-col text-left">
          <span className="font-sans font-semibold text-dark text-sm sm:text-base leading-snug">
            {label}
          </span>
          {description && (
            <span className="font-sans text-muted-foreground text-xs sm:text-sm leading-tight mt-0.5">
              {description}
            </span>
          )}
        </div>
      </div>

      {/* Selected checkmark indicator with sparkle */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {selected && (
          <motion.span
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            className="text-xs select-none"
            aria-hidden="true"
          >
            ✨
          </motion.span>
        )}
        <motion.div
          animate={selected ? { scale: 1 } : { scale: 0.88 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          className={[
            'w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200',
            selected
              ? 'bg-gradient-to-tr from-primary to-[#E93668] text-white shadow-sm'
              : 'border border-border/80 bg-transparent text-transparent',
          ].join(' ')}
          aria-hidden="true"
        >
          <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
            <path
              d="M1.5 5L4.5 8L10.5 1.5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>
    </motion.button>
  );
}
