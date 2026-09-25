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
  className?: string;
}

/**
 * ChoiceCard — Tap-selectable card for questionnaire screens (P07–P13).
 * Highly accessible with full keyboard support and touch target >= 48px.
 * Features smooth spring animation on select, compact yet breathable proportions,
 * stronger selected state, and responsive desktop grid alignment.
 */
export default function ChoiceCard({
  id,
  label,
  emoji,
  description,
  selected,
  onSelect,
  disabled = false,
  className = '',
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
      whileHover={disabled ? {} : { y: -1.5 }}
      animate={
        selected
          ? { scale: 1.01, y: -1.5 }
          : { scale: 1, y: 0 }
      }
      transition={{ type: 'spring', stiffness: 450, damping: 28 }}
      className={[
        'text-left w-full h-full flex items-center justify-between gap-3',
        'p-3.5 sm:px-4 sm:py-3.5 rounded-xl sm:rounded-2xl',
        'border-2 transition-all duration-200 min-h-[54px] sm:min-h-[58px] relative overflow-hidden',
        selected
          ? 'border-primary bg-gradient-to-r from-primary-subtle via-rose-50/70 to-white shadow-[0_4px_16px_-2px_rgba(255,79,123,0.18)] ring-1 ring-primary/25'
          : 'border-border/75 bg-white/95 hover:border-primary/40 hover:bg-white hover:shadow-sm',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className,
      ].join(' ')}
    >
      <div className="flex items-center gap-3 min-w-0">
        {emoji && (
          <span
            className="text-xl sm:text-2xl flex-shrink-0 select-none leading-none drop-shadow-2xs"
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
            <span className="font-sans text-muted-foreground text-xs sm:text-[13px] leading-normal mt-0.5">
              {description}
            </span>
          )}
        </div>
      </div>

      {/* Selected checkmark indicator with sparkle */}
      <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
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
            'w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full flex items-center justify-center transition-all duration-200',
            selected
              ? 'bg-gradient-to-tr from-primary to-[#E93668] text-white shadow-xs'
              : 'border border-border/80 bg-sand-50/60 text-transparent',
          ].join(' ')}
          aria-hidden="true"
        >
          <svg width="10" height="8" viewBox="0 0 12 10" fill="none">
            <path
              d="M1.5 5L4.5 8L10.5 1.5"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>
    </motion.button>
  );
}
