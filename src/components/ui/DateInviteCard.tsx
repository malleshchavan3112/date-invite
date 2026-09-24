'use client';

import { motion } from 'framer-motion';

interface DateInviteCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  id?: string;
  role?: string;
  glow?: boolean;
  'aria-label'?: string;
}

/**
 * DateInviteCard — Premium paper/glass hybrid card surface for DateInvite.
 * 
 * Features:
 * - Translucent warm cream surface with backdrop blur
 * - Layered ambient drop shadows with subtle romantic rose tint
 * - Soft inner border highlight (ring-1 ring-white/70)
 * - Large architectural rounded corners (rounded-[2rem] sm:rounded-[2.5rem])
 * - Subtle hover lift and depth transition
 * - Optional ambient glow halo aura
 */
export default function DateInviteCard({
  children,
  className = '',
  delay = 0,
  id,
  role,
  glow = false,
  'aria-label': ariaLabel,
}: DateInviteCardProps) {
  return (
    <motion.div
      id={id}
      role={role}
      aria-label={ariaLabel}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -14, scale: 0.98 }}
      transition={{
        duration: 0.38,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={[
        'w-full max-w-md mx-auto relative',
        'bg-gradient-to-b from-white/95 via-white/90 to-[#FFFDF9]/90',
        'backdrop-blur-xl',
        'rounded-[2rem] sm:rounded-[2.5rem]',
        'p-6 sm:p-9',
        'border border-[#FF4F7B]/15',
        'ring-1 ring-white/70',
        glow
          ? 'shadow-[0_16px_48px_-6px_rgba(255,79,123,0.18),0_2px_12px_-2px_rgba(31,31,31,0.05)]'
          : 'shadow-[0_12px_36px_-8px_rgba(255,79,123,0.11),0_2px_10px_-2px_rgba(31,31,31,0.04)]',
        'hover:shadow-[0_20px_52px_-8px_rgba(255,79,123,0.20),0_4px_16px_-2px_rgba(31,31,31,0.06)]',
        'transition-all duration-300',
        className,
      ].join(' ')}
    >
      {/* Optional ambient soft aura */}
      {glow && (
        <div
          className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-primary/10 via-rose-300/10 to-amber-200/10 blur-xl -z-10 pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Subtle top-edge paper sheen */}
      <div
        className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none"
        aria-hidden="true"
      />
      {children}
    </motion.div>
  );
}
