'use client';

import { motion } from 'framer-motion';

export type CardSizeVariant =
  | 'default'
  | 'questionnaire'
  | 'dashboard'
  | 'compact'
  | 'narrow'
  | 'wide';

interface DateInviteCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  id?: string;
  role?: string;
  glow?: boolean;
  size?: CardSizeVariant;
  'aria-label'?: string;
}

const SIZE_CLASSES: Record<CardSizeVariant, string> = {
  default: 'w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-[736px] mx-auto relative',
  questionnaire: 'w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-[736px] mx-auto relative',
  dashboard: 'w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-[780px] mx-auto relative',
  compact: 'w-full max-w-sm sm:max-w-md mx-auto relative',
  narrow: 'w-full max-w-md sm:max-w-lg mx-auto relative',
  wide: 'w-full max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-4xl mx-auto relative',
};

/**
 * DateInviteCard — Premium paper/glass hybrid card surface for DateInvite.
 * 
 * Features:
 * - Controlled responsive max-width system (680px–760px on desktop for questionnaire)
 * - Translucent warm cream surface with backdrop blur
 * - Layered ambient drop shadows with subtle romantic rose tint
 * - Soft inner border highlight (ring-1 ring-white/70)
 * - Large architectural rounded corners (rounded-[2rem] sm:rounded-[2.25rem] lg:rounded-[2.5rem])
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
  size = 'default',
  'aria-label': ariaLabel,
}: DateInviteCardProps) {
  // If className already specifies a max-w override, avoid duplicating default width
  const hasCustomMaxWidth = className.includes('max-w-') || className.includes('!max-w-');
  const widthClass = hasCustomMaxWidth ? 'w-full mx-auto relative' : SIZE_CLASSES[size];

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
        widthClass,
        'bg-gradient-to-b from-white/95 via-white/90 to-[#FFFDF9]/90',
        'backdrop-blur-xl',
        'rounded-[2rem] sm:rounded-[2.25rem] lg:rounded-[2.5rem]',
        'p-5 sm:p-7 lg:p-9',
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
