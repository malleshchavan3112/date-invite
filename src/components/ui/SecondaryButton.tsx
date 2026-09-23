'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';

interface SecondaryButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * SecondaryButton — ghost/outlined style for secondary actions.
 * Used for "Skip", "Back", "No thanks", etc.
 */
const SecondaryButton = forwardRef<HTMLButtonElement, SecondaryButtonProps>(
  ({ children, fullWidth = false, className = '', disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        disabled={disabled}
        aria-disabled={disabled}
        className={[
          'btn-secondary',
          fullWidth ? 'w-full' : '',
          disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : '',
          className,
        ].join(' ')}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

SecondaryButton.displayName = 'SecondaryButton';

export default SecondaryButton;
