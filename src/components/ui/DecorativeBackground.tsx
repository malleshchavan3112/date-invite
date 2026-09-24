'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * DecorativeBackground — Ambient romantic background for DateInvite.
 * Renders soft blurred gradient orbs and delicate floating micro-petals.
 * Strictly respects prefers-reduced-motion (disables motion, lowers opacity).
 */
export default function DecorativeBackground() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
    >
      {/* Soft blurred ambient glow orbs */}
      <motion.div
        className="absolute -top-24 -left-24 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-gradient-to-br from-rose-200/40 to-pink-100/30 blur-3xl"
        animate={
          prefersReducedMotion
            ? {}
            : {
                x: [0, 20, 0],
                y: [0, 15, 0],
                scale: [1, 1.05, 1],
              }
        }
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute -bottom-24 -right-24 w-80 sm:w-[28rem] h-80 sm:h-[28rem] rounded-full bg-gradient-to-tl from-amber-100/40 via-rose-100/30 to-pink-100/20 blur-3xl"
        animate={
          prefersReducedMotion
            ? {}
            : {
                x: [0, -25, 0],
                y: [0, -20, 0],
                scale: [1, 1.08, 1],
              }
        }
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      <motion.div
        className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-pink-100/25 blur-2xl"
        animate={
          prefersReducedMotion
            ? {}
            : {
                y: [0, -15, 0],
                opacity: [0.25, 0.45, 0.25],
              }
        }
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      {/* Floating subtle romantic micro-particles */}
      {!prefersReducedMotion && (
        <>
          <PetalParticle x="12%" y="20%" size={12} delay={0} dur={9} rot={20} />
          <PetalParticle x="88%" y="18%" size={14} delay={1.5} dur={10} rot={-35} />
          <PetalParticle x="8%" y="72%" size={10} delay={0.8} dur={8.5} rot={45} />
          <PetalParticle x="84%" y="78%" size={13} delay={2.2} dur={11} rot={-15} />
          <PetalParticle x="52%" y="6%" size={9} delay={3.1} dur={9.5} rot={10} />
        </>
      )}
    </div>
  );
}

interface PetalParticleProps {
  x: string;
  y: string;
  size: number;
  delay: number;
  dur: number;
  rot: number;
}

function PetalParticle({ x, y, size, delay, dur, rot }: PetalParticleProps) {
  return (
    <motion.div
      className="absolute pointer-events-none opacity-40"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: [0.2, 0.5, 0.2],
        y: [0, -18, 0],
        x: [0, 8, 0],
        rotate: [rot, rot + 15, rot],
      }}
      transition={{
        duration: dur,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    >
      <svg
        width={size}
        height={size * 1.3}
        viewBox="0 0 16 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 0C3.5 6 0 11.5 0 15C0 18.8 3.6 22 8 22C12.4 22 16 18.8 16 15C16 11.5 12.5 6 8 0Z"
          fill="#FF7A9B"
          fillOpacity="0.45"
        />
      </svg>
    </motion.div>
  );
}
