'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';

interface PrimaryButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

/**
 * PrimaryButton — the main CTA button.
 * Styled with press feedback, hover lift, and optional loading state.
 * Touch target ≥ 44px. Focus ring visible.
 */
const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ children, loading = false, fullWidth = false, className = '', disabled, ...props }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.96 }}
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        className={[
          'btn-primary',
          fullWidth ? 'w-full' : '',
          isDisabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : '',
          className,
        ].join(' ')}
        {...props}
      >
        {loading ? (
          <>
            <LoadingSpinner />
            <span>Just a moment…</span>
          </>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

PrimaryButton.displayName = 'PrimaryButton';

// ─── Inline spinner for loading state ────────────────────────────────────

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export default PrimaryButton;
