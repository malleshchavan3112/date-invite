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
 * ChoiceCard — tap-selectable card for questionnaire screens.
 * Keyboard accessible (role="radio" equivalent with aria-checked).
 * Touch target always ≥ 44px.
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
      role="option"
      aria-selected={selected}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={onSelect}
      whileTap={{ scale: 0.97 }}
      whileHover={selected ? {} : { scale: 1.02, y: -2 }}
      animate={selected ? { scale: 1.02 } : { scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className={[
        'choice-card text-left w-full',
        selected ? 'selected' : '',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
      ].join(' ')}
    >
      {emoji && (
        <span
          className="text-2xl leading-none"
          aria-hidden="true"
        >
          {emoji}
        </span>
      )}
      <div className="flex flex-col gap-0.5">
        <span className="font-sans font-semibold text-dark text-base leading-snug">
          {label}
        </span>
        {description && (
          <span className="font-sans text-muted text-sm leading-snug">
            {description}
          </span>
        )}
      </div>
      {/* Selected checkmark */}
      {selected && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="ml-auto flex-shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
          aria-hidden="true"
        >
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="white"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.span>
      )}
    </motion.button>
  );
}
