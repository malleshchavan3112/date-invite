'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface NoEscapeButtonProps {
  onSelectNo: () => void;
  onDodge?: () => void;
  className?: string;
  id?: string;
  disabled?: boolean;
}

const DESKTOP_DODGE_LABELS = [
  'NO 😏',
  'Wait... 😳',
  'Are you sure? 👀',
  'Think again 😂',
  'Really?! 😭',
];

const MOBILE_TAP_MESSAGES = [
  'Wait... seriously? 😳',
  "You've thought about this, huh? 😭",
];

/**
 * NoEscapeButton — The signature interactive evasive button.
 * 
 * Desktop:
 * - Proximity evasion: runs away smoothly when cursor gets within 90px.
 * - Progressively cheeky label on each distinct dodge: "NO 😏" → "Wait... 😳" → "Are you sure? 👀" → "Think again 😂" → "Really?! 😭".
 * - Physics: Spring easing with boundary reflection.
 * - Strictly prevents overlap with the YES button and never leaves the viewport.
 * - Cooldown prevents jitter and rapid layout shifts.
 * 
 * Mobile:
 * - Dedicated touch model (no proximity dodge).
 * - Gentle playful spring wobble & cheeky micro-hint on taps:
 *   Tap 1: "Wait... seriously? 😳"
 *   Tap 2: "You've thought about this, huh? 😭"
 *   Tap 3: Opens respectful confirmation without trapping the user.
 * 
 * Keyboard & Accessibility:
 * - Freezes evasion on focus (Tab) and centers the button.
 * - Label resets to "NO 😏" for clean accessibility.
 * - Normal activation via Enter / Space.
 * - Accessible name and full ARIA support.
 */
export default function NoEscapeButton({
  onSelectNo,
  onDodge,
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
  const [dodgeCount, setDodgeCount] = useState(0);
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
    maxX: 115, // Allows playful movement to the right
    minY: -48,
    maxY: 48,
    proximityRadius: 90, // px distance from cursor to button center to trigger dodge
    jumpDistance: 72,    // px distance to jump on each dodge
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

        // Advance cheeky micro-copy step
        setDodgeCount((prev) => Math.min(prev + 1, DESKTOP_DODGE_LABELS.length - 1));
        if (onDodge) onDodge();

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
    [isTouch, isKeyboardFocused, prefersReducedMotion, disabled, BOUNDS, onDodge]
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

      if (nextCount <= 2) {
        // Show playful micro-hint
        const phrase = MOBILE_TAP_MESSAGES[nextCount - 1] || 'Are you sure? 🥺';
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

  // Resolve current button label
  const currentLabel = isKeyboardFocused
    ? 'NO 😏'
    : DESKTOP_DODGE_LABELS[dodgeCount];

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      {/* Playful micro-hint for mobile taps */}
      <AnimatePresence>
        {playfulHint && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: -32, scale: 1 }}
            exit={{ opacity: 0, y: -38, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 450, damping: 25 }}
            className="absolute pointer-events-none z-30 whitespace-nowrap bg-dark/95 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm border border-white/20"
          >
            {playfulHint}
          </motion.div>
        )}
      </AnimatePresence>

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
                  rotate: [0, -8, 8, -5, 5, 0],
                  scale: [1, 0.95, 1.03, 0.98, 1],
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
              'min-h-[48px] min-w-[110px]',
              'transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
              disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
              className,
            ].join(' ')}
          >
            <span className="whitespace-nowrap transition-all duration-150">
              {currentLabel}
            </span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
