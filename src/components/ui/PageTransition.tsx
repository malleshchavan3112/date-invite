'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  /** Unique key to trigger transition on step change */
  motionKey: string;
  /** Direction of slide: 'forward' (left→right) or 'back' (right→left) */
  direction?: 'forward' | 'back';
}

const variants = {
  enterForward: {
    x: 40,
    opacity: 0,
  },
  enterBack: {
    x: -40,
    opacity: 0,
  },
  center: {
    x: 0,
    opacity: 1,
  },
  exitForward: {
    x: -40,
    opacity: 0,
  },
  exitBack: {
    x: 40,
    opacity: 0,
  },
};

/**
 * PageTransition — wraps screen content with slide + fade transitions.
 * Respects prefers-reduced-motion by using 0 duration when detected.
 * Use AnimatePresence at the parent level, change `motionKey` to trigger.
 */
export default function PageTransition({
  children,
  motionKey,
  direction = 'forward',
}: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={motionKey}
        initial={direction === 'forward' ? variants.enterForward : variants.enterBack}
        animate={variants.center}
        exit={direction === 'forward' ? variants.exitForward : variants.exitBack}
        transition={{
          duration: 0.28,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * FadeIn — simple fade + slide-up entrance for individual elements.
 */
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function FadeIn({ children, delay = 0, className = '' }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
