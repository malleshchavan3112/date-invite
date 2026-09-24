'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * AnimatedRomanticBackground / DecorativeBackground
 * 
 * Multi-layered atmospheric environment for DateInvite:
 * Layer 1: Ambient soft floating gradient orbs (20-26s breathing cycle)
 * Layer 2: Curated romantic SVG vector doodles (hearts, sparkles, envelopes, florals)
 * Layer 3: Subtle glowing stardust particles
 * 
 * Performance & Accessibility Guarantees:
 * - Controlled density: 10-12 elements on desktop, 5-6 on mobile via responsive classes
 * - CSS transform & opacity hardware acceleration
 * - Strictly pointer-events-none and -z-10 (behind all interactive UI)
 * - 100% compliant with prefers-reduced-motion (motion halts, opacity softens)
 */
export default function DecorativeBackground() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
    >
      {/* ── Soft Warm Canvas Base ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF9] via-[#FFF8F5] to-[#FFF3F6]" />

      {/* ── LAYER 1: Ambient Breathing Gradient Orbs ── */}
      <motion.div
        className="absolute -top-32 -left-32 w-[28rem] sm:w-[38rem] h-[28rem] sm:h-[38rem] rounded-full bg-gradient-to-br from-[#FFE4EC]/55 via-[#FFD6E3]/40 to-transparent blur-[90px]"
        animate={
          prefersReducedMotion
            ? {}
            : {
                x: [0, 24, 0],
                y: [0, 18, 0],
                scale: [1, 1.06, 1],
              }
        }
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute -bottom-36 -right-36 w-[30rem] sm:w-[42rem] h-[30rem] sm:h-[42rem] rounded-full bg-gradient-to-tl from-[#FFEBF0]/60 via-[#FCE7F3]/40 to-[#FFF0F5]/20 blur-[100px]"
        animate={
          prefersReducedMotion
            ? {}
            : {
                x: [0, -28, 0],
                y: [0, -22, 0],
                scale: [1, 1.08, 1],
              }
        }
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1.5,
        }}
      />

      <motion.div
        className="absolute top-1/4 right-5 sm:right-1/4 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-gradient-to-tr from-[#FFF3E8]/45 via-[#FFE4EC]/35 to-transparent blur-[85px]"
        animate={
          prefersReducedMotion
            ? {}
            : {
                y: [0, -20, 0],
                scale: [1, 1.05, 1],
                opacity: [0.35, 0.55, 0.35],
              }
        }
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 3,
        }}
      />

      {/* ── LAYER 2: Floating Romantic Vector Elements ── */}
      {!prefersReducedMotion ? (
        <>
          {/* Top Left Heart */}
          <FloatingElement x="8%" y="14%" dur={11} delay={0.2} rot={-12}>
            <HeartSvg className="w-5 h-5 text-primary/30" />
          </FloatingElement>

          {/* Top Right Sparkle */}
          <FloatingElement x="86%" y="12%" dur={13} delay={1.2} rot={20}>
            <SparkleSvg className="w-6 h-6 text-[#E93668]/35" />
          </FloatingElement>

          {/* Left Mid Mini Envelope (Desktop only for controlled density) */}
          <div className="hidden sm:block">
            <FloatingElement x="6%" y="45%" dur={14} delay={2.5} rot={-8}>
              <EnvelopeSvg className="w-6 h-6 text-[#C97C91]/35" />
            </FloatingElement>
          </div>

          {/* Right Mid Flower Floral */}
          <FloatingElement x="91%" y="48%" dur={12} delay={0.8} rot={18}>
            <FlowerSvg className="w-5 h-5 text-primary/30" />
          </FloatingElement>

          {/* Bottom Left Sparkle */}
          <FloatingElement x="12%" y="78%" dur={10} delay={1.8} rot={-15}>
            <StarSvg className="w-5 h-5 text-[#D7A84B]/40" />
          </FloatingElement>

          {/* Bottom Right Soft Heart */}
          <FloatingElement x="84%" y="82%" dur={12} delay={3.1} rot={14}>
            <HeartSvg filled className="w-5 h-5 text-primary/25" />
          </FloatingElement>

          {/* Top Center-Right Micro Bow / Sparkle (Desktop only) */}
          <div className="hidden md:block">
            <FloatingElement x="64%" y="16%" dur={15} delay={2.0} rot={-10}>
              <SparkleSvg className="w-4 h-4 text-primary/25" />
            </FloatingElement>
          </div>

          {/* Bottom Center-Left Little Calendar Symbol (Desktop only) */}
          <div className="hidden md:block">
            <FloatingElement x="32%" y="86%" dur={16} delay={3.5} rot={8}>
              <CalendarSvg className="w-5 h-5 text-[#C97C91]/30" />
            </FloatingElement>
          </div>
        </>
      ) : (
        /* Reduced Motion Fallback: Fixed, tranquil positions with low opacity */
        <div className="opacity-25">
          <div className="absolute top-[14%] left-[8%]"><HeartSvg className="w-5 h-5 text-primary/30" /></div>
          <div className="absolute top-[12%] right-[14%]"><SparkleSvg className="w-6 h-6 text-[#E93668]/35" /></div>
          <div className="absolute bottom-[18%] right-[12%]"><HeartSvg filled className="w-5 h-5 text-primary/25" /></div>
          <div className="absolute bottom-[22%] left-[12%]"><StarSvg className="w-5 h-5 text-[#D7A84B]/40" /></div>
        </div>
      )}

      {/* ── LAYER 3: Tiny Ambient Glowing Stardust Particles ── */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0">
          <StardustParticle x="20%" y="28%" size={4} dur={7} delay={0} />
          <StardustParticle x="78%" y="32%" size={5} dur={8.5} delay={1.8} />
          <StardustParticle x="15%" y="62%" size={3} dur={6.5} delay={2.5} />
          <StardustParticle x="82%" y="68%" size={4} dur={9} delay={1.1} />
          <div className="hidden sm:block">
            <StardustParticle x="48%" y="12%" size={4} dur={7.5} delay={3.2} />
            <StardustParticle x="52%" y="84%" size={3} dur={8} delay={2.0} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Floating Element Wrapper ───────────────────────────────────────────────

interface FloatingElementProps {
  x: string;
  y: string;
  dur: number;
  delay: number;
  rot: number;
  children: React.ReactNode;
}

function FloatingElement({ x, y, dur, delay, rot, children }: FloatingElementProps) {
  return (
    <motion.div
      style={{ left: x, top: y }}
      className="absolute pointer-events-none select-none z-0"
      animate={{
        y: [0, -12, 0],
        rotate: [rot, rot + 6, rot],
        opacity: [0.75, 1, 0.75],
      }}
      transition={{
        duration: dur,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── Stardust Glowing Particle ─────────────────────────────────────────────

interface StardustProps {
  x: string;
  y: string;
  size: number;
  dur: number;
  delay: number;
}

function StardustParticle({ x, y, size, dur, delay }: StardustProps) {
  return (
    <motion.div
      style={{ left: x, top: y, width: size, height: size }}
      className="absolute rounded-full bg-primary/40 blur-[0.5px] pointer-events-none"
      animate={{
        opacity: [0.2, 0.7, 0.2],
        scale: [0.8, 1.3, 0.8],
      }}
      transition={{
        duration: dur,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    />
  );
}

// ─── Curated Romantic Inline SVGs ──────────────────────────────────────────

function HeartSvg({ className = '', filled = false }: { className?: string; filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={filled ? '0' : '1.8'}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function SparkleSvg({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0L14.4 8.6L23 11L14.4 13.4L12 22L9.6 13.4L1 11L9.6 8.6L12 0Z" />
    </svg>
  );
}

function StarSvg({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2l2.4 6.9L21 11.3l-5.4 4.6 1.8 7.1-5.4-3.8-5.4 3.8 1.8-7.1L3 11.3l6.6-2.4L12 2z" />
    </svg>
  );
}

function EnvelopeSvg({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="15" x="2" y="4.5" rx="3" />
      <path d="m22 6.5-10 7-10-7" />
    </svg>
  );
}

function FlowerSvg({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3a3 3 0 0 0 0 6 3 3 0 0 0 0-6z" />
      <path d="M12 15a3 3 0 0 0 0 6 3 3 0 0 0 0-6z" />
      <path d="M3 12a3 3 0 0 0 6 0 3 3 0 0 0-6 0z" />
      <path d="M15 12a3 3 0 0 0 6 0 3 3 0 0 0-6 0z" />
    </svg>
  );
}

function CalendarSvg({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="18" height="17" x="3" y="4" rx="3" />
      <line x1="16" x2="16" y1="2" y2="5" />
      <line x1="8" x2="8" y1="2" y2="5" />
      <line x1="3" x2="21" y1="9" y2="9" />
      <path d="m9 14 2 2 4-4" />
    </svg>
  );
}
