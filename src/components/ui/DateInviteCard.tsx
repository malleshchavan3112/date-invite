'use client';

import { motion } from 'framer-motion';

interface DateInviteCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  id?: string;
  role?: string;
  'aria-label'?: string;
}

/**
 * DateInviteCard — Premium card surface for all invitation & questionnaire steps.
 * Features calibrated cream surface, soft backdrop blur, rose-tinted border,
 * and elevated depth shadow.
 */
export default function DateInviteCard({
  children,
  className = '',
  delay = 0,
  id,
  role,
  'aria-label': ariaLabel,
}: DateInviteCardProps) {
  return (
    <motion.div
      id={id}
      role={role}
      aria-label={ariaLabel}
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -14, scale: 0.98 }}
      transition={{
        duration: 0.38,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={[
        'w-full max-w-md mx-auto',
        'bg-surface/95 backdrop-blur-md',
        'rounded-[2rem] sm:rounded-[2.25rem]',
        'p-6 sm:p-8',
        'border border-border/80',
        'shadow-card hover:shadow-card-hover',
        'transition-shadow duration-300 relative',
        className,
      ].join(' ')}
    >
      {children}
    </motion.div>
  );
}
