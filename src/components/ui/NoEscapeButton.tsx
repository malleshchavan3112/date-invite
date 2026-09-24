'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface NoEscapeButtonProps {
  onSelectNo: () => void;
  className?: string;
  id?: string;
  disabled?: boolean;
}

const PLAYFUL_MOBILE_PHRASES = [
  'Wait, really? 🥺',
  'Are you sure? 💔',
  'Nice try! 😏',
];

/**
 * NoEscapeButton — The signature interactive evasive button.
 * 
 * Desktop:
 * - Proximity evasion: runs away when cursor gets within proximity radius.
 * - Physics: Spring easing with boundary reflection.
 * - Never leaves viewport or overlaps hero question/YES button.
 * - Cooldown prevents jitter and rapid layout shifts.
 * 
 * Mobile:
 * - Dedicated touch model (no proximity dodge).
 * - Gentle playful spring wobble & micro-hint.
 * - Always reachable, never frustrates or traps the user.
 * 
 * Keyboard & Accessibility:
 * - Freezes evasion on focus (Tab).
 * - Normal activation via Enter / Space.
 * - Accessible name and full ARIA support.
 */
export default function NoEscapeButton({
  onSelectNo,
  className = '',
  id = 'no-btn',
  disabled = false,
}: NoEscapeButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Position offset (x, y) relative to natural layout position
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isTouch, setIsTouch] = useState(false);
  const [isKeyboardFocused, setIsKeyboardFocused] = useState(false);
  const [mobileTapCount, setMobileTapCount] = useState(0);
  const [playfulHint, setPlayfulHint] = useState<string | null>(null);
  const [wobbleKey, setWobbleKey] = useState(0);

  const lastMoveTime = useRef(0);
  const currentOffsetRef = useRef({ x: 0, y: 0 });
  currentOffsetRef.current = offset;

  // Detect touch / coarse pointer environment
  useEffect(() => {
    const checkTouch = () => {
      const coarse = window.matchMedia('(pointer: coarse)').matches;
      const touchPoints = typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0;
      setIsTouch(coarse || touchPoints);
    };

    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  // Safe boundary constraints for dodging relative to natural position
  // Clamped so it stays safely within the card bounds without hitting edges or overlapping YES
  const BOUNDS = {
    minX: -15, // Prevents moving left into the YES button
    maxX: 110, // Allows playful movement to the right
    minY: -48,
    maxY: 48,
    proximityRadius: 90, // px distance from cursor to button center to trigger dodge
    jumpDistance: 70,    // px distance to jump on each dodge
    cooldownMs: 220,     // ms throttle between evasions to eliminate jitter
  };

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      // Disabled if touch device, keyboard focused, reduced-motion, or disabled prop
      if (isTouch || isKeyboardFocused || prefersReducedMotion || disabled) {
        return;
      }

      const button = buttonRef.current;
      if (!button) return;

      const now = performance.now();
      if (now - lastMoveTime.current < BOUNDS.cooldownMs) {
        return;
      }

      const rect = button.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;

      const cursorX = e.clientX;
      const cursorY = e.clientY;

      const deltaX = btnCenterX - cursorX;
      const deltaY = btnCenterY - cursorY;
      const dist = Math.hypot(deltaX, deltaY);

      if (dist < BOUNDS.proximityRadius) {
        lastMoveTime.current = now;

        // Escape vector pointing away from cursor
        let nx = dist > 1 ? deltaX / dist : Math.random() > 0.5 ? 1 : 0.5;
        let ny = dist > 1 ? deltaY / dist : Math.random() > 0.5 ? 1 : -1;

        // If cursor approaches from the right (deltaX < 0), dodging left would hit the YES button.
        // Deflect upward/downward and keep X positive so it stays clear of YES.
        if (deltaX < 0) {
          nx = Math.random() * 0.4 + 0.3; // Gentle positive X
          ny = deltaY >= 0 ? 0.9 : -0.9;   // Escape vertically
        }

        // Add a slight playful angle
        const angle = (Math.random() - 0.5) * 0.4;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const rx = nx * cos - ny * sin;
        const ry = nx * sin + ny * cos;

        let targetX = currentOffsetRef.current.x + rx * BOUNDS.jumpDistance;
        let targetY = currentOffsetRef.current.y + ry * BOUNDS.jumpDistance;

        // Clamp within safe bounds
        if (targetX < BOUNDS.minX) {
          targetX = Math.random() * 40 + 10;
        } else if (targetX > BOUNDS.maxX) {
          targetX = BOUNDS.maxX * 0.85;
        }

        if (targetY < BOUNDS.minY) {
          targetY = BOUNDS.maxY * 0.75;
        } else if (targetY > BOUNDS.maxY) {
          targetY = BOUNDS.minY * 0.75;
        }

        setOffset({ x: targetX, y: targetY });
      }
    },
    [isTouch, isKeyboardFocused, prefersReducedMotion, disabled, BOUNDS]
  );

  // Global pointer listener on desktop
  useEffect(() => {
    if (isTouch || prefersReducedMotion) return;

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [isTouch, prefersReducedMotion, handlePointerMove]);

  // Click handler (handles both mobile taps and keyboard/fallback desktop clicks)
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (disabled) return;

    // Keyboard activation always proceeds immediately
    if (isKeyboardFocused) {
      onSelectNo();
      return;
    }

    // Mobile touch interaction: playful nudge with escalation
    if (isTouch) {
      const nextCount = mobileTapCount + 1;
      setMobileTapCount(nextCount);
      setWobbleKey((prev) => prev + 1);

      if (nextCount < 3) {
        // Show playful micro-hint
        const phrase = PLAYFUL_MOBILE_PHRASES[(nextCount - 1) % PLAYFUL_MOBILE_PHRASES.length];
        setPlayfulHint(phrase);
        setTimeout(() => setPlayfulHint(null), 1800);
      } else {
        // After 2 playful taps, 3rd tap confirms and opens respectful flow
        onSelectNo();
      }
      return;
    }

    // On desktop, if the user managed to click it:
    onSelectNo();
  };

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      {/* Playful micro-hint for mobile taps */}
      {playfulHint && (
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.9 }}
          animate={{ opacity: 1, y: -28, scale: 1 }}
          exit={{ opacity: 0, y: -34, scale: 0.9 }}
          className="absolute pointer-events-none z-30 whitespace-nowrap bg-dark/90 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md backdrop-blur-sm"
        >
          {playfulHint}
        </motion.div>
      )}

      <motion.div
        animate={
          prefersReducedMotion
            ? { x: 0, y: 0 }
            : {
                x: offset.x,
                y: offset.y,
              }
        }
        transition={{
          type: 'spring',
          stiffness: 340,
          damping: 24,
          mass: 0.7,
        }}
      >
        {/* Wobble motion on touch tap */}
        <motion.div
          key={wobbleKey}
          animate={
            wobbleKey > 0 && !prefersReducedMotion
              ? {
                  rotate: [0, -7, 7, -4, 4, 0],
                  scale: [1, 0.96, 1.02, 0.98, 1],
                }
              : {}
          }
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        >
          <button
            ref={buttonRef}
            id={id}
            type="button"
            disabled={disabled}
            onClick={handleClick}
            onFocus={() => {
              setIsKeyboardFocused(true);
              setOffset({ x: 0, y: 0 }); // Center for keyboard user
            }}
            onBlur={() => setIsKeyboardFocused(false)}
            aria-label="No, decline invitation"
            className={[
              'inline-flex items-center justify-center gap-1.5',
              'px-6 py-3 rounded-full',
              'bg-surface/90 text-muted-foreground hover:text-dark',
              'border border-border/90 shadow-sm hover:shadow',
              'font-sans text-sm sm:text-base font-medium',
              'min-h-[44px] min-w-[100px]',
              'transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
              disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
              className,
            ].join(' ')}
          >
            <span>NO</span>
            <span className="text-xs" aria-hidden="true">😏</span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
