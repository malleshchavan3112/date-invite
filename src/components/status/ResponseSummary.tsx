'use client';

import { motion } from 'framer-motion';
import type { SafeResponseStatus } from '@/types';
import ResponseField from './ResponseField';

interface ResponseSummaryProps {
  response: SafeResponseStatus;
  creatorName?: string;
  className?: string;
}

const DATE_TYPE_LABELS: Record<string, string> = {
  coffee: 'Coffee ☕',
  dinner: 'Dinner 🍷',
  picnic: 'Picnic 🧺',
  adventure: 'Adventure 🗺️',
  movie: 'Movie 🍿',
  surprise: 'Surprise ✨',
};

const ACTIVITY_LABELS: Record<string, string> = {
  outdoor: 'Outdoors 🌲',
  indoor: 'Indoors 🛋️',
  active: 'Active & Lively 🏃',
  relaxed: 'Chill & Relaxed 🍵',
  cultural: 'Art & Culture 🎨',
  surprise_me: 'Surprise Me! 🎲',
};

const LOCATION_LABELS: Record<string, string> = {
  city_center: 'City Center 🏙️',
  neighborhood: 'Cozy Neighborhood 🏡',
  nature: 'Nature & Parks 🍃',
  waterfront: 'Waterfront / Scenic 🌊',
  anywhere: 'Anywhere with you 💫',
};

const DAY_LABELS: Record<string, string> = {
  weekday: 'Weekday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
  any: 'Any Day',
};

const TIME_LABELS: Record<string, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
  night: 'Night',
};

const FOOD_LABELS: Record<string, string> = {
  no_preference: 'No Preference',
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  seafood: 'Seafood',
  street_food: 'Street Food',
  fine_dining: 'Fine Dining',
  no_food: 'Drinks / Activity Only',
};

const SPONTANEITY_LABELS: Record<string, string> = {
  full_plan: 'Fully Planned',
  loose_plan: 'Loose Plan',
  go_with_flow: 'Go with the Flow',
  surprise_me: 'Surprise Me!',
};

const DATE_VIBE_LABELS: Record<string, string> = {
  cozy: 'Cozy',
  romantic: 'Romantic',
  fun: 'Fun',
  fancy: 'Fancy',
  chill: 'Chill',
  spontaneous: 'Spontaneous',
};

function formatFullDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

export default function ResponseSummary({
  response,
  className = '',
}: ResponseSummaryProps) {
  const isYes = response.answer === 'yes';
  const responseDate = formatFullDate(response.submitted_at || response.created_at);

  if (!isYes) {
    // ── Respectful NO Response State ──
    return (
      <div className={`space-y-6 ${className}`}>
        {/* Header */}
        <div className="text-center">
          <div className="relative inline-flex items-center justify-center mb-3">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center shadow-inner"
              aria-hidden="true"
            >
              <span className="text-3xl sm:text-4xl select-none" role="img" aria-label="Respectful handshake">
                🤝
              </span>
            </div>
          </div>

          <div className="mb-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold uppercase tracking-wider">
              <span>Answer: NO</span>
              <span aria-hidden="true">🤝</span>
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl text-dark mb-2 font-normal leading-snug">
            Response Received
          </h2>

          <p className="font-sans text-sm sm:text-base text-muted-foreground max-w-sm mx-auto leading-relaxed">
            The invitation received a NO response. They let you know they can&apos;t make it this time.
          </p>
        </div>

        {/* Details Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-border rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs sm:text-sm text-muted border-b border-border/70 pb-3">
            <span className="font-semibold text-dark">Status:</span>
            <span className="font-medium text-slate-700">Declined respectfully</span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm text-muted">
            <span className="font-semibold text-dark">Date Answered:</span>
            <span className="font-mono text-dark">{responseDate}</span>
          </div>
        </div>

        <div className="text-center py-2">
          <p className="text-xs text-muted/80 leading-relaxed max-w-xs mx-auto">
            &ldquo;Thank you for being open, thoughtful, and giving it a shot.&rdquo;
          </p>
        </div>
      </div>
    );
  }

  // ── Joyful YES Response State ──
  const recipientName = response.recipient_name || 'Someone';

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <div className="relative inline-flex items-center justify-center mb-3">
          {/* Subtle floating celebration particles */}
          <motion.span
            animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6], y: [0, -3, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-2 -left-2 text-base select-none pointer-events-none"
            aria-hidden="true"
          >
            ✨
          </motion.span>
          <motion.span
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.9, 0.5], y: [0, -4, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute -top-3 -right-3 text-sm select-none pointer-events-none"
            aria-hidden="true"
          >
            💕
          </motion.span>
          <motion.span
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.0, repeat: Infinity, ease: 'easeInOut', delay: 1.0 }}
            className="absolute -bottom-2 -left-3 text-xs select-none pointer-events-none"
            aria-hidden="true"
          >
            🎉
          </motion.span>

          {/* Glowing avatar frame */}
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-primary/20 via-rose-100 to-amber-100 border-2 border-primary/30 flex items-center justify-center text-4xl shadow-md">
            💌
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shadow-button border-2 border-white">
            ❤️
          </div>
        </div>

        <div className="mb-2">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-2xs">
            <span>Answer: YES</span>
            <span aria-hidden="true">❤️</span>
          </span>
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl text-dark mb-1.5 font-normal leading-snug">
          🎉 You Received a Response!
        </h2>

        <p className="font-sans text-sm sm:text-base text-muted-foreground max-w-sm mx-auto leading-relaxed">
          <strong className="text-dark font-semibold">{recipientName}</strong> said YES! Here is what they picked for your date:
        </p>
      </div>

      {/* 2-Column Responsive Information Grid (1-column on mobile, 2-column on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
        {/* Recipient Name */}
        <ResponseField
          icon="🏷️"
          label="WHO"
          value={response.recipient_name}
        />

        {/* Date Type */}
        <ResponseField
          icon="🍽️"
          label="DATE TYPE"
          value={response.date_type ? DATE_TYPE_LABELS[response.date_type] || response.date_type : null}
        />

        {/* Activity Preference */}
        <ResponseField
          icon="🌿"
          label="ACTIVITY"
          value={
            response.activity_preference
              ? ACTIVITY_LABELS[response.activity_preference] || response.activity_preference
              : null
          }
        />

        {/* Location Preference */}
        <ResponseField
          icon="🗺️"
          label="SETTING"
          value={
            response.location_preference
              ? LOCATION_LABELS[response.location_preference] || response.location_preference
              : null
          }
        />

        {/* Preferred Day */}
        <ResponseField
          icon="📅"
          label="DAY"
          value={
            response.preferred_day
              ? DAY_LABELS[response.preferred_day] || response.preferred_day
              : null
          }
        />

        {/* Preferred Time */}
        <ResponseField
          icon="⏰"
          label="TIME"
          value={
            response.preferred_time
              ? TIME_LABELS[response.preferred_time] || response.preferred_time
              : null
          }
        />

        {/* Food Preference */}
        <ResponseField
          icon="🍽️"
          label="FOOD"
          value={
            response.food_preference
              ? FOOD_LABELS[response.food_preference] || response.food_preference
              : null
          }
        />

        {/* Spontaneity / Plan Style */}
        <ResponseField
          icon="🎁"
          label="PLAN STYLE"
          value={
            response.spontaneity
              ? SPONTANEITY_LABELS[response.spontaneity] || response.spontaneity
              : null
          }
        />

        {/* Legacy Date Vibe (conditionally displayed only if present) */}
        {response.date_vibe && (
          <ResponseField
            icon="✨"
            label="VIBE"
            value={DATE_VIBE_LABELS[response.date_vibe] || response.date_vibe}
          />
        )}

        {/* Response Date */}
        <ResponseField
          icon="⏱️"
          label="ANSWERED ON"
          value={responseDate}
        />

        {/* Personal Note (Full Width) */}
        {response.message && (
          <div className="col-span-full bg-white/90 border border-primary/20 rounded-2xl p-4 shadow-2xs">
            <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-wider text-muted flex items-center gap-1.5 mb-2">
              <span aria-hidden="true">💌</span>
              <span>PERSONAL NOTE</span>
            </span>
            <p className="text-sm sm:text-base text-dark italic font-serif leading-relaxed">
              &ldquo;{response.message}&rdquo;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
